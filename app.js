
const questions = [
  {
    "q": "あなたの専攻は何ですか？",
    "a": [
      "情報系",
      "機械系",
      "電気電子系",
      "医・薬・バイオ系",
      "文系／その他"
    ]
  },
  {
    "q": "興味のある業務は？",
    "a": [
      "開発（ソフト・製品）",
      "設計・構造",
      "品質・検査",
      "営業・顧客対応",
      "管理・戦略・総務",
      "物流・調達"
    ]
  },
  {
    "q": "興味がある製品群は？",
    "a": [
      "医療機器",
      "試験機・計測",
      "その他"
    ]
  },
  {
    "q": "改善・効率化が得意？",
    "a": [
      "はい",
      "いいえ"
    ]
  },
  {
    "q": "海外に興味はありますか？",
    "a": [
      "ある",
      "ない"
    ]
  }
];

const scoreMap = {
  "専攻は？": {
    "情報系": {
      "tech_software": 3,
      "field_medical": 2,
      "field_measurement": 2,
      "planning": 1,
      "efficiency": 2
    },
    "機械系": {
      "tech_mechanical": 3,
      "field_medical": 2,
      "field_measurement": 2,
      "efficiency": 2
    },
    "電気電子系": {
      "tech_software": 1,
      "tech_electrical": 3,
      "field_medical": 2,
      "field_measurement": 2,
      "efficiency": 2
    },
    "医・薬・バイオ系": {
      "tech_software": 1,
      "field_medical": 2,
      "field_measurement": 2,
      "qa": 2,
      "efficiency": 2
    },
    "文系／その他": {
      "sales": 3,
      "qa": 1,
      "planning": 3,
      "logistics": 1,
      "efficiency": 1
    }
  },
  "興味のある業務は？": {
    "開発（ソフト・製品）": {
      "tech_software": 5,
      "tech_mechanical": 3,
      "tech_electrical": 5,
      "efficiency": 4
    },
    "設計・構造": {
      "tech_software": 3,
      "tech_mechanical": 5,
      "tech_electrical": 3,
      "efficiency": 4
    },
    "品質・検査": {
      "tech_software": 1,
      "tech_mechanical": 1,
      "tech_electrical": 1,
      "qa": 5,
      "efficiency": 3
    },
    "営業・顧客対応": {
      "sales": 5,
      "planning": 3
    },
    "管理・戦略・総務": {
      "sales": 3,
      "planning": 5,
      "efficiency": 1
    },
    "物流・調達": {
      "planning": 5,
      "logistics": 5,
      "efficiency": 1
    }
  },
  "興味がある製品群は？": {
    "医療機器": {
      "field_medical": 5,
      "efficiency": 2
    },
    "試験機・計測": {
      "field_measurement": 5,
      "efficiency": 1
    },
    "その他": {
      "sales": 5
    }
  },
  "改善・効率化が得意？": {
    "はい": {
      "efficiency": 5
    }
  }
};

let current = 0;
let scores = {};

function showQuestion() {
  const q = questions[current];
  document.getElementById("question").textContent = q.q;
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  q.a.forEach(ans => {
    const btn = document.createElement("button");
    btn.textContent = ans;
    btn.className = "bg-blue-100 hover:bg-blue-300 px-4 py-2 rounded";
    btn.onclick = () => {
      const key = q.q;
      if (scoreMap[key] && scoreMap[key][ans]) {
        const map = scoreMap[key][ans];
        for (const k in map) {
          scores[k] = (scores[k] || 0) + map[k];
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
      const ranked = data.map(dept => {
        const keys = [
          dept["修正用_分類パラメータ（重み付き,カンマ区切り）"],
          dept["修正用_製品分野（重み付き,カンマ区切り）"],
          dept["修正用_専攻パラメータ（重み付き,カンマ区切り）"]
        ].filter(Boolean).join(",").split(",");

        let total = 0;
        keys.forEach(kv => {
          const [k, v] = kv.split(":");
          if (scores[k]) {
            total += scores[k] * parseInt(v);
          }
        });

        return { ...dept, score: total };
      }).sort((a, b) => b.score - a.score);

      const top = ranked.slice(0, 3);
      const container = document.getElementById("resultContainer");

      top.forEach(d => {
        const div = document.createElement("div");
        div.className = "bg-white border rounded shadow p-4";
        div.innerHTML = `
          <h2 class="text-xl font-bold mb-1">${d.課名}（${d.本部}）</h2>
          <p class="text-sm text-gray-600 mb-1">${d.特徴}</p>
          <p class="text-sm text-gray-800 whitespace-pre-wrap">${d["整形済み詳細"]}</p>
        `;
        container.appendChild(div);
      });
    });
}


if (location.pathname.includes("result.html")) {
  const scores = JSON.parse(localStorage.getItem("userScores") || "{}");

  const hqLinks = {
  "設計開発本部": "hq_pages/設計開発本部.html",
  "管理本部": "hq_pages/管理本部.html",
  "社長直轄部門": "hq_pages/社長直轄部門.html",
  "営業本部": "hq_pages/営業本部.html",
  "生産本部": "hq_pages/生産本部.html",
  "第1設計開発本部": "hq_pages/第1設計開発本部.html",
  "第2設計開発本部": "hq_pages/第2設計開発本部.html",
  "第3設計開発本部": "hq_pages/第3設計開発本部.html"
};

  fetch("departments.json")
    .then(res => res.json())
    .then(data => {
      const ranked = data.map(dept => {
        const keys = [
          dept["修正用_分類パラメータ（重み付き,カンマ区切り）"],
          dept["修正用_製品分野（重み付き,カンマ区切り）"],
          dept["修正用_専攻パラメータ（重み付き,カンマ区切り）"]
        ].filter(Boolean).join(",").split(",");

        let total = 0;
        keys.forEach(kv => {
          const [k, v] = kv.split(":");
          if (scores[k]) {
            total += scores[k] * parseInt(v);
          }
        });

        return { ...dept, score: total };
      }).sort((a, b) => b.score - a.score);

      const top = ranked.slice(0, 3);
      const container = document.getElementById("resultContainer");

      top.forEach(d => {
        const div = document.createElement("div");
        const link = hqLinks[d.本部];
        div.className = "bg-white border rounded shadow p-4";
        div.innerHTML = `
          <h2 class="text-xl font-bold mb-1">${d.課名}（${d.本部}）</h2>
          <p class="text-sm text-gray-600 mb-1">${d.特徴}</p>
          <p class="text-sm text-gray-800 whitespace-pre-wrap">${d["整形済み詳細"]}</p>
          ${link ? `<a href="${link}" target="_blank" class="text-blue-600 underline mt-2 inline-block">この部署の詳細を見る</a>` : ""}
`;
        container.appendChild(div);
      });
    });
}


if (location.pathname.includes("quiz.html")) {
  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (current > 0) {
        current--;
        showQuestion();
      }
    });
  }
}


// result.html: 回答に応じた部署表示
fetch("recommend_result_map_with_hq.json")
  .then(res => res.json())
  .then(resultMap => {
    if (location.pathname.includes("result.html")) {
      const answers = JSON.parse(localStorage.getItem("userAnswers") || "{}");
      const container = document.getElementById("resultContainer");
      let found = [];

      for (const q in answers) {
        const a = answers[q];
        const matched = resultMap[q] && resultMap[q][a];
        if (matched) {
          matched.forEach(d => {
            found.push({ ...d, 質問: q, 回答: a });
          });
        }
      }

      if (found.length === 0) {
        container.innerHTML = "<p>該当する部署が見つかりませんでした。</p>";
      } else {
        found.forEach(d => {
          const div = document.createElement("div");
          div.className = "bg-white border rounded shadow p-4 mb-4";
          div.innerHTML = `
            <h2 class="text-lg font-bold">${d.部署名}（${d.本部名}）</h2>
            <p class="text-sm text-gray-600">［${d.質問}］${d.回答} に基づくおすすめ部署</p>
          `;
          container.appendChild(div);
        });
      }
    }
  });
