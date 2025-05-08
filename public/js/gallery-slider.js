// 전역 변수로 선언하여 모든 함수에서 접근 가능하도록 함
let tabletAutoSlideInterval;
let mobileAutoSlideInterval;
let tabletSlideIndex = 1;
let mobileSlideIndex = 1;

document.addEventListener("DOMContentLoaded", function () {
  // 초기 갤러리 이미지 설정
  initializeGallery();

  // 언어 변경 이벤트 리스너 추가
  document.addEventListener("languageChanged", function () {
    initializeGallery();
  });
});

// 갤러리 초기화 함수
function initializeGallery() {
  // 현재 언어 확인
  const lang = getLanguage();

  // JSON에서 갤러리 데이터 가져오기
  fetch("/json/home.json")
    .then((response) => response.json())
    .then((data) => {
      if (data && data.gallery && data.gallery.items) {
        setupGallery(data.gallery.items, lang);
      } else {
        console.error("Gallery data not found in home.json");
        setupDefaultGallery(lang);
      }
    })
    .catch((error) => {
      console.error("Error loading gallery data:", error);
      setupDefaultGallery(lang);
    });
}

// 기본 갤러리 데이터 (JSON 로딩 실패 시 사용)
function setupDefaultGallery(lang) {
  const defaultGalleryImages = [
    {
      src: "/images/Home/gallery-1.jpg",
      alt: "Gallery Image 1",
      desc: lang === "kor" ? "연구실 MT" : "Lab Retreat",
    },
    {
      src: "/images/Home/gallery-2.jpg",
      alt: "Gallery Image 2",
      desc: lang === "kor" ? "연구실 연합 MT" : "Joint Lab Retreat",
    },
    {
      src: "/images/Home/gallery-3.jpg",
      alt: "Gallery Image 3",
      desc: lang === "kor" ? "스승의 날" : "Teachers' Day",
    },
    {
      src: "/images/Home/gallery-4.jpg",
      alt: "Gallery Image 4",
      desc: lang === "kor" ? "시험기간" : "Exam Period",
    },
  ];

  setupGallery(defaultGalleryImages, lang);
}

// 갤러리 설정 함수
function setupGallery(galleryData, lang) {
  // 갤러리 이미지 정보 가공
  const galleryImages = galleryData.map((item) => {
    return {
      src: item.src,
      alt: item.alt,
      desc: typeof item.desc === "object" ? item.desc[lang] : item.desc,
    };
  });

  // 데스크탑 갤러리 업데이트
  updateDesktopGallery(galleryImages);

  // 슬라이더 인덱스 초기화
  tabletSlideIndex = 1;
  mobileSlideIndex = 1;

  // 태블릿과 모바일 슬라이더 요소
  const tabletSlider = document.querySelector(".tablet-slider .slider-track");
  const mobileSlider = document.querySelector(".mobile-slider .slider-track");

  // 슬라이더 초기화
  if (tabletSlider) setupTabletSlider(tabletSlider, galleryImages);
  if (mobileSlider) setupMobileSlider(mobileSlider, galleryImages);
}

// 데스크탑 갤러리 요소 업데이트
function updateDesktopGallery(galleryImages) {
  const desktopGallery = document.querySelector(".gallery-desktop");
  if (!desktopGallery) return;

  // 기존 항목 제거
  desktopGallery.innerHTML = "";

  // 새로운 항목 추가
  galleryImages.forEach((image) => {
    const item = document.createElement("div");
    item.className = "gallery-item";

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt;
    img.loading = "lazy";

    const desc = document.createElement("div");
    desc.className = "description-circle";
    desc.textContent = image.desc;

    item.appendChild(img);
    item.appendChild(desc);
    desktopGallery.appendChild(item);
  });
}

// 태블릿 슬라이더 설정 함수
function setupTabletSlider(tabletSlider, galleryImages) {
  if (!tabletSlider) {
    return;
  }
  tabletSlider.innerHTML = "";

  // 원본 슬라이드 생성
  galleryImages.forEach((image) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.style.width = "50%";
    slide.style.position = "relative";

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt;
    img.loading = "lazy"; // 이미지 lazy loading 추가

    const desc = document.createElement("div");
    desc.className = "description-circle";
    desc.textContent = image.desc;

    slide.appendChild(img);
    slide.appendChild(desc);
    tabletSlider.appendChild(slide);
  });

  // 무한 슬라이딩을 위한 복제 슬라이드 - 처음과 마지막 슬라이드 각각 복제
  const firstClone = tabletSlider.firstElementChild.cloneNode(true);
  const secondClone = tabletSlider.children[1].cloneNode(true);
  const lastClone = tabletSlider.lastElementChild.cloneNode(true);
  const secondLastClone =
    tabletSlider.children[tabletSlider.children.length - 2].cloneNode(true);

  tabletSlider.appendChild(firstClone);
  tabletSlider.appendChild(secondClone);
  tabletSlider.insertBefore(lastClone, tabletSlider.firstElementChild);
  tabletSlider.insertBefore(secondLastClone, tabletSlider.firstElementChild);

  // 초기 위치 설정 - 복제 슬라이드를 고려하여 위치 조정
  tabletSlider.style.transition = "none";
  tabletSlider.style.transform = `translateX(-100%)`;

  // 강제로 레이아웃 재계산 (reflow)
  tabletSlider.offsetHeight;

  // 태블릿용 슬라이더 컨트롤 추가
  setupTabletSliderControls(galleryImages);

  // 자동 슬라이드 시작 전 약간의 지연
  setTimeout(() => {
    setupTabletAutoSlide(tabletSlider, galleryImages);
  }, 100);
}

// 태블릿 슬라이더 컨트롤 추가
function setupTabletSliderControls(galleryImages) {
  const tabletWrapper = document.querySelector(
    ".tablet-slider .slider-wrapper"
  );
  if (!tabletWrapper) return;

  // 기존 컨트롤이 있다면 제거
  const existingControls = tabletWrapper.querySelector(".slider-controls");
  if (existingControls) existingControls.remove();

  // 새 컨트롤 추가
  const controls = document.createElement("div");
  controls.className = "slider-controls";

  for (let i = 0; i < galleryImages.length; i++) {
    const dot = document.createElement("div");
    dot.className = "slider-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("data-index", i);
    controls.appendChild(dot);
  }

  tabletWrapper.appendChild(controls);
}

// 태블릿 자동 슬라이드 함수
function setupTabletAutoSlide(tabletSlider, galleryImages) {
  clearInterval(tabletAutoSlideInterval);

  tabletAutoSlideInterval = setInterval(() => {
    tabletSlideIndex++;

    // transition 적용
    tabletSlider.style.transition = "transform 0.75s ease";
    tabletSlider.style.transform = `translateX(-${tabletSlideIndex * 50}%)`;

    // 무한 루프 처리
    if (tabletSlideIndex >= galleryImages.length + 1) {
      updateTabletActiveDot(0);

      // transition이 끝난 후에 원위치로 리셋
      setTimeout(() => {
        tabletSlider.style.transition = "none";
        tabletSlideIndex = 1;
        tabletSlider.style.transform = `translateX(-${tabletSlideIndex * 50}%)`;
      }, 750);
    } else {
      updateTabletActiveDot((tabletSlideIndex - 1) % galleryImages.length);
    }
  }, 5000);
}

// 태블릿 활성 도트 업데이트
function updateTabletActiveDot(index) {
  const dots = document.querySelectorAll(".tablet-slider .slider-dot");
  if (dots.length === 0) return; // 도트가 없는 경우 처리

  dots.forEach((dot, i) => {
    if (i === index) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

// 모바일 슬라이더 설정 함수
function setupMobileSlider(mobileSlider, galleryImages) {
  if (!mobileSlider) {
    console.error("모바일 슬라이더 요소를 찾을 수 없음");
    return;
  }
  mobileSlider.innerHTML = "";

  // 원본 슬라이드 생성 - 프로그레스 바 제거한 개선 버전
  galleryImages.forEach((image, index) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.style.width = "100%";

    const cardContainer = document.createElement("div");
    cardContainer.className = "mobile-gallery-card";
    cardContainer.style.height = "100%";

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt;
    img.loading = "lazy";

    const overlay = document.createElement("div");
    overlay.className = "mobile-slide-overlay";

    const title = document.createElement("h4");
    title.textContent = image.desc;
    overlay.appendChild(title);

    cardContainer.appendChild(img);
    cardContainer.appendChild(overlay);
    slide.appendChild(cardContainer);
    mobileSlider.appendChild(slide);
  });

  // 무한 슬라이딩을 위한 복제 슬라이드
  const firstSlideClone = mobileSlider.firstElementChild.cloneNode(true);
  const lastSlideClone = mobileSlider.lastElementChild.cloneNode(true);

  mobileSlider.appendChild(firstSlideClone);
  mobileSlider.insertBefore(lastSlideClone, mobileSlider.firstElementChild);

  // 초기 위치 설정
  mobileSlider.style.transform = `translateX(-100%)`;

  // 모바일용 슬라이더 컨트롤 추가
  setupMobileSliderControls(galleryImages);
  setupMobileAutoSlide(mobileSlider, galleryImages);
}

// 모바일 슬라이더 컨트롤 추가
function setupMobileSliderControls(galleryImages) {
  const mobileWrapper = document.querySelector(
    ".mobile-slider .slider-wrapper"
  );
  if (!mobileWrapper) return;

  // 기존 컨트롤이 있다면 제거
  const existingControls = mobileWrapper.querySelector(".slider-controls");
  if (existingControls) existingControls.remove();

  // 새 컨트롤 추가
  const controls = document.createElement("div");
  controls.className = "slider-controls";

  for (let i = 0; i < galleryImages.length; i++) {
    const dot = document.createElement("div");
    dot.className = "slider-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("data-index", i);
    controls.appendChild(dot);
  }

  mobileWrapper.appendChild(controls);
}

// 모바일 자동 슬라이드 함수
function setupMobileAutoSlide(mobileSlider, galleryImages) {
  clearInterval(mobileAutoSlideInterval);

  mobileAutoSlideInterval = setInterval(() => {
    setTimeout(() => {
      mobileSlideIndex++;
      mobileSlider.style.transition = "transform 0.8s ease";
      mobileSlider.style.transform = `translateX(-${mobileSlideIndex * 100}%)`;

      // 무한 루프를 위한 처리
      if (mobileSlideIndex >= galleryImages.length + 1) {
        updateMobileActiveDot(0);
        setTimeout(() => {
          mobileSlider.style.transition = "none";
          mobileSlideIndex = 1;
          mobileSlider.style.transform = `translateX(-${
            mobileSlideIndex * 100
          }%)`;
        }, 800);
      } else {
        updateMobileActiveDot(mobileSlideIndex - 1);
      }
    }, 4000);
  }, 4000);
}

// 모바일 활성 도트 업데이트
function updateMobileActiveDot(index) {
  const dots = document.querySelectorAll(".mobile-slider .slider-dot");
  dots.forEach((dot, i) => {
    if (i === index) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

// 언어 가져오기 함수
function getLanguage() {
  // 기존 함수 내용을 변경하여 language-utils.js의 함수를 사용
  if (typeof getCookie === "function") {
    return getCookie("language") || "kor";
  }
  return "kor";
}
