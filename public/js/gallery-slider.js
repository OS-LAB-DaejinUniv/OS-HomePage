document.addEventListener("DOMContentLoaded", function () {
  console.log("갤러리 슬라이더 스크립트 로드됨");

  // 이미지 정보
  const galleryImages = [
    { src: "/images/Home/gallery-1.jpg", desc: "연구실 MT" },
    { src: "/images/Home/gallery-2.jpg", desc: "연구실 연합 MT" },
    { src: "/images/Home/gallery-3.jpg", desc: "스승의 날" },
    { src: "/images/Home/gallery-4.jpg", desc: "시험기간" },
  ];

  // 슬라이더 요소 선택
  const tabletSlider = document.querySelector(".tablet-slider .slider-track");
  const mobileSlider = document.querySelector(".mobile-slider .slider-track");

  console.log("태블릿 슬라이더 요소:", tabletSlider);
  console.log("모바일 슬라이더 요소:", mobileSlider);

  // 태블릿 슬라이더 설정 (각 슬라이드 = 1개 이미지, 2개 보임)
  function setupTabletSlider() {
    if (!tabletSlider) {
      console.error("태블릿 슬라이더 요소를 찾을 수 없음");
      return;
    }
    tabletSlider.innerHTML = "";
    galleryImages.forEach((image) => {
      const slide = document.createElement("div");
      slide.className = "slide";
      slide.style.width = "50%";
      slide.style.position = "relative";
      const img = document.createElement("img");
      img.src = image.src;
      img.alt = image.desc;
      img.style.objectFit = "contain";
      const desc = document.createElement("div");
      desc.className = "description-circle";
      desc.textContent = image.desc;
      slide.appendChild(img);
      slide.appendChild(desc);
      tabletSlider.appendChild(slide);
    });
    // 복제: 첫 슬라이드를 추가해 seamless 효과
    const firstClone = tabletSlider.firstElementChild.cloneNode(true);
    tabletSlider.appendChild(firstClone);
    console.log("태블릿 슬라이더 설정 완료 with duplicate");
  }

  // 모바일 슬라이더 설정 (각 슬라이드 = 1개 이미지)
  function setupMobileSlider() {
    if (!mobileSlider) {
      console.error("모바일 슬라이더 요소를 찾을 수 없음");
      return;
    }
    mobileSlider.innerHTML = "";
    galleryImages.forEach((image) => {
      const slide = document.createElement("div");
      slide.className = "slide";
      slide.style.width = "100%";
      slide.style.position = "relative";
      const img = document.createElement("img");
      img.src = image.src;
      img.alt = image.desc;
      img.style.objectFit = "contain";
      const desc = document.createElement("div");
      desc.className = "description-circle";
      desc.textContent = image.desc;
      slide.appendChild(img);
      slide.appendChild(desc);
      mobileSlider.appendChild(slide);
    });
    // 복제: 첫 슬라이드를 추가
    const firstClone = mobileSlider.firstElementChild.cloneNode(true);
    mobileSlider.appendChild(firstClone);
    console.log("모바일 슬라이더 설정 완료 with duplicate");
  }

  // 슬라이더 초기화
  setupTabletSlider();
  setupMobileSlider();

  // 현재 슬라이드 인덱스 초기화
  let tabletCurrentIndex = 0;
  let mobileCurrentIndex = 0;

  // 태블릿 슬라이드 변경: 한 슬라이드(50% 폭)씩 이동
  function slideTablet() {
    if (!tabletSlider) return;
    tabletCurrentIndex++;
    tabletSlider.style.transition = "transform 1s ease";
    tabletSlider.style.transform = `translateX(-${tabletCurrentIndex * 50}%)`;
    console.log(`태블릿 슬라이드 변경: ${tabletCurrentIndex}`);
    // 복제 슬라이드에 도달하면 즉시 초기화
    if (tabletCurrentIndex === galleryImages.length) {
      setTimeout(() => {
        tabletSlider.style.transition = "none";
        tabletSlider.style.transform = "translateX(0)";
        tabletCurrentIndex = 0;
      }, 1000);
    }
  }

  // 모바일 슬라이드 변경: 한 슬라이드(100% 폭)씩 이동
  function slideMobile() {
    if (!mobileSlider) return;
    mobileCurrentIndex++;
    mobileSlider.style.transition = "transform 1s ease";
    mobileSlider.style.transform = `translateX(-${mobileCurrentIndex * 100}%)`;
    console.log(`모바일 슬라이드 변경: ${mobileCurrentIndex}`);
    if (mobileCurrentIndex === galleryImages.length) {
      setTimeout(() => {
        mobileSlider.style.transition = "none";
        mobileSlider.style.transform = "translateX(0)";
        mobileCurrentIndex = 0;
      }, 1000);
    }
  }

  // 5초간 정지 후 1초 전환, 총 6초 간격
  setInterval(slideTablet, 6000);
  setInterval(slideMobile, 6000);

  // 화면 크기 변경 시 슬라이더 초기화
  window.addEventListener("resize", function () {
    console.log("화면 크기 변경 감지, 슬라이더 재설정");
    setupTabletSlider();
    setupMobileSlider();
    tabletCurrentIndex = 0;
    mobileCurrentIndex = 0;
    if (tabletSlider) tabletSlider.style.transform = "translateX(0)";
    if (mobileSlider) mobileSlider.style.transform = "translateX(0)";
  });

  console.log("갤러리 슬라이더 초기화 완료");
});
