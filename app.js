
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
    "q": "どんな業務に興味がありますか？",
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
    "q": "気になる製品分野を教えてください。",
    "a": [
      "医療機器",
      "試験機・計測",
      "その他"
    ]
  },
  {
    "q": "改善や効率化を考えるのは得意ですか？",
    "a": [
      "はい",
      "いいえ"
    ]
  },
  {
    "q": "海外で働くことや海外との関わりに興味はありますか？",
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
      const key = questions[current].q;
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
  document.getElementById("result").innerText = JSON.stringify(scores, null, 2);
}
