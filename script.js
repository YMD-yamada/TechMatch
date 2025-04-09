
document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      window.location.href = "questions.html";
    });
  }

  const questionContainer = document.getElementById("questionContainer");
  const questionText = document.getElementById("question");
  const resultTitle = document.getElementById("resultTitle");
  const resultText = document.getElementById("resultText");

  const questions = [
    "新しい仕組みを考えるのが好き？",
    "改善ポイントを見つけるとワクワクする？",
    "現場と一緒にものづくりを進めたい？"
  ];

  let current = 0;
  let yesCount = 0;

  function showQuestion() {
    if (questionText && current < questions.length) {
      questionText.textContent = questions[current];
    }
  }

  if (questionContainer && questionText) {
    const buttons = questionContainer.querySelectorAll(".answer-btn");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        if (btn.textContent === "はい") yesCount++;
        current++;
        if (current < questions.length) {
          showQuestion();
        } else {
          localStorage.setItem("yesCount", yesCount);
          window.location.href = "result.html";
        }
      });
    });
    showQuestion();
  }

  if (resultTitle && resultText) {
    const count = parseInt(localStorage.getItem("yesCount") || "0", 10);
    if (count >= 2) {
      resultTitle.textContent = "あなたは 現場改革タイプ！";
      resultText.innerHTML = `
        おすすめ部署：<strong>生産技術課</strong><br>
        <br>
        生産技術課は、現場と密に連携しながら、製造プロセスの改善や新しい設備の導入を進める部署です。<br>
        課題発見からアイデア提案、実行までを担う、ものづくりの最前線で活躍できる職場です！
      `;
    } else {
      resultTitle.textContent = "あなたは じっくり慎重派タイプ！";
      resultText.innerHTML = `
        他部署にも多くの魅力がありますが、まずは現場の見学から始めてみませんか？<br>
        いろいろな部署を見たうえで、自分に合う場所をじっくり探しましょう！
      `;
    }
  }
});
