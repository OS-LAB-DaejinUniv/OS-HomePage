/**
 * 멤버 페이지 특화 기능
 */

document.addEventListener("DOMContentLoaded", function () {
  loadMembersData();
  updatePageStaticText(getLanguage());
});

document.addEventListener("languageChanged", function () {
  loadMembersData();
  updatePageStaticText(getLanguage());
});

function loadMembersData() {
  fetch("/json/members.json")
    .then((response) => response.json())
    .then((data) => {
      const lang = getLanguage();
      renderMembers(data.members, lang);
      setupModalEvents();
    })
    .catch((error) => console.error("Error loading members data:", error));
}

function updatePageStaticText(lang) {
  // 페이지 제목 및 부제목 업데이트
  const titleElem = document.getElementById("membersPageTitle");
  const subtitleElem = document.getElementById("membersPageSubtitle");

  if (titleElem) {
    titleElem.textContent = lang === "eng" ? "OS LAB Members" : "OS LAB 연구실";
  }

  if (subtitleElem) {
    subtitleElem.textContent =
      lang === "eng"
        ? "Dedicated team building infrastructure together"
        : "인프라 구축에 열정을 쏟는 우리 부원들";
  }

  // 문서 제목 업데이트
  document.title =
    lang === "eng" ? "Lab Members - OS LAB" : "연구실 구성원 - OS LAB";

  // 모달 내 정적 텍스트 업데이트
  updateModalTexts(lang);
}

function updateModalTexts(lang) {
  const researchInterestsHeader = document.querySelector(
    ".modal-right .info-section:first-child h4"
  );
  const bioHeader = document.querySelector(
    ".modal-right .info-section:last-child h4"
  );

  if (researchInterestsHeader) {
    const icon = researchInterestsHeader.querySelector("i");
    researchInterestsHeader.innerHTML = "";
    researchInterestsHeader.appendChild(icon);
    researchInterestsHeader.appendChild(
      document.createTextNode(
        lang === "eng" ? " Research Interests" : " 관심 분야"
      )
    );
  }

  if (bioHeader) {
    const icon = bioHeader.querySelector("i");
    bioHeader.innerHTML = "";
    bioHeader.appendChild(icon);
    bioHeader.appendChild(
      document.createTextNode(lang === "eng" ? " Bio" : " 소개")
    );
  }
}

// 멤버 카드 렌더링
function renderMembers(members, lang) {
  const grid = document.getElementById("membersGrid");
  if (!grid) return;

  // 로딩 인디케이터 제거
  grid.innerHTML = "";

  // 랩장이 먼저 표시되도록 정렬
  members.sort((a, b) => {
    if (a.role === "leader" && b.role !== "leader") return -1;
    if (a.role !== "leader" && b.role === "leader") return 1;
    return 0;
  });

  // 각 멤버 카드 생성
  members.forEach((member, index) => {
    const card = createMemberCard(member, lang, index);
    grid.appendChild(card);
  });

  // AOS 새로고침
  if (typeof AOS !== "undefined") {
    AOS.refresh();
  }
}

// 멤버 카드 생성 함수
function createMemberCard(member, lang, index) {
  const card = document.createElement("div");
  card.className = "member-card";
  card.setAttribute("data-aos", "fade-up");
  card.setAttribute("data-aos-delay", `${index * 80}`);
  card.setAttribute("data-index", index.toString());
  card.setAttribute("data-member-id", member.github);

  const interestsHTML = member.interests[lang]
    .map((interest) => `<span class="interest-tag">${interest}</span>`)
    .join("");

  // 카드 내용 구성
  card.innerHTML = `
    <div class="member-image-container">
      <img src="${member.img}" alt="${member.name[lang]}" class="member-image">
      <span class="member-role">${
        member.role === "leader"
          ? lang === "eng"
            ? "Leader"
            : "랩장"
          : lang === "eng"
          ? "Member"
          : "부원"
      }</span>
    </div>
    <div class="member-content">
      <h3 class="member-name">${member.name[lang]}</h3>
      <p class="member-position">${member.position[lang]}</p>
      <div class="member-email">
        <i class="fas fa-envelope"></i>
        <span>${member.email}</span>
      </div>
      <div class="member-interests">
        ${interestsHTML}
      </div>
      <div class="member-footer">
        <a href="https://github.com/${
          member.github
        }" target="_blank" class="github-link">
          <i class="fab fa-github"></i> GitHub
        </a>
        <button class="details-button" data-index="${index}">
          ${
            lang === "eng" ? "Details" : "상세정보"
          } <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  `;

  return card;
}

// 모달 이벤트 설정
function setupModalEvents() {
  // 상세정보 버튼 이벤트
  document.querySelectorAll(".details-button").forEach((button) => {
    button.addEventListener("click", function () {
      const index = parseInt(this.dataset.index);
      openMemberModal(index);
    });
  });

  // 모달 닫기 버튼 이벤트
  document
    .getElementById("modalCloseBtn")
    .addEventListener("click", closeModal);

  // 모달 오버레이 클릭 시 닫기
  document
    .getElementById("memberModalOverlay")
    .addEventListener("click", function (e) {
      if (e.target === this) {
        closeModal();
      }
    });

  // ESC 키 누를 때 모달 닫기
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Escape" &&
      document.getElementById("memberModalOverlay").classList.contains("show")
    ) {
      closeModal();
    }
  });
}

// 모달 열기
function openMemberModal(index) {
  // 현재 언어 가져오기
  const lang = getLanguage();

  // JSON 데이터 다시 가져오기
  fetch("/json/members.json")
    .then((response) => response.json())
    .then((data) => {
      const member = data.members[index];

      // 모달에 데이터 채우기 - 이름이 모달 헤더가 아닌 왼쪽 상단에 위치
      document.getElementById("modalMemberName").textContent =
        member.name[lang];
      document.getElementById("modalMemberPosition").textContent =
        member.position[lang];
      document.getElementById("modalMemberImg").src = member.img;
      document.getElementById("modalMemberEmail").textContent = member.email;
      document.getElementById(
        "modalGithubLink"
      ).href = `https://github.com/${member.github}`;
      document.getElementById("modalGithubLink").textContent = member.github;

      // 관심 분야
      const interestsContainer = document.getElementById(
        "modalMemberInterests"
      );
      interestsContainer.innerHTML = "";
      member.interests[lang].forEach((interest) => {
        const tag = document.createElement("span");
        tag.className = "interest-tag";
        tag.textContent = interest;
        interestsContainer.appendChild(tag);
      });

      // Bio 정보 (있는 경우에만)
      const bioSection = document.getElementById("modalBioSection");
      const bioElement = document.getElementById("modalMemberBio");

      if (member.bio && member.bio[lang]) {
        bioElement.textContent = member.bio[lang];
        bioSection.style.display = "block";
      } else {
        bioSection.style.display = "none";
      }

      // 모달 표시
      document.getElementById("memberModalOverlay").classList.add("show");
      document.body.classList.add("modal-open");
    })
    .catch((error) => console.error("Error loading member details:", error));
}

// 모달 닫기
function closeModal() {
  document.getElementById("memberModalOverlay").classList.remove("show");
  document.body.classList.remove("modal-open");
}

// 페이지 초기화
document.addEventListener("DOMContentLoaded", function () {
  // AOS 초기화
  AOS.init({
    duration: 700,
    once: true,
    offset: 50,
  });
});
