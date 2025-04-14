
document.addEventListener("DOMContentLoaded", async () => {
  const resultContainer = document.getElementById("resultContainer");

  // 回答データの取得
  const userAnswersRaw = localStorage.getItem("userAnswers");
  console.log("📦 userAnswersRaw:", userAnswersRaw);
  const userAnswers = JSON.parse(userAnswersRaw || "[]");

  // recommend_result_map_with_hq.json の読み込み
  const recommendMapRes = await fetch("recommend_result_map_with_hq.json");
  const recommendMap = await recommendMapRes.json();

  // 質問文キー一覧
  const questionKeys = Object.keys(recommendMap);
  console.log("🗝️ 質問文キー:", questionKeys);

  const matchedDepts = [];

  userAnswers.forEach((answer, index) => {
    const questionKey = questionKeys[index]; // 日本語の質問文
    const recList = recommendMap[questionKey];

    console.log(`🔎 Q${index + 1}:`, questionKey, "回答:", answer);

    if (recList && recList[answer]) {
      const recs = recList[answer];
      console.log("✅ 該当部署:", recs);
      if (Array.isArray(recs)) {
        recs.forEach(item => {
          if (item && item.部署名) {
            matchedDepts.push(item.部署名);
          }
        });
      }
    } else {
      console.warn("⚠️ マッチなし:", answer);
    }
  });

  // 重複除去
  const uniqueDepts = [...new Set(matchedDepts)];

  // fallback: 生産技術課
  const displayDepts = uniqueDepts.length > 0 ? uniqueDepts : ["生産技術課"];
  console.log("📝 最終表示部署:", displayDepts);

  for (const dept of displayDepts) {
    const card = document.createElement("div");
    card.className = "bg-white shadow-md rounded-lg p-6";

    const title = document.createElement("h2");
    title.className = "text-xl font-bold mb-2";
    title.textContent = dept;
    card.appendChild(title);

    const content = document.createElement("div");
    content.className = "text-sm text-gray-700 mb-2";

    const hqHtmlPath = `hq_pages/${dept}.html`;
    const hqLink = document.createElement("a");
    hqLink.href = hqHtmlPath;
    hqLink.target = "_blank";
    hqLink.className = "text-blue-600 hover:underline text-sm";
    hqLink.textContent = "▶ 詳細ページを見る";

    try {
      const htmlRes = await fetch(hqHtmlPath);
      if (htmlRes.ok) {
        const htmlText = await htmlRes.text();
        content.innerHTML = htmlText;
      } else {
        content.textContent = "部署情報の読み込みに失敗しました。";
      }
    } catch (err) {
      content.textContent = "部署情報の読み込み時にエラーが発生しました。";
    }

    card.appendChild(content);
    card.appendChild(hqLink);
    resultContainer.appendChild(card);
  }
});
