// 쿠키 설정 함수
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// 쿠키 가져오기 함수
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

// 언어 설정 함수
function setLanguage(lang) {
    const pageTitles = {
        'Notices.html': { kor: '공지사항', eng: 'Notice' },
        'Projects.html': { kor: '프로젝트', eng: 'Projects' },
        'OS-Log.html': { kor: 'OS 마당', eng: 'OS Log' },
        'Members.html': { kor: '멤버 소개', eng: 'Members' }
    };

    const currentPage = window.location.pathname.split('/').pop();
    const titleSuffix = pageTitles[currentPage] ? pageTitles[currentPage][lang] : '';

    if (lang === 'kor') {
        document.querySelectorAll('.language-option').forEach(btn => {
            if (btn.id.includes('kor')) {
                btn.classList.add('active');
                btn.classList.remove('inactive');
            } else {
                btn.classList.add('inactive');
                btn.classList.remove('active');
            }
        });
        // 텍스트를 한국어로 변경
        document.getElementById('noticeLink').innerText = '공지사항';
        document.getElementById('projectsLink').innerText = '프로젝트';
        document.getElementById('osLogLink').innerText = 'OS 마당';
        document.getElementById('membersLink').innerText = '멤버 소개';
        document.querySelector('title').innerText = 'OS LAB' + (titleSuffix ? ' - ' + titleSuffix : '');
        if (document.querySelector('h1')) {
            document.querySelector('h1').innerText = titleSuffix;
        }
        updateDropdownMenu('kor');
    } else {
        document.querySelectorAll('.language-option').forEach(btn => {
            if (btn.id.includes('eng')) {
                btn.classList.add('active');
                btn.classList.remove('inactive');
            } else {
                btn.classList.add('inactive');
                btn.classList.remove('active');
            }
        });
        // 텍스트를 영어로 변경
        document.getElementById('noticeLink').innerText = 'Notice';
        document.getElementById('projectsLink').innerText = 'Projects';
        document.getElementById('osLogLink').innerText = 'OS Log';
        document.getElementById('membersLink').innerText = 'Members';
        document.querySelector('title').innerText = 'OS LAB' + (titleSuffix ? ' - ' + titleSuffix : '');
        if (document.querySelector('h1')) {
            document.querySelector('h1').innerText = titleSuffix;
        }
        updateDropdownMenu('eng');
    }
    setCookie('language', lang, 30); // 쿠키를 30일간 유지

    // 현재 페이지 링크에 하단 줄 추가
    highlightCurrentPage();
}

// 드롭다운 메뉴 업데이트 함수
function updateDropdownMenu(lang) {
    const dropdownMenu = document.getElementById('dropdownMenuCustom');
    dropdownMenu.innerHTML = '';

    const itemsKor = [
        { text: '공지사항', link: '/HTML/Notices.html' },
        { text: '프로젝트', link: '/HTML/Projects.html' },
        { text: 'OS 마당', link: '/HTML/OS-Log.html' },
        { text: '멤버 소개', link: '/HTML/Members.html' },
    ];

    const itemsEng = [
        { text: 'Notice', link: '/HTML/Notices.html' },
        { text: 'Projects', link: '/HTML/Projects.html' },
        { text: 'OS Log', link: '/HTML/OS-Log.html' },
        { text: 'Members', link: '/HTML/Members.html' },
    ];

    const items = lang === 'kor' ? itemsKor : itemsEng;

    items.forEach(item => {
        const a = document.createElement('a');
        a.classList.add('dropdown-item');
        a.href = item.link;
        a.innerText = item.text;
        dropdownMenu.appendChild(a);
    });
}

// 페이지 로드 시 현재 페이지 링크에 하단 줄 추가
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop();
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        if (link.href.includes(currentPage) && currentPage !== 'index.html') {
            link.classList.add('current-page');
        } else {
            link.classList.remove('current-page');
        }
    });
}

// 페이지 로드 시 쿠키에서 언어 설정 불러오기
window.onload = function() {
    const lang = getCookie('language');
    if (lang) {
        setLanguage(lang);
    } else {
        setLanguage('kor'); // 기본값 설정
    }
    highlightCurrentPage();
}

// 언어 변경 버튼 클릭 이벤트
document.getElementById('korBtn').addEventListener('click', function() {
    setLanguage('kor');
});

document.getElementById('engBtn').addEventListener('click', function() {
    setLanguage('eng');
});

document.getElementById('korBtnMobile').addEventListener('click', function() {
    setLanguage('kor');
});

document.getElementById('engBtnMobile').addEventListener('click', function() {
    setLanguage('eng');
});