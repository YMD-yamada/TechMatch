
document.addEventListener("DOMContentLoaded", async () => {
  const resultContainer = document.getElementById("resultContainer");

  const userAnswersRaw = localStorage.getItem("userAnswers");
  const userAnswers = JSON.parse(userAnswersRaw || "[]");

  const [recommendMapRes, deptToHqRes, hqDetailRes] = await Promise.all([
    fetch("recommend_result_map_with_hq.json"),
    fetch("department_to_hq.json"),
    fetch("hq_department_details.json")
  ]);

  const recommendMap = await recommendMapRes.json();
  const departmentToHq = await deptToHqRes.json();
  const hqDetails = await hqDetailRes.json();

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

  // 重複を除去
  let uniqueDepts = [...new Set(matchedDepts)];

  // 生産技術課を補助的に追加（既に含まれていなければ）
  if (!uniqueDepts.includes("生産技術課")) {
    uniqueDepts.push("生産技術課");
  }

  for (const dept of uniqueDepts) {
    const card = document.createElement("div");
    card.className = "bg-white shadow-md rounded-lg p-6";

    const title = document.createElement("h2");
    title.className = "text-xl font-bold mb-2";
    title.textContent = dept;
    card.appendChild(title);

    const content = document.createElement("div");
    content.className = "text-sm text-gray-700 mb-2";

    const deptInfo = hqDetails[dept];
    if (deptInfo) {
      const feature = document.createElement("p");
      feature.innerHTML = `<strong>特徴：</strong>${deptInfo.特徴 || "情報なし"}`;
      content.appendChild(feature);

      const detail = document.createElement("p");
      detail.innerHTML = `<strong>詳細：</strong>${deptInfo.詳細 || "情報なし"}`;
      content.appendChild(detail);
    } else {
      content.textContent = "この部署の情報は見つかりませんでした。";
    }

    const hq = departmentToHq[dept] || "設計開発本部";
    const hqHtmlPath = `hq_pages/${hq}.html`;

    const hqLink = document.createElement("a");
    hqLink.href = hqHtmlPath;
    hqLink.target = "_blank";
    hqLink.className = "text-blue-600 hover:underline text-sm block mt-2";
    hqLink.textContent = `▶ ${hq}の詳細ページを見る`;

    card.appendChild(content);
    card.appendChild(hqLink);
    resultContainer.appendChild(card);
  }
});
