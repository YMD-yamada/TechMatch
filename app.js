
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

    if (location.pathname.includes("quiz.html")) {
      window.showQuestion = function () {
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
            const answers = JSON.parse(localStorage.getItem("userAnswers") || "{}");
            answers[key] = ans;
            localStorage.setItem("userAnswers", JSON.stringify(answers));

            current++;
            if (current < questions.length) {
              showQuestion();
            } else {
              window.location.href = "result.html";
            }
          };
          answersDiv.appendChild(btn);
        });
      };

      if (document.getElementById("backBtn")) {
        document.getElementById("backBtn").onclick = () => {
          if (current > 0) {
            current--;
            showQuestion();
          }
        };
      }

      showQuestion();
    }
  });

const questions = [
  { q: "専攻は？", a: ["情報系", "機械系", "電気・電子系", "医・薬・バイオ", "文系／その他"] },
  { q: "興味のある業務は？", a: ["開発(ソフト)", "設計・構造設計", "品質・管理・検査", "営業・販促・連携", "生産・製造", "物流・調達"] },
  { q: "興味のある製品群は？", a: ["医療機器", "計量機器", "試験機・車関連", "その他"] },
  { q: "改善・効率化が得意？", a: ["はい", "いいえ"] },
  { q: "海外に興味はありますか？", a: ["ある", "ない"] }
];
let current = 0;
