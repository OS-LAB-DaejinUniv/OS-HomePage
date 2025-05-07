document.addEventListener("DOMContentLoaded", function () {
  fetch("/json/members.json")
    .then((response) => response.json())
    .then((data) => setMembersContent(data, getLanguage()))
    .catch((error) => console.error("Error loading members content:", error));
});

document.addEventListener("languageChanged", function () {
  fetch("/json/members.json")
    .then((response) => response.json())
    .then((data) => setMembersContent(data, getLanguage()))
    .catch((error) => console.error("Error updating members content:", error));
});

function getLanguage() {
  const cookies = document.cookie
    .split(";")
    .find((c) => c.trim().startsWith("language="));
  return cookies ? cookies.split("=")[1] : "kor";
}

function setMembersContent(data, lang) {
  const container = document.getElementById("membersContainer");
  if (!container) return;

  // 로딩 인디케이터 제거
  container.innerHTML = "";

  let html = "";
  data.members.forEach((member, index) => {
    // AOS 애니메이션 효과 (번갈아가며 다른 방향에서 나타남)
    const aosAnimation = index % 2 === 0 ? "fade-right" : "fade-left";

    html += `
      <div class="col-lg-4 col-md-6 member-card-container" data-role="${
        member.role
      }" data-aos="${aosAnimation}" data-aos-delay="${index * 100}">
        <div class="member-card">
          <div class="member-img-container">
            <img src="${member.img}" alt="${
      member.name[lang]
    }" class="member-img">
            <span class="position-badge">${member.position[lang]}</span>
          </div>
          <div class="member-info">
            <h3>${member.name[lang]}</h3>
            <div class="email">
              <i class="fas fa-envelope"></i> 
              <span>${member.email}</span>
            </div>
            <div class="member-interests">
              ${member.interests[lang]
                .map(
                  (interest) => `<span class="member-tag">${interest}</span>`
                )
                .join("")}
            </div>
          </div>
          <div class="member-footer">
            <a href="https://github.com/${
              member.github
            }" target="_blank" class="github-btn">
              <i class="fab fa-github"></i> GitHub
            </a>
            <span class="detail-btn" onclick="showMemberDetail(${index}, '${lang}')">
              ${lang === "eng" ? "Details" : "상세정보"} &rarr;
            </span>
          </div>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;

  // AOS 새로고침
  if (typeof AOS !== "undefined") {
    AOS.refresh();
  }

  // showMemberDetail 함수를 전역으로 정의
  window.showMemberDetail = function (index, lang) {
    const member = data.members[index];

    // 모달에 데이터 채우기
    document.getElementById("modalMemberName").textContent = member.name[lang];
    document.getElementById("modalMemberPosition").textContent =
      member.position[lang];
    document.getElementById("modalMemberImg").src = member.img;
    document.getElementById("modalMemberEmail").textContent = member.email;

    // 관심 분야 채우기
    const interestsContainer = document.getElementById("modalMemberInterests");
    interestsContainer.innerHTML = "";
    member.interests[lang].forEach((interest) => {
      const interestElem = document.createElement("span");
      interestElem.className = "interest-tag";
      interestElem.textContent = interest;
      interestsContainer.appendChild(interestElem);
    });

    // GitHub 링크 설정
    document.getElementById(
      "modalGithubLink"
    ).href = `https://github.com/${member.github}`;

    // 모달 타이틀 설정
    document.getElementById("memberDetailModalLabel").textContent =
      lang === "eng" ? "Member Details" : "멤버 상세 정보";

    // 모달 열기
    const modal = new bootstrap.Modal(
      document.getElementById("memberDetailModal")
    );
    modal.show();
  };
}
