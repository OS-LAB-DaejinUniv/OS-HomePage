/**
 * 언어 관리 통합 모듈
 * 모든 페이지의 언어 전환과 관련된 공통 기능을 제공합니다.
 */

// 현재 언어 가져오기 (쿠키 또는 기본값)
function getLanguage() {
  return getCookie("language") || "kor";
}

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

  // 언어에 따른 UI 업데이트
  if (lang === "kor") {
    updateLanguageButtons("kor");
    updateNavigationText({
      home: "메인 화면",
      professor: "교수 소개",
      research: "연구 활동",
      members: "멤버 소개",
    });
  } else {
    updateLanguageButtons("eng");
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
  if (document.querySelector("h1.title-heading")) {
    document.querySelector("h1.title-heading").innerText = titleSuffix;
  }

  // 드롭다운 메뉴 업데이트
  updateDropdownMenu(lang);

  // 푸터 텍스트 업데이트
  updateFooterText(lang);

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
      // 에러 발생 시는 기본 상태로 유지하고 별도 처리 없음
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

  // 섹션 제목 업데이트
  if (data.sectionTitle) {
    updateElementContent("sectionTitle", data.sectionTitle[lang]);
  }

  // 섹션 부제목 업데이트
  if (data.sectionSubtitle) {
    updateElementContent("sectionSubtitle", data.sectionSubtitle[lang]);
  }

  // 슬로건 요소 업데이트
  updateElementContent("sloganTopH3", sloganTop.title);
  updateElementContent("sloganTopLine1", sloganTop.line1);
  updateElementContent("sloganTopLine2", sloganTop.line2);

  updateElementContent("sloganMidH3", sloganMid.title);
  updateElementContent("sloganMidLine1", sloganMid.line1);
  updateElementContent("sloganMidLine2", sloganMid.line2);

  updateElementContent("sloganBotH3", sloganBot.title);
  updateElementContent("sloganBotLine1", sloganBot.line1);
  updateElementContent("sloganBotLine2", sloganBot.line2);

  updateElementContent("viewProjectsBtn", projectButtonText);

  // 더 알아보기 버튼 텍스트 업데이트
  if (data.readMoreText) {
    const readMoreButtons = document.querySelectorAll(".feature-link");
    readMoreButtons.forEach((button) => {
      button.innerHTML =
        data.readMoreText[lang] + ' <i class="fas fa-arrow-right"></i>';
    });
  }

  // 피처 카드 콘텐츠 설정
  const contents = data.contents;
  if (contents && contents.length > 0) {
    contents.forEach((content, index) => {
      updateElementContent(`featureTitle${index + 1}`, content.title[lang]);

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

  // 갤러리가 있다면 갤러리 초기화 함수 호출
  if (data.gallery && typeof initializeGallery === "function") {
    initializeGallery();
  }
}

// 요소 텍스트 업데이트 헬퍼 함수
function updateElementContent(elementId, text) {
  const element = document.getElementById(elementId);
  if (element) element.innerText = text;
}

// 푸터 텍스트 업데이트 함수 추가
function updateFooterText(lang) {
  // 푸터 텍스트 설정
  const footerTexts = {
    kor: {
      copyright: "2024 OS LAB, Daejin University",
      inquiry: "문의",
      address: "대진대학교 이공학관 다동 A9-4131",
      membersOnly: "구성원 전용",
      intranet: "인트라넷",
      attendance: "근태내역 조회",
      printing: "온라인 문서출력",
      computing: "컴퓨팅 클라우드",
      cloud: "클라우드",
      aiChat: "AI챗",
    },
    eng: {
      copyright: "2024 OS LAB, Daejin University",
      inquiry: "Contact",
      address: "A9-4131, Science & Engineering Bldg., Daejin University",
      membersOnly: "Members Only",
      intranet: "Intranet",
      attendance: "Attendance",
      printing: "Online Printing",
      computing: "Computing Cloud",
      cloud: "Cloud",
      aiChat: "AI Chat",
    },
  };

  // 푸터 요소 업데이트
  updateElementContent("footerCopyright", footerTexts[lang].copyright);
  updateElementContent("footerInquiry", footerTexts[lang].inquiry);
  updateElementContent("footerAddress", footerTexts[lang].address);
  updateElementContent("footerMembersOnly", footerTexts[lang].membersOnly);
  updateElementContent("footerIntranet", footerTexts[lang].intranet);
  updateElementContent("footerAttendance", footerTexts[lang].attendance);
  updateElementContent("footerPrinting", footerTexts[lang].printing);
  updateElementContent("footerComputing", footerTexts[lang].computing);
  updateElementContent("footerCloud", footerTexts[lang].cloud);
  updateElementContent("footerAIChat", footerTexts[lang].aiChat);

  // 푸터 주소 아이콘 추가
  const addressElement = document.getElementById("footerAddress");
  if (addressElement) {
    const icon = document.createElement("i");
    icon.className = "fas fa-map-marker-alt";
    addressElement.innerHTML = "";
    addressElement.appendChild(icon);
    addressElement.appendChild(
      document.createTextNode(" " + footerTexts[lang].address)
    );
  }
}

// 초기화 함수
function initializeLanguage() {
  const lang = getLanguage();
  setLanguage(lang);

  // 언어 변경 버튼 이벤트 리스너 설정
  document.querySelectorAll("#korBtn, #korBtnMobile").forEach((btn) => {
    if (btn) btn.addEventListener("click", () => setLanguage("kor"));
  });

  document.querySelectorAll("#engBtn, #engBtnMobile").forEach((btn) => {
    if (btn) btn.addEventListener("click", () => setLanguage("eng"));
  });
}

// DOM이 로드되면 언어 설정 초기화
document.addEventListener("DOMContentLoaded", initializeLanguage);
