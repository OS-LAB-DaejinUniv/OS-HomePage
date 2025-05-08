// 쿠키 설정 함수
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// 쿠키 가져오기 함수
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// 언어 설정 함수
function setLanguage(lang) {
  const pageTitles = {
    "Professor.html": { kor: "교수 소개", eng: "Professor" },
    "Research.html": { kor: "연구 활동", eng: "Research" },
    "Members.html": { kor: "멤버 소개", eng: "Members" },
  };

  const currentPage = window.location.pathname.split("/").pop();
  const titleSuffix = pageTitles[currentPage]
    ? pageTitles[currentPage][lang]
    : "";

  if (lang === "kor") {
    document.querySelectorAll(".language-option").forEach((btn) => {
      if (btn.id.includes("kor")) {
        btn.classList.add("active");
        btn.classList.remove("inactive");
      } else {
        btn.classList.add("inactive");
        btn.classList.remove("active");
      }
    });
    // 텍스트를 한국어로 변경
    document.getElementById("home_Link").innerText = "메인 화면";
    document.getElementById("professor_Link").innerText = "교수 소개";
    document.getElementById("research_Link").innerText = "연구 활동";
    document.getElementById("members_Link").innerText = "멤버 소개";
    document.querySelector("title").innerText =
      "OS LAB" + (titleSuffix ? " - " + titleSuffix : "");
    if (document.querySelector("h1")) {
      document.querySelector("h1").innerText = titleSuffix;
    }
    updateDropdownMenu("kor");
  } else {
    document.querySelectorAll(".language-option").forEach((btn) => {
      if (btn.id.includes("eng")) {
        btn.classList.add("active");
        btn.classList.remove("inactive");
      } else {
        btn.classList.add("inactive");
        btn.classList.remove("active");
      }
    });
    // 텍스트를 영어로 변경
    document.getElementById("home_Link").innerText = "Home";
    document.getElementById("professor_Link").innerText = "Professor";
    document.getElementById("research_Link").innerText = "Research";
    document.getElementById("members_Link").innerText = "Members";
    document.querySelector("title").innerText =
      "OS LAB" + (titleSuffix ? " - " + titleSuffix : "");
    if (document.querySelector("h1")) {
      document.querySelector("h1").innerText = titleSuffix;
    }
    updateDropdownMenu("eng");
  }
  setCookie("language", lang, 30); // 쿠키를 30일간 유지

  // 현재 페이지 링크에 하단 줄 추가
  highlightCurrentPage();

  // 홈 페이지 콘텐츠 업데이트
  updateHomeContent(lang);

  // 언어 변경 이벤트 디스패치 - 모든 페이지에서 공통으로 사용
  document.dispatchEvent(new Event("languageChanged"));
}

// 드롭다운 메뉴 업데이트 함수
function updateDropdownMenu(lang) {
  const dropdownMenu = document.getElementById("dropdownMenuCustom");
  if (!dropdownMenu) return; // 요소가 없으면 함수 종료

  dropdownMenu.innerHTML = "";
  const itemsKor = [
    { text: "메인 화면", link: "/" },
    { text: "교수 소개", link: "/Professor" },
    { text: "연구 활동", link: "/Research" },
    { text: "멤버 소개", link: "/Members" },
  ];

  const itemsEng = [
    { text: "Home", link: "/" },
    { text: "Professor", link: "/Professor" },
    { text: "Research", link: "/Research" },
    { text: "Members", link: "/Members" },
  ];

  const items = lang === "kor" ? itemsKor : itemsEng;

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

// 페이지 로드 시 현재 페이지 링크에 하단 줄 추가
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

// 페이지 로드 시 쿠키에서 언어 설정 불러오기
document.addEventListener("DOMContentLoaded", function () {
  const lang = getCookie("language") || "kor";
  setLanguage(lang);

  // 홈페이지에서만 실행
  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html"
  ) {
    updateHomeContent(lang);
  }
});

// 언어 변경 버튼 클릭 이벤트
document.getElementById("korBtn").addEventListener("click", function () {
  setLanguage("kor");
});

document.getElementById("engBtn").addEventListener("click", function () {
  setLanguage("eng");
});

document.getElementById("korBtnMobile").addEventListener("click", function () {
  setLanguage("kor");
});

document.getElementById("engBtnMobile").addEventListener("click", function () {
  setLanguage("eng");
});

// 홈 페이지 콘텐츠 업데이트 함수
function updateHomeContent(lang) {
  // 홈페이지가 아니면 리턴
  if (
    window.location.pathname !== "/" &&
    window.location.pathname !== "/index.html"
  ) {
    return;
  }

  fetch("/json/home.json")
    .then((response) => response.json())
    .then((data) => setHomeContent(data, lang))
    .catch((error) => {
      console.error("Error loading content:", error);
      // 에러시 기본 텍스트 설정
      setDefaultHomeContent(lang);
    });
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

  // 슬로건 설정
  if (document.getElementById("sloganTopH3"))
    document.getElementById("sloganTopH3").innerText = content.sloganTop.title;
  if (document.getElementById("sloganTopLine1"))
    document.getElementById("sloganTopLine1").innerText =
      content.sloganTop.line1;
  if (document.getElementById("sloganTopLine2"))
    document.getElementById("sloganTopLine2").innerText =
      content.sloganTop.line2;

  if (document.getElementById("sloganMidH3"))
    document.getElementById("sloganMidH3").innerText = content.sloganMid.title;
  if (document.getElementById("sloganMidLine1"))
    document.getElementById("sloganMidLine1").innerText =
      content.sloganMid.line1;
  if (document.getElementById("sloganMidLine2"))
    document.getElementById("sloganMidLine2").innerText =
      content.sloganMid.line2;

  if (document.getElementById("sloganBotH3"))
    document.getElementById("sloganBotH3").innerText = content.sloganBot.title;
  if (document.getElementById("sloganBotLine1"))
    document.getElementById("sloganBotLine1").innerText =
      content.sloganBot.line1;
  if (document.getElementById("sloganBotLine2"))
    document.getElementById("sloganBotLine2").innerText =
      content.sloganBot.line2;

  if (document.getElementById("viewProjectsBtn"))
    document.getElementById("viewProjectsBtn").innerText =
      content.projectButtonText;
}

// 홈 페이지 콘텐츠 설정 함수 - 새로운 피처 카드 구조에 맞게 수정
function setHomeContent(data, lang) {
  if (!data) {
    console.error("No data provided to setHomeContent");
    return;
  }

  const sloganTop = data.sloganTop[lang];
  const sloganMid = data.sloganMid[lang];
  const sloganBot = data.sloganBot[lang];
  const projectButtonText = data.projectButtonText[lang];

  // 각 요소가 존재하는지 확인 후 설정
  if (document.getElementById("sloganTopH3"))
    document.getElementById("sloganTopH3").innerText = sloganTop.title;

  if (document.getElementById("sloganTopLine1"))
    document.getElementById("sloganTopLine1").innerText = sloganTop.line1;

  if (document.getElementById("sloganTopLine2"))
    document.getElementById("sloganTopLine2").innerText = sloganTop.line2;

  if (document.getElementById("sloganMidH3"))
    document.getElementById("sloganMidH3").innerText = sloganMid.title;

  if (document.getElementById("sloganMidLine1"))
    document.getElementById("sloganMidLine1").innerText = sloganMid.line1;

  if (document.getElementById("sloganMidLine2"))
    document.getElementById("sloganMidLine2").innerText = sloganMid.line2;

  if (document.getElementById("sloganBotH3"))
    document.getElementById("sloganBotH3").innerText = sloganBot.title;

  if (document.getElementById("sloganBotLine1"))
    document.getElementById("sloganBotLine1").innerText = sloganBot.line1;

  if (document.getElementById("sloganBotLine2"))
    document.getElementById("sloganBotLine2").innerText = sloganBot.line2;

  if (document.getElementById("viewProjectsBtn"))
    document.getElementById("viewProjectsBtn").innerText = projectButtonText;

  // 새로운 피처 카드 콘텐츠 설정
  const contents = data.contents;

  if (contents && contents.length > 0) {
    contents.forEach((content, index) => {
      // 새 구조에 맞게 ID 변경
      const titleElement = document.getElementById(`featureTitle${index + 1}`);
      const contentElement = document.getElementById(
        `featureContent${index + 1}`
      );

      if (titleElement && contentElement) {
        titleElement.textContent = content.title[lang];
        contentElement.innerHTML = content.content[lang]
          .replace(/<br>/g, " ") // <br> 태그를 공백으로 대체하여 간결하게
          .replace(/\n/g, " "); // 줄바꿈 역시 공백으로
      }
    });
  }
}
