document.addEventListener("DOMContentLoaded", function () {
  // 갤러리 이미지 정보 배열
  const galleryImages = [
    {
      src: "/images/Home/gallery-1.jpg",
      alt: "Gallery Image 1",
      desc: "연구실 MT",
    },
    {
      src: "/images/Home/gallery-2.jpg",
      alt: "Gallery Image 2",
      desc: "연구실 연합 MT",
    },
    {
      src: "/images/Home/gallery-3.jpg",
      alt: "Gallery Image 3",
      desc: "스승의 날",
    },
    {
      src: "/images/Home/gallery-4.jpg",
      alt: "Gallery Image 4",
      desc: "시험기간",
    },
  ];

  // 전역 변수로 인터벌 선언하여 에러 방지
  let tabletAutoSlideInterval;
  let mobileAutoSlideInterval;
  let tabletSlideIndex = 1;
  let mobileSlideIndex = 1;

  // 태블릿과 모바일 슬라이더 요소
  const tabletSlider = document.querySelector(".tablet-slider .slider-track");
  const mobileSlider = document.querySelector(".mobile-slider .slider-track");

  // 슬라이더 초기화
  if (tabletSlider) setupTabletSlider();
  if (mobileSlider) setupMobileSlider();

  // 태블릿 슬라이더 설정 (각 슬라이드 = 1개 이미지, 2개 보임)
  function setupTabletSlider() {
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
    setupTabletSliderControls();

    // 자동 슬라이드 시작 전 약간의 지연
    setTimeout(() => {
      setupTabletAutoSlide();
    }, 100);
  }

  // 태블릿 슬라이더 컨트롤 추가
  function setupTabletSliderControls() {
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

  // 모바일 슬라이더 설정 (각 슬라이드 = 1개 이미지)
  function setupMobileSlider() {
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
    setupMobileSliderControls();
    setupMobileAutoSlide();
  }

  // 모바일 슬라이더 컨트롤 추가
  function setupMobileSliderControls() {
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

  // 태블릿 자동 슬라이드 - 수정된 버전
  function setupTabletAutoSlide() {
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
          tabletSlider.style.transform = `translateX(-${
            tabletSlideIndex * 50
          }%)`;
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

  // 모바일 자동 슬라이드 - 프로그레스 바 관련 코드 제거
  function setupMobileAutoSlide() {
    clearInterval(mobileAutoSlideInterval);

    mobileAutoSlideInterval = setInterval(() => {
      setTimeout(() => {
        mobileSlideIndex++;
        mobileSlider.style.transition = "transform 0.8s ease";
        mobileSlider.style.transform = `translateX(-${
          mobileSlideIndex * 100
        }%)`;

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

  // 터치 슬라이드 기능 추가
  let touchStartX = 0;
  let touchEndX = 0;

  // 태블릿 슬라이더 터치 이벤트
  const tabletSliderWrapper = document.querySelector(
    ".tablet-slider .slider-wrapper"
  );

  if (tabletSliderWrapper) {
    tabletSliderWrapper.addEventListener(
      "touchstart",
      (e) => {
        clearInterval(tabletAutoSlideInterval);
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    tabletSliderWrapper.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleTabletSwipe(touchStartX, touchEndX);
      },
      { passive: true }
    );

    // 도트 클릭 이벤트
    tabletSliderWrapper.addEventListener("click", (e) => {
      if (e.target.classList.contains("slider-dot")) {
        const index = parseInt(e.target.dataset.index);
        tabletSlideIndex = index + 1;
        tabletSlider.style.transition = "transform 0.5s ease";
        tabletSlider.style.transform = `translateX(-${tabletSlideIndex * 50}%)`;
        updateTabletActiveDot(index);

        // 자동 슬라이드 재시작
        clearInterval(tabletAutoSlideInterval);
        setupTabletAutoSlide();
      }
    });
  }

  // 태블릿 스와이프 처리 - 수정
  function handleTabletSwipe(startX, endX) {
    const diff = startX - endX;
    const threshold = 50; // 스와이프로 인정할 최소 거리

    if (Math.abs(diff) < threshold) {
      // 자동 슬라이드 재시작
      setupTabletAutoSlide();
      return;
    }

    tabletSlider.style.transition = "transform 0.5s ease";

    if (diff > 0) {
      // 왼쪽으로 스와이프: 다음 슬라이드
      tabletSlideIndex++;
      if (tabletSlideIndex > galleryImages.length + 1) {
        tabletSlideIndex = 2; // 마지막 슬라이드에서 첫 번째로
      }
    } else {
      // 오른쪽으로 스와이프: 이전 슬라이드
      tabletSlideIndex--;
      if (tabletSlideIndex < 0) {
        tabletSlideIndex = galleryImages.length - 1; // 첫 번째에서 마지막으로
      }
    }

    tabletSlider.style.transform = `translateX(-${tabletSlideIndex * 50}%)`;
    updateTabletActiveDot((tabletSlideIndex - 1) % galleryImages.length);

    // 자동 슬라이드 재시작
    setupTabletAutoSlide();
  }

  // 모바일 슬라이더 터치 이벤트
  const mobileSliderWrapper = document.querySelector(
    ".mobile-slider .slider-wrapper"
  );

  if (mobileSliderWrapper) {
    mobileSliderWrapper.addEventListener(
      "touchstart",
      (e) => {
        clearInterval(mobileAutoSlideInterval);
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    mobileSliderWrapper.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleMobileSwipe(touchStartX, touchEndX);
      },
      { passive: true }
    );

    // 도트 클릭 이벤트
    mobileSliderWrapper.addEventListener("click", (e) => {
      if (e.target.classList.contains("slider-dot")) {
        const index = parseInt(e.target.dataset.index);
        mobileSlideIndex = index + 1;
        mobileSlider.style.transition = "transform 0.5s ease";
        mobileSlider.style.transform = `translateX(-${
          mobileSlideIndex * 100
        }%)`;
        updateMobileActiveDot(index);

        // 자동 슬라이드 재시작
        clearInterval(mobileAutoSlideInterval);
        setupMobileAutoSlide();
      }
    });
  }

  // 모바일 스와이프 처리
  function handleMobileSwipe(startX, endX) {
    const diff = startX - endX;
    const threshold = 50;

    if (Math.abs(diff) < threshold) {
      // 자동 슬라이드 재시작
      setupMobileAutoSlide();
      return;
    }

    mobileSlider.style.transition = "transform 0.5s ease";

    if (diff > 0) {
      // 다음 슬라이드
      mobileSlideIndex++;
    } else {
      // 이전 슬라이드
      mobileSlideIndex--;
    }

    mobileSlider.style.transform = `translateX(-${mobileSlideIndex * 100}%)`;

    // 경계 처리
    if (mobileSlideIndex <= 0) {
      updateMobileActiveDot(galleryImages.length - 1);
      setTimeout(() => {
        mobileSlider.style.transition = "none";
        mobileSlideIndex = galleryImages.length;
        mobileSlider.style.transform = `translateX(-${
          mobileSlideIndex * 100
        }%)`;
        setupMobileAutoSlide();
      }, 500);
    } else if (mobileSlideIndex >= galleryImages.length + 1) {
      updateMobileActiveDot(0);
      setTimeout(() => {
        mobileSlider.style.transition = "none";
        mobileSlideIndex = 1;
        mobileSlider.style.transform = `translateX(-${
          mobileSlideIndex * 100
        }%)`;
        setupMobileAutoSlide();
      }, 500);
    } else {
      updateMobileActiveDot(mobileSlideIndex - 1);
      setupMobileAutoSlide();
    }
  }

  // 창 크기 변경 시 슬라이더 재설정
  window.addEventListener(
    "resize",
    debounce(() => {
      clearInterval(tabletAutoSlideInterval);
      clearInterval(mobileAutoSlideInterval);
      if (tabletSlider) setupTabletSlider();
      if (mobileSlider) setupMobileSlider();
    }, 200)
  );

  // debounce 함수: 이벤트 처리 최적화
  function debounce(func, wait) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }

  // 페이지 포커스 재진입 시 슬라이더 재시작 - 수정
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      clearInterval(tabletAutoSlideInterval);
      clearInterval(mobileAutoSlideInterval);

      // 슬라이더 요소가 존재하는지 확인 후 재초기화
      if (tabletSlider && mobileSlider) {
        setupTabletSlider();
        setupMobileSlider();
      }
    }
  });

  // 콘솔 디버깅
  console.log("갤러리 슬라이더 초기화 완료");
});
