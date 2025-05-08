/**
 * 통합 페이지 초기화 스크립트
 * 모든 페이지에서 공통으로 사용하는 기능을 처리합니다.
 */
document.addEventListener("DOMContentLoaded", function () {
  // 언어 설정 확인 및 적용
  const lang = getCookie("language") || "kor";
  applyLanguageToNavigation(lang);

  // 현재 페이지 하이라이트
  highlightCurrentNavItem();

  // 드롭다운 메뉴 초기화
  initializeDropdownMenu(lang);
});

/**
 * 네비게이션 바에 언어 적용
 */
function applyLanguageToNavigation(lang) {
  if (lang === "kor") {
    if (document.getElementById("home_Link"))
      document.getElementById("home_Link").innerText = "메인 화면";

    if (document.getElementById("professor_Link"))
      document.getElementById("professor_Link").innerText = "교수 소개";

    if (document.getElementById("research_Link"))
      document.getElementById("research_Link").innerText = "연구 활동";

    if (document.getElementById("members_Link"))
      document.getElementById("members_Link").innerText = "멤버 소개";
  } else {
    if (document.getElementById("home_Link"))
      document.getElementById("home_Link").innerText = "Home";

    if (document.getElementById("professor_Link"))
      document.getElementById("professor_Link").innerText = "Professor";

    if (document.getElementById("research_Link"))
      document.getElementById("research_Link").innerText = "Research";

    if (document.getElementById("members_Link"))
      document.getElementById("members_Link").innerText = "Members";
  }

  // 언어 선택 버튼 상태 업데이트
  document.querySelectorAll(".language-option").forEach((btn) => {
    if (
      (btn.id.includes("kor") && lang === "kor") ||
      (btn.id.includes("eng") && lang === "eng")
    ) {
      btn.classList.add("active");
      btn.classList.remove("inactive");
    } else {
      btn.classList.add("inactive");
      btn.classList.remove("active");
    }
  });
}

/**
 * 현재 페이지의 네비게이션 항목 하이라이트
 */
function highlightCurrentNavItem() {
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

/**
 * 드롭다운 메뉴 초기화
 */
function initializeDropdownMenu(lang) {
  const dropdownMenu = document.getElementById("dropdownMenuCustom");
  if (!dropdownMenu) return;

  // 메뉴 초기화
  dropdownMenu.innerHTML = "";

  // 메뉴 항목 설정
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

  // 메뉴 항목 생성
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
      dropdownMenu.classList.remove("show");

      const toggleButton = document.querySelector(".navbar-toggler");
      if (toggleButton) toggleButton.classList.remove("open");

      document.body.style.overflow = "";
    });
  });
}
