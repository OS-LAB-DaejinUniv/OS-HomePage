/**
 * 연구 페이지 특화 기능
 */

document.addEventListener("DOMContentLoaded", function () {
  loadResearchContent();
  setupModalEvents();

  // AOS 초기화
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 700,
      once: true,
      offset: 50,
    });
  }
});

// 언어 변경 시 컨텐츠 업데이트
document.addEventListener("languageChanged", function () {
  loadResearchContent();
  updatePageStaticText(getLanguage());
});

// 연구 콘텐츠 로드
function loadResearchContent() {
  fetch("/json/research.json")
    .then((response) => response.json())
    .then((data) => {
      renderResearchProjects(data.researchItems, getLanguage());
      updatePageStaticText(getLanguage());
    })
    .catch((error) => console.error("Error loading research content:", error));
}

// 정적 텍스트 업데이트
function updatePageStaticText(lang) {
  // 페이지 제목 및 부제목 업데이트
  const titleElem = document.getElementById("researchPageTitle");
  const subtitleElem = document.getElementById("researchPageSubtitle");
  const githubLinkText = document.getElementById("githubLinkText");

  if (titleElem) {
    titleElem.textContent = lang === "eng" ? "Research Projects" : "연구 활동";
  }

  if (subtitleElem) {
    subtitleElem.textContent =
      lang === "eng"
        ? "Explore our latest research and development projects"
        : "최신 연구 및 개발 프로젝트를 살펴보세요";
  }

  if (githubLinkText) {
    githubLinkText.textContent =
      lang === "eng" ? "View on GitHub" : "GitHub에서 보기";
  }

  // 헤더의 깃허브 링크 텍스트도 업데이트
  const headerGithubText = document.getElementById("headerGithubText");
  if (headerGithubText) {
    headerGithubText.textContent =
      lang === "eng" ? "View on GitHub" : "깃허브에서 보기";
  }

  // 문서 제목 업데이트
  document.title = lang === "eng" ? "Research - OS LAB" : "연구 활동 - OS LAB";
}

// 연구 프로젝트 렌더링
function renderResearchProjects(projects, lang) {
  const grid = document.getElementById("researchGrid");
  if (!grid) return;

  // 로딩 인디케이터 제거
  grid.innerHTML = "";

  // 게시물 ID(markdownId)를 숫자로 변환하여 내림차순으로 정렬
  // 숫자가 높을수록 최신 게시물로 간주하여 맨 앞에 표시
  const sortedProjects = [...projects].sort((a, b) => {
    const idA = parseInt(a.markdownId || "0");
    const idB = parseInt(b.markdownId || "0");
    return idB - idA; // 내림차순 정렬
  });

  // 각 연구 카드 생성
  sortedProjects.forEach((project, index) => {
    const card = createResearchCard(project, lang, projects.indexOf(project)); // 원래 인덱스 유지
    grid.appendChild(card);
  });

  // AOS 새로고침
  if (typeof AOS !== "undefined") {
    AOS.refresh();
  }
}

// 연구 카드 생성 함수
function createResearchCard(project, lang, index) {
  const card = document.createElement("div");
  card.className = "research-card";
  card.setAttribute("data-aos", "fade-up");
  card.setAttribute("data-aos-delay", `${index * 100}`);
  card.setAttribute("data-index", index.toString());
  card.setAttribute("data-project-id", project.markdownId || index.toString());

  // 카드 내용 구성
  card.innerHTML = `
    <div class="research-image-container">
      <img src="${project.img}" alt="${
    project.title[lang]
  }" class="research-image">
    </div>
    <div class="research-content">
      <h3 class="research-title">${project.title[lang]}</h3>
      ${
        project.date ? `<span class="research-date">${project.date}</span>` : ""
      }
      <p class="research-description">${project.preview[lang]}</p>
      <div class="research-footer">
        ${
          project.link && project.link[lang]
            ? `<a href="${project.link[lang]}" target="_blank" class="github-link">
            <i class="fab fa-github"></i> GitHub
          </a>`
            : `<span></span>`
        }
        <button class="details-button" data-index="${index}">
          ${
            lang === "eng" ? "Read More" : "자세히 보기"
          } <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  `;

  return card;
}

// 모달 이벤트 설정
function setupModalEvents() {
  // 자세히 보기 버튼 이벤트
  document.addEventListener("click", function (e) {
    if (e.target.closest(".details-button")) {
      const button = e.target.closest(".details-button");
      const index = parseInt(button.dataset.index);
      openResearchModal(index);
    }
  });

  // 모달 닫기 버튼 이벤트
  document
    .getElementById("modalCloseBtn")
    .addEventListener("click", closeModal);

  // 모달 오버레이 클릭 시 닫기
  document
    .getElementById("researchModalOverlay")
    .addEventListener("click", function (e) {
      if (e.target === this) {
        closeModal();
      }
    });

  // ESC 키 누를 때 모달 닫기
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Escape" &&
      document.getElementById("researchModalOverlay").classList.contains("show")
    ) {
      closeModal();
    }
  });
}

// 모달 열기
function openResearchModal(index) {
  // 현재 언어 가져오기
  const lang = getLanguage();

  // JSON 데이터 가져오기
  fetch("/json/research.json")
    .then((response) => response.json())
    .then((data) => {
      const project = data.researchItems[index];

      // 모달에 데이터 채우기
      document.getElementById("modalTitle").textContent = project.title[lang];
      if (project.date) {
        document.getElementById("modalDate").textContent = project.date;
        document.getElementById("modalDate").style.display = "block";
      } else {
        document.getElementById("modalDate").style.display = "none";
      }

      // 헤더의 깃허브 링크 설정
      const headerGithubLinkElement =
        document.getElementById("headerGithubLink");
      if (project.link && project.link[lang]) {
        headerGithubLinkElement.style.display = "flex";
        document.getElementById("headerGithubUrl").href = project.link[lang];
        document.getElementById("headerGithubText").textContent =
          lang === "eng" ? "View on GitHub" : "깃허브에서 보기";
      } else {
        headerGithubLinkElement.style.display = "none";
      }

      // 마크다운 콘텐츠 로드 시작
      document.getElementById("modalLoading").style.display = "flex";
      document.getElementById("markdownContent").innerHTML = "";

      // 마크다운 파일 로드
      loadMarkdownContent(index, lang);

      // 모달 표시
      document.getElementById("researchModalOverlay").classList.add("show");
      document.body.classList.add("modal-open");
    })
    .catch((error) => console.error("Error loading project details:", error));
}

// 마크다운 콘텐츠 로드
function loadMarkdownContent(index, lang) {
  // JSON에서 markdownId 가져오기
  fetch("/json/research.json")
    .then((response) => response.json())
    .then((data) => {
      const project = data.researchItems[index];
      const markdownId = project.markdownId || index;
      const markdownPath = `/markdown/research-${markdownId}-${lang}.md`;

      return fetch(markdownPath);
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load markdown file: ${response.status}`);
      }
      return response.text();
    })
    .then((markdown) => {
      // 마크다운 렌더링
      if (typeof marked !== "undefined") {
        document.getElementById("markdownContent").innerHTML =
          marked.parse(markdown);

        // 이미지에 지연 로딩 및 확대 기능 추가
        const images = document.querySelectorAll("#markdownContent img");
        images.forEach((img) => {
          img.loading = "lazy";
          img.classList.add("zoomable");
          img.addEventListener("click", function () {
            this.classList.toggle("zoomed");
          });
        });

        // Mermaid 다이어그램 렌더링
        renderMermaidDiagrams(document.getElementById("markdownContent"));
      } else {
        document.getElementById("markdownContent").textContent = markdown;
      }
    })
    .catch((error) => {
      console.error("Error loading markdown content:", error);
      // 오류 시 JSON에서 기본 내용 표시
      fetch("/json/research.json")
        .then((response) => response.json())
        .then((data) => {
          const project = data.researchItems[index];
          document.getElementById(
            "markdownContent"
          ).innerHTML = `<p>${project.preview[lang]}</p>`;
        })
        .catch((err) => {
          document.getElementById("markdownContent").innerHTML = `
            <p class="text-danger">${
              lang === "eng"
                ? "Failed to load content."
                : "컨텐츠를 불러오는데 실패했습니다."
            }</p>`;
        });
    })
    .finally(() => {
      // 로딩 인디케이터 숨기기
      document.getElementById("modalLoading").style.display = "none";
    });
}

// 모달 닫기
function closeModal() {
  document.getElementById("researchModalOverlay").classList.remove("show");
  document.body.classList.remove("modal-open");
}
