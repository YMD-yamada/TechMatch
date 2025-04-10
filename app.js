
const questions = [
  {
    q: "あなたの専攻は？",
    a: ["情報系", "機械系", "電気電子系", "医・薬・バイオ系", "物理・計測系", "文系／その他"]
  },
  {
    q: "興味のある業務は？",
    a: ["開発（ソフト・製品）", "設計・構造", "品質・検査", "営業・顧客対応", "管理・戦略・総務", "物流・調達"]
  },
  {
    q: "チームで働くのが好き？",
    a: ["はい", "いいえ"]
  },
  {
    q: "改善・効率化が得意？",
    a: ["はい", "いいえ"]
  },
  {
    q: "医療機器に関心はありますか？",
    a: ["ある", "ない"]
  },
  {
    q: "試験機・計測に興味は？",
    a: ["ある", "ない"]
  }
];

const scoreMap = {
  "情報系": {"major_info": 3, "software": 1},
  "機械系": {"major_mechanical": 3, "mechanical": 1},
  "電気電子系": {"major_electrical": 3, "electrical": 1},
  "医・薬・バイオ系": {"major_biomedical": 3, "medical": 1},
  "物理・計測系": {"major_physics": 3, "measurement": 1},
  "文系／その他": {"major_general": 3},

  "開発（ソフト・製品）": {"software": 2},
  "設計・構造": {"mechanical": 2},
  "品質・検査": {"qa": 2},
  "営業・顧客対応": {"sales": 2, "major_management": 1},
  "管理・戦略・総務": {"planning": 2, "admin": 1},
  "物流・調達": {"logistics": 2},

  "はい_team": {"sales": 1, "admin": 1},
  "はい_improve": {"planning": 2, "qa": 1},
  "ある_medical": {"medical_device": 2, "major_biomedical": 1},
  "ある_test": {"vehicle_measurement": 2, "measurement": 1}
};

let current = 0;
let answers = [];
let scores = {}; let salesFilter = false;

function showQuestion() {
  const q = questions[current];
  document.getElementById("question").textContent = q.q;
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  q.a.forEach(ans => {
    const btn = document.createElement("button");
    btn.textContent = ans;
    btn.className = "bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded text-left";
    btn.onclick = () => {
      answers.push(ans);
      let key = ans;
      if (current === 2) key = ans + "_team";
      if (current === 3) key = ans + "_improve";
      if (current === 4) key = ans + "_medical";
      if (current === 5) key = ans + "_test";

      
      if (key === "営業・顧客対応") salesFilter = true;
      if (scoreMap[key]) {

        for (const [k, v] of Object.entries(scoreMap[key])) {
          scores[k] = (scores[k] || 0) + v;
        }
      }

      current++;
      if (current < questions.length) {
        showQuestion();
      } else {
        localStorage.setItem("userScores", JSON.stringify(scores));
        window.location.href = "result.html";
      }
    };
    answersDiv.appendChild(btn);
  });
}

if (location.pathname.includes("quiz.html")) {
  window.onload = showQuestion;
}

if (location.pathname.includes("result.html")) {
  const scores = JSON.parse(localStorage.getItem("userScores") || "{}");

  fetch("departments.json")
    .then(res => res.json())
    .then(data => {
      
      // 類似度スコアで並べ替え（営業フィルタ適用）
      const filtered = data.filter(d => {
        const raw = (d["修正用_分類パラメータ（重み付き,カンマ区切り）"] || "");
        const hasSales = raw.includes("sales:");
        return salesFilter || !hasSales;
      });

      const ranked = filtered.map(d => {
        const allParams = [
          d["修正用_分類パラメータ（重み付き,カンマ区切り）"],
          d["修正用_製品分野（重み付き,カンマ区切り）"],
          d["修正用_専攻パラメータ（重み付き,カンマ区切り）"]
        ].filter(Boolean).join(",").split(",");
        let total = 0;
        for (const item of allParams) {
          const [k, v] = item.split(":");
          if (scores[k]) total += scores[k] * parseInt(v);
        }
        return { ...d, score: total };
      }).sort((a, b) => b.score - a.score);

      const top = ranked.slice(0, 3);
      const container = document.getElementById("resultContainer");

      top.forEach(d => {
        const div = document.createElement("div");
        div.className = "border-t pt-4 mt-4 text-left";
        div.innerHTML = `
          <h3 class="text-xl font-bold mb-1">${d.課名}（${d.本部}）</h3>
          <p class="text-sm text-gray-600 mb-1">${d.特徴}</p>
          <p class="text-sm text-gray-700 whitespace-pre-wrap">${d["整形済み詳細"]}</p>
        `;
        container.appendChild(div);
      });
    });
}
