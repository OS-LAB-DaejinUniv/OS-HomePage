/**
 * 마크다운 뷰어 기능
 * marked.js 라이브러리를 사용하여 마크다운을 HTML로 변환합니다.
 */

document.addEventListener("DOMContentLoaded", function() {
  // marked.js 설정
  if (typeof marked !== 'undefined') {
    marked.setOptions({
      breaks: true,           // 줄바꿈 지원
      gfm: true,              // GitHub Flavored Markdown 활성화
      headerIds: true,        // 헤더에 ID 자동 생성
      mangle: false,          // 헤더 ID에서 특수문자 제거 안 함
      sanitize: false,        // HTML 태그를 허용 (XSS 주의)
      smartLists: true,       // 스마트 리스트 사용
      smartypants: false,     // 스마트 인용부호 사용 안 함
      xhtml: false            // XHTML 준수 안 함
    });
  }
});

// 마크다운 파일 로드 및 렌더링 함수
function renderMarkdownFromUrl(url, targetElementId) {
  const targetElement = document.getElementById(targetElementId);
  if (!targetElement) return;
  
  // 로딩 표시
  targetElement.innerHTML = '<div class="markdown-loading">Loading...</div>';
  
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then(markdown => {
      if (typeof marked !== 'undefined') {
        targetElement.innerHTML = marked.parse(markdown);
        
        // 이미지 로딩 최적화
        optimizeImages(targetElement);
        
        // 코드 블록 하이라이트
        highlightCodeBlocks(targetElement);
      } else {
        targetElement.innerHTML = `<pre>${markdown}</pre>`;
      }
    })
    .catch(error => {
      console.error("Error rendering markdown:", error);
      targetElement.innerHTML = `
        <div class="markdown-error">
          <p>Failed to load markdown content.</p>
          <small>${error.message}</small>
        </div>
      `;
    });
}

// 이미지 로딩 최적화
function optimizeImages(container) {
  const images = container.querySelectorAll('img');
  images.forEach(img => {
    // 레이지 로딩 적용
    img.loading = 'lazy';
    
    // 이미지 확대 기능 (옵션)
    img.addEventListener('click', function() {
      if (this.classList.contains('expanded')) {
        this.classList.remove('expanded');
      } else {
        this.classList.add('expanded');
      }
    });
  });
}

// 코드 블록 하이라이트 (옵션)
function highlightCodeBlocks(container) {
  const codeBlocks = container.querySelectorAll('pre code');
  if (typeof hljs !== 'undefined') {
    codeBlocks.forEach(block => {
      hljs.highlightElement(block);
    });
  }
}
