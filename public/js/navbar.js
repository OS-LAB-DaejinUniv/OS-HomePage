// 샌드위치 버튼 클릭 시 드롭다운 메뉴 표시 및 아이콘 애니메이션
document
  .querySelector(".navbar-toggler")
  .addEventListener("click", function () {
    // 버튼에 open 클래스를 토글하여 아이콘 애니메이션 활성화
    this.classList.toggle("open");

    // 드롭다운 메뉴 표시 토글
    const dropdownMenu = document.getElementById("dropdownMenuCustom");
    dropdownMenu.classList.toggle("show");

    // 메뉴가 열려있는지 확인하여 body 스크롤 제어
    if (dropdownMenu.classList.contains("show")) {
      document.body.style.overflow = "hidden"; // 메뉴가 열리면 스크롤 방지
    } else {
      document.body.style.overflow = ""; // 메뉴가 닫히면 스크롤 허용
    }
  });

// 로고 클릭 시 루트 경로로 이동
document
  .querySelector(".navbar-brand")
  .addEventListener("click", function (event) {
    event.preventDefault(); // 기본 동작 막기
    window.location.href = "/"; // 루트 경로로 이동
  });

// 화면 크기 변경 시 샌드위치 메뉴 접기
window.addEventListener("resize", function () {
  const dropdownMenu = document.getElementById("dropdownMenuCustom");
  const toggleButton = document.querySelector(".navbar-toggler");

  if (window.innerWidth > 991 && dropdownMenu.classList.contains("show")) {
    dropdownMenu.classList.remove("show");
    toggleButton.classList.remove("open");
    document.body.style.overflow = ""; // 스크롤 허용
  }
});

// 드롭다운 메뉴 항목 클릭 시 메뉴 닫기
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("#dropdownMenuCustom a").forEach(function (link) {
    link.addEventListener("click", function () {
      const dropdownMenu = document.getElementById("dropdownMenuCustom");
      const toggleButton = document.querySelector(".navbar-toggler");

      dropdownMenu.classList.remove("show");
      toggleButton.classList.remove("open");
      document.body.style.overflow = ""; // 스크롤 허용
    });
  });
});
