/**
 * 언어 관리 유틸리티
 * 모든 페이지의 언어 전환과 관련된 공통 기능을 제공합니다.
 */

// 언어 설정 함수
function setLanguage(lang) {
  const pageTitles = {
    Professor: { kor: "교수 소개", eng: "Professor" },
    Research: { kor: "연구 활동", eng: "Research" },
    Members: { kor: "멤버 소개", eng: "Members" },
  };

  // 현재 페이지 경로에서 페이지 이름 추출
  const pathSegments = window.location.pathname.split("/");
  const currentPage =
    pathSegments[pathSegments.length - 1] ||
    pathSegments[pathSegments.length - 2];

  // 경로에서 .html 확장자 제거 (있다면)
  const pageName = currentPage.replace(".html", "");

  // 현재 페이지에 맞는 제목 접미사 결정
  const titleSuffix = pageTitles[pageName] ? pageTitles[pageName][lang] : "";

  if (lang === "kor") {
    // 언어 선택 버튼 상태 업데이트
    updateLanguageButtons("kor");

    // 네비게이션 메뉴 텍스트 업데이트
    updateNavigationText({
      home: "메인 화면",
      professor: "교수 소개",
      research: "연구 활동",
      members: "멤버 소개",
    });
  } else {
    // 언어 선택 버튼 상태 업데이트
    updateLanguageButtons("eng");

    // 네비게이션 메뉴 텍스트 업데이트
    updateNavigationText({
      home: "Home",
      professor: "Professor",
      research: "Research",
      members: "Members",
    });
  }

  // 문서 제목 업데이트
  document.querySelector("title").innerText =
    "OS LAB" + (titleSuffix ? " - " + titleSuffix : "");

  // h1 제목 업데이트 (존재하는 경우)
  if (document.querySelector("h1")) {
    document.querySelector("h1").innerText = titleSuffix;
  }

  // 드롭다운 메뉴 업데이트
  updateDropdownMenu(lang);

  // 쿠키 설정
  setCookie("language", lang, 30); // 쿠키를 30일간 유지

  // 현재 페이지 링크 하이라이트
  highlightCurrentPage();

  // 홈 페이지 콘텐츠 업데이트 (홈페이지인 경우만)
  if (isHomePage()) {
    updateHomeContent(lang);
  }

  // 언어 변경 이벤트 발생 - 다른 컴포넌트에서 감지할 수 있도록
  document.dispatchEvent(new Event("languageChanged"));
}

// 언어 버튼 상태 업데이트
function updateLanguageButtons(activeLang) {
  document.querySelectorAll(".language-option").forEach((btn) => {
    if (
      (btn.id.includes("kor") && activeLang === "kor") ||
      (btn.id.includes("eng") && activeLang === "eng")
    ) {
      btn.classList.add("active");
      btn.classList.remove("inactive");
    } else {
      btn.classList.add("inactive");
      btn.classList.remove("active");
    }
  });
}

// 네비게이션 메뉴 텍스트 업데이트
function updateNavigationText(texts) {
  if (document.getElementById("home_Link"))
    document.getElementById("home_Link").innerText = texts.home;

  if (document.getElementById("professor_Link"))
    document.getElementById("professor_Link").innerText = texts.professor;

  if (document.getElementById("research_Link"))
    document.getElementById("research_Link").innerText = texts.research;

  if (document.getElementById("members_Link"))
    document.getElementById("members_Link").innerText = texts.members;
}

// 드롭다운 메뉴 업데이트
function updateDropdownMenu(lang) {
  const dropdownMenu = document.getElementById("dropdownMenuCustom");
  if (!dropdownMenu) return;

  dropdownMenu.innerHTML = "";

  const items =
    lang === "kor"
      ? [
          { text: "메인 화면", link: "/" },
          { text: "교수 소개", link: "/Professor" },
          { text: "연구 활동", link: "/Research" },
          { text: "멤버 소개", link: "/Members" },
        ]
      : [
          { text: "Home", link: "/" },
          { text: "Professor", link: "/Professor" },
          { text: "Research", link: "/Research" },
          { text: "Members", link: "/Members" },
        ];

  items.forEach((item) => {
    const a = document.createElement("a");
    a.classList.add("dropdown-item");
    a.href = item.link;
    a.innerText = item.text;
    dropdownMenu.appendChild(a);
  });

  // 드롭다운 메뉴 항목에 이벤트 추가
  document.querySelectorAll("#dropdownMenuCustom a").forEach(function (link) {
    link.addEventListener("click", function () {
      const dropdownMenu = document.getElementById("dropdownMenuCustom");
      const toggleButton = document.querySelector(".navbar-toggler");

      dropdownMenu.classList.remove("show");
      if (toggleButton) toggleButton.classList.remove("open");
      document.body.style.overflow = ""; // 스크롤 허용
    });
  });
}

// 현재 페이지 링크 하이라이트
function highlightCurrentPage() {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll(".nav-link");

  links.forEach((link) => {
    const linkPath = new URL(link.href, window.location.origin).pathname;

    if (
      (currentPath === "/" && linkPath === "/") ||
      (currentPath !== "/" &&
        linkPath !== "/" &&
        currentPath.includes(linkPath))
    ) {
      link.classList.add("current-page");
    } else {
      link.classList.remove("current-page");
    }
  });
}

// 현재 페이지가 홈페이지인지 확인
function isHomePage() {
  return (
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html"
  );
}

// 홈 페이지 콘텐츠 업데이트 함수
function updateHomeContent(lang) {
  if (!isHomePage()) return;

  fetch("/json/home.json")
    .then((response) => response.json())
    .then((data) => setHomeContent(data, lang))
    .catch((error) => {
      console.error("Error loading content:", error);
      setDefaultHomeContent(lang);
    });
}

// 홈 콘텐츠 설정 함수
function setHomeContent(data, lang) {
  if (!data) {
    console.error("No data provided to setHomeContent");
    return;
  }

  const sloganTop = data.sloganTop[lang];
  const sloganMid = data.sloganMid[lang];
  const sloganBot = data.sloganBot[lang];
  const projectButtonText = data.projectButtonText[lang];

  // 슬로건 요소 업데이트
  updateElementText("sloganTopH3", sloganTop.title);
  updateElementText("sloganTopLine1", sloganTop.line1);
  updateElementText("sloganTopLine2", sloganTop.line2);

  updateElementText("sloganMidH3", sloganMid.title);
  updateElementText("sloganMidLine1", sloganMid.line1);
  updateElementText("sloganMidLine2", sloganMid.line2);

  updateElementText("sloganBotH3", sloganBot.title);
  updateElementText("sloganBotLine1", sloganBot.line1);
  updateElementText("sloganBotLine2", sloganBot.line2);

  updateElementText("viewProjectsBtn", projectButtonText);

  // 피처 카드 콘텐츠 설정
  const contents = data.contents;
  if (contents && contents.length > 0) {
    contents.forEach((content, index) => {
      updateElementText(`featureTitle${index + 1}`, content.title[lang]);

      const contentElement = document.getElementById(
        `featureContent${index + 1}`
      );
      if (contentElement) {
        contentElement.innerHTML = content.content[lang]
          .replace(/<br>/g, " ")
          .replace(/\n/g, " ");
      }
    });
  }
}

// 요소 텍스트 업데이트 헬퍼 함수
function updateElementText(elementId, text) {
  const element = document.getElementById(elementId);
  if (element) element.innerText = text;
}

// 에러 발생 시 기본 텍스트 설정
function setDefaultHomeContent(lang) {
  const defaultText = {
    kor: {
      sloganTop: {
        title: "Developer",
        line1: "아이디어에서 현실까지",
        line2: "개발자가 만드는 세상",
      },
      sloganMid: {
        title: "Server Engineer",
        line1: "코드로 시작하는 서버의 이야기",
        line2: "세상을 연결하는 우리의 여정",
      },
      sloganBot: {
        title: "TeamWork",
        line1: "각자의 장점을 모아",
        line2: "불가능을 가능으로",
      },
      projectButtonText: "연구 활동 자세히 보기",
    },
    eng: {
      sloganTop: {
        title: "Developer",
        line1: "Ideas to Code",
        line2: "By Developers",
      },
      sloganMid: {
        title: "Server Engineer",
        line1: "Server Stories in Code",
        line2: "Connecting the World",
      },
      sloganBot: {
        title: "TeamWork",
        line1: "Strengths Combined",
        line2: "Success Achieved",
      },
      projectButtonText: "View Research Activities",
    },
  };

  const content = defaultText[lang];
  if (!content) return;

  // 각 요소에 기본 텍스트 설정
  updateElementText("sloganTopH3", content.sloganTop.title);
  updateElementText("sloganTopLine1", content.sloganTop.line1);
  updateElementText("sloganTopLine2", content.sloganTop.line2);

  updateElementText("sloganMidH3", content.sloganMid.title);
  updateElementText("sloganMidLine1", content.sloganMid.line1);
  updateElementText("sloganMidLine2", content.sloganMid.line2);

  updateElementText("sloganBotH3", content.sloganBot.title);
  updateElementText("sloganBotLine1", content.sloganBot.line1);
  updateElementText("sloganBotLine2", content.sloganBot.line2);

  updateElementText("viewProjectsBtn", content.projectButtonText);
}

// 현재 언어 가져오기
function getLanguage() {
  return getCookie("language") || "kor";
}

// 초기화 함수
function initializeLanguage() {
  const lang = getLanguage();
  setLanguage(lang);

  // 언어 변경 버튼 이벤트 리스너 설정
  document
    .getElementById("korBtn")
    .addEventListener("click", () => setLanguage("kor"));
  document
    .getElementById("engBtn")
    .addEventListener("click", () => setLanguage("eng"));
  document
    .getElementById("korBtnMobile")
    .addEventListener("click", () => setLanguage("kor"));
  document
    .getElementById("engBtnMobile")
    .addEventListener("click", () => setLanguage("eng"));
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", initializeLanguage);
