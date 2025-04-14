
document.addEventListener("DOMContentLoaded", async () => {
  const resultContainer = document.getElementById("resultContainer");

  const userAnswersRaw = localStorage.getItem("userAnswers");
  console.log("📦 userAnswersRaw:", userAnswersRaw);
  const userAnswers = JSON.parse(userAnswersRaw || "[]");

  const [recommendMapRes, deptToHqRes] = await Promise.all([
    fetch("recommend_result_map_with_hq.json"),
    fetch("department_to_hq.json")
  ]);

  const recommendMap = await recommendMapRes.json();
  const departmentToHq = await deptToHqRes.json();

  const questionKeys = Object.keys(recommendMap);
  const matchedDepts = [];

  userAnswers.forEach((answer, index) => {
    const questionKey = questionKeys[index];
    const recList = recommendMap[questionKey];

    if (recList && recList[answer]) {
      const recs = recList[answer];
      if (Array.isArray(recs)) {
        recs.forEach(item => {
          if (item && item.部署名) {
            matchedDepts.push(item.部署名);
          }
        });
      }
    }
  });

  const uniqueDepts = [...new Set(matchedDepts)];
  const displayDepts = uniqueDepts.length > 0 ? uniqueDepts : ["生産技術課"];

  for (const dept of displayDepts) {
    const card = document.createElement("div");
    card.className = "bg-white shadow-md rounded-lg p-6";

    const title = document.createElement("h2");
    title.className = "text-xl font-bold mb-2";
    title.textContent = dept;
    card.appendChild(title);

    const content = document.createElement("div");
    content.className = "text-sm text-gray-700 mb-2";

    const hq = departmentToHq[dept] || "設計開発本部";
    const hqHtmlPath = `hq_pages/${hq}.html`;

    const hqLink = document.createElement("a");
    hqLink.href = hqHtmlPath;
    hqLink.target = "_blank";
    hqLink.className = "text-blue-600 hover:underline text-sm";
    hqLink.textContent = "▶ 本部の詳細ページを見る";

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
