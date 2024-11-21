// 샌드위치 버튼 클릭 시 드롭다운 메뉴 표시
document.querySelector('.navbar-toggler').addEventListener('click', function() {
    const dropdownMenu = document.getElementById('dropdownMenuCustom');
    dropdownMenu.classList.toggle('show'); // display 토글 대신 클래스 토글 사용
});

// 로고 클릭 시 루트 경로로 이동
document.querySelector('.navbar-brand').addEventListener('click', function(event) {
    event.preventDefault(); // 기본 동작 막기
    window.location.href = '/'; // 루트 경로로 이동
});

// 화면 크기 변경 시 샌드위치 메뉴 접기
window.addEventListener('resize', function() {
    const dropdownMenu = document.getElementById('dropdownMenuCustom');
    if (window.innerWidth > 991 && dropdownMenu.style.display === 'block') {
        dropdownMenu.style.display = 'none';
    }
});