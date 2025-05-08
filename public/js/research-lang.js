/**
 * 연구 페이지 특화 기능
 */

document.addEventListener("DOMContentLoaded", function () {
  loadResearchContent();
});

// 언어 변경 시 컨텐츠 업데이트
document.addEventListener("languageChanged", function () {
  loadResearchContent();
});

// 연구 콘텐츠 로드
function loadResearchContent() {
  fetch("/json/research.json")
    .then((response) => response.json())
    .then((data) => setResearchContent(data, getLanguage()))
    .catch((error) => console.error("Error loading research content:", error));
}

// 연구 콘텐츠 설정
function setResearchContent(data, lang) {
  const container = document.getElementById("researchContainer");
  if (!container) return;

  let html = "";
  data.researchItems.forEach((item) => {
    html += `
      <div class="max-w-5xl glow research-item">
        <img src="${item.img}" alt="${item.title[lang]}" class="research-img">
        <div class="research-info">
          <p class="font-bold text-2xl mb-3">${item.title[lang]}</p>
          ${
            item.date
              ? `<p class="card-text"><small class="text-muted">${item.date}</small></p>`
              : ""
          }
          <p class="leading-6 research-content">${item.content[lang]}</p>
          ${
            item.link && item.link[lang]
              ? `<a href="${item.link[lang]}" class="btn btn-primary">
                ${lang === "eng" ? "View Details" : "자세히 보기"}
              </a>`
              : ""
          }
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}
