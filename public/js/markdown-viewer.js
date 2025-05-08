/**
 * 마크다운 뷰어 기능
 * marked.js 라이브러리를 사용하여 마크다운을 HTML로 변환합니다.
 */

document.addEventListener("DOMContentLoaded", function () {
  // Mermaid 초기화
  if (typeof mermaid !== "undefined") {
    mermaid.initialize({
      startOnLoad: false, // 자동 로드 방지 (우리가 직접 처리할 것임)
      theme: "default",
      securityLevel: "loose", // 외부 링크 허용
      flowchart: {
        htmlLabels: true,
        curve: "linear",
      },
      fontFamily: "HancomMalangMalang, Noto Sans KR, sans-serif",
    });
  }

  // marked.js 설정
  if (typeof marked !== "undefined") {
    // 기존 렌더러 가져오기
    const renderer = new marked.Renderer();

    // 코드 블록 렌더링 함수 오버라이드
    const originalCodeRenderer = renderer.code;
    renderer.code = function (code, language, isEscaped) {
      // Mermaid 문법 감지
      if (language === "mermaid") {
        return `<div class="mermaid">${code}</div>`;
      }
      // 그 외 일반 코드는 기본 렌더러 사용
      return originalCodeRenderer.call(this, code, language, isEscaped);
    };

    marked.setOptions({
      renderer: renderer,
      breaks: true, // 줄바꿈 지원
      gfm: true, // GitHub Flavored Markdown 활성화
      headerIds: true, // 헤더에 ID 자동 생성
      mangle: false, // 헤더 ID에서 특수문자 제거 안 함
      sanitize: false, // HTML 태그를 허용 (XSS 주의)
      smartLists: true, // 스마트 리스트 사용
      smartypants: false, // 스마트 인용부호 사용 안 함
      xhtml: false, // XHTML 준수 안 함
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
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then((markdown) => {
      if (typeof marked !== "undefined") {
        targetElement.innerHTML = marked.parse(markdown);

        // 이미지 로딩 최적화
        optimizeImages(targetElement);

        // Mermaid 다이어그램 렌더링
        renderMermaidDiagrams(targetElement);

        // 코드 블록 하이라이트
        highlightCodeBlocks(targetElement);
      } else {
        targetElement.innerHTML = `<pre>${markdown}</pre>`;
      }
    })
    .catch((error) => {
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
  const images = container.querySelectorAll("img");
  images.forEach((img) => {
    // 레이지 로딩 적용
    img.loading = "lazy";

    // 이미지 확대 기능 (옵션)
    img.addEventListener("click", function () {
      if (this.classList.contains("expanded")) {
        this.classList.remove("expanded");
      } else {
        this.classList.add("expanded");
      }
    });
  });
}

// 코드 블록 하이라이트 (옵션)
function highlightCodeBlocks(container) {
  const codeBlocks = container.querySelectorAll("pre code");
  if (typeof hljs !== "undefined") {
    codeBlocks.forEach((block) => {
      hljs.highlightElement(block);
    });
  }
}

// Mermaid 다이어그램 렌더링 (새 함수 추가)
function renderMermaidDiagrams(container) {
  if (typeof mermaid === "undefined") return;

  // 레이아웃 계산을 위해 작은 지연 추가
  setTimeout(() => {
    try {
      // Mermaid 다이어그램 요소 찾기
      const mermaidDivs = container.querySelectorAll(".mermaid");

      if (mermaidDivs.length > 0) {
        // 각 다이어그램 초기화 및 렌더링
        mermaid.init(undefined, mermaidDivs);

        // 렌더링 후 다이어그램에 스타일 적용
        mermaidDivs.forEach((div) => {
          div.classList.add("mermaid-diagram");
          // SVG 찾기
          const svg = div.querySelector("svg");
          if (svg) {
            svg.style.maxWidth = "100%";
            svg.style.height = "auto";
            svg.style.display = "block";
            svg.style.margin = "1.5rem auto";
          }
        });
      }
    } catch (error) {
      console.error("Error rendering Mermaid diagrams:", error);
    }
  }, 100);
}
