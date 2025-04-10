
const questions = [
  { q: "あなたの大学での専攻は？", a: ["情報系", "機械系", "電気電子系", "文系", "医療・バイオ系", "その他"] },
  { q: "興味がある分野は？", a: ["開発", "営業", "企画", "管理", "研究", "生産"] },
  { q: "新しい仕組みを考えるのが好き？", a: ["はい", "いいえ"] },
  { q: "チームで働くのは得意？", a: ["はい", "いいえ"] }
];

let current = 0;
let answers = [];

function showQuestion() {
  const q = questions[current];
  document.getElementById("question").textContent = q.q;
  const ansDiv = document.getElementById("answers");
  ansDiv.innerHTML = "";
  q.a.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "border border-gray-300 py-2 rounded hover:bg-gray-100";
    btn.textContent = choice;
    btn.onclick = () => {
      answers.push(choice);
      current++;
      if (current < questions.length) {
        showQuestion();
      } else {
        localStorage.setItem("answers", JSON.stringify(answers));
        window.location.href = "result.html";
      }
    };
    ansDiv.appendChild(btn);
  });
}

if (location.pathname.includes("quiz.html")) showQuestion();

if (location.pathname.includes("result.html")) {
  const userAns = JSON.parse(localStorage.getItem("answers"));
  fetch("/TechMatch/dept_master.json")
    .then(res => res.json())
    .then(data => {
      const major = userAns[0];
      const interest = userAns[1];

      const paramMap = {
        "開発": "software",
        "営業": "sales",
        "研究": "measurement",
        "管理": "admin",
        "企画": "general",
        "生産": "mechanical"
      };
      const matchParam = paramMap[interest] || "";

      let candidates = data.filter(d => d.推奨専攻 === major);
      let refined = candidates.filter(d => d.分類パラメータ === matchParam);
      if (refined.length === 0) refined = candidates;
      if (refined.length === 0) refined = data;

      const match = refined[0];
      document.getElementById("match").textContent = match.課名 + "（" + match.本部 + "）";
      document.getElementById("feature").textContent = match.特徴;
      document.getElementById("detail").textContent = match.詳細;

      // リンクを補足（例：A&D公式ページ対応）
      const linkMap = {
        "営業": "https://www.aandd.co.jp/company/sales/",
        "生産技術課": "https://www.aandd.co.jp/company/production/",
        "品質": "https://www.aandd.co.jp/company/quality/"
      };
      for (const key in linkMap) {
        if (match.課名.includes(key)) {
          const link = document.createElement("a");
          link.href = linkMap[key];
          link.target = "_blank";
          link.className = "text-blue-600 underline block mt-4";
          link.textContent = "詳しくはこちら（A&D公式サイト）";
          document.querySelector("body > div").appendChild(link);
          break;
        }
      }

      // 生産技術課を追加推奨（技術系の場合）
      const techParams = ["mechanical", "electrical", "software", "measurement"];
      if (techParams.includes(match.分類パラメータ)) {
        const prod = data.find(d => d.課名 === "生産技術課");
        if (prod) {
          const div = document.createElement("div");
          div.className = "mt-8 text-left border-t pt-4";
          div.innerHTML = `
            <h3 class="text-xl font-bold text-green-700">同時におすすめ：</h3>
            <p class="font-semibold mt-2">${prod.課名}（${prod.本部}）</p>
            <p class="text-sm text-gray-600">${prod.特徴}</p>
            <p class="text-sm whitespace-pre-wrap mt-1">${prod.詳細}</p>
            <a href="https://www.aandd.co.jp/company/production/" target="_blank" class="text-blue-600 underline block mt-2">生産技術課について詳しく見る</a>
          `;
          document.querySelector("body > div").appendChild(div);
        }
      }
    });
}
