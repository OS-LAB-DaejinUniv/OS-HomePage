document.addEventListener("DOMContentLoaded", function () {
  loadProfessorData();
  updatePageStaticText(getLanguage());
});

document.addEventListener("languageChanged", function () {
  loadProfessorData();
  updatePageStaticText(getLanguage());
});

function loadProfessorData() {
  fetch("/json/professor.json")
    .then((response) => response.json())
    .then((data) => {
      const lang = getLanguage();
      renderProfessorInfo(data.professor, lang);
    })
    .catch((error) => console.error("Error loading professor data:", error));
}

function getLanguage() {
  const cookies = document.cookie
    .split(";")
    .find((c) => c.trim().startsWith("language="));
  return cookies ? cookies.split("=")[1] : "kor";
}

function updatePageStaticText(lang) {
  // 페이지 제목 업데이트
  document.getElementById("professorPageTitle").textContent =
    lang === "eng" ? "Professor" : "교수 소개";

  document.getElementById("professorPageSubtitle").textContent =
    lang === "eng"
      ? "Meet our distinguished professor"
      : "OS 연구실을 이끌어 가시는 교수님을 소개합니다";

  // 문서 제목 업데이트
  document.title = lang === "eng" ? "Professor - OS LAB" : "교수 소개 - OS LAB";
}

function renderProfessorInfo(professor, lang) {
  // 이름과 직책 설정
  document.getElementById("professorName").textContent = professor.name[lang];

  // 직함은 교수님이므로 수동으로 추가
  document.getElementById("professorTitle").textContent =
    lang === "eng"
      ? "Professor, Department of Computer Engineering"
      : "컴퓨터공학과 교수";

  // 연락처 정보 설정
  const contactDetailsContainer = document.getElementById("contactDetails");
  contactDetailsContainer.innerHTML = "";

  professor.contact.forEach((contact) => {
    const contactItem = document.createElement("div");
    contactItem.className = "contact-item";

    // 아이콘 선택
    let iconClass = "fas fa-info-circle"; // 기본 아이콘
    if (contact.label.eng === "Phone") iconClass = "fas fa-phone";
    if (contact.label.eng === "Email") iconClass = "fas fa-envelope";
    if (contact.label.eng === "Major") iconClass = "fas fa-graduation-cap";
    if (contact.label.eng === "Academic Societies") iconClass = "fas fa-users";
    if (contact.label.eng === "Research Areas") iconClass = "fas fa-flask";
    if (contact.label.eng === "Education") iconClass = "fas fa-university";

    const icon = document.createElement("i");
    icon.className = iconClass;
    contactItem.appendChild(icon);

    const contactLabel = document.createElement("span");
    contactLabel.className = "contact-label";
    contactLabel.textContent = contact.label[lang];
    contactItem.appendChild(contactLabel);

    const contactValue = document.createElement("span");
    contactValue.className = "contact-value";

    // 값이 객체인 경우와 문자열인 경우를 구분
    if (typeof contact.value === "object") {
      contactValue.innerHTML = contact.value[lang].replace(/\n/g, "<br>");
    } else {
      contactValue.textContent = contact.value;
    }

    contactItem.appendChild(contactValue);
    contactDetailsContainer.appendChild(contactItem);
  });

  // 경력 및 업적 섹션 설정
  const careerSectionsContainer = document.getElementById("careerSections");
  careerSectionsContainer.innerHTML = "";

  professor.sections.forEach((section, index) => {
    const sectionElement = document.createElement("div");
    sectionElement.className = "career-section";
    sectionElement.setAttribute("data-aos", "fade-up");
    sectionElement.setAttribute("data-aos-delay", (index * 100).toString());

    const sectionTitle = document.createElement("h3");
    sectionTitle.className = "section-title";
    sectionTitle.textContent = section.title[lang];
    sectionElement.appendChild(sectionTitle);

    const sectionContent = document.createElement("div");
    sectionContent.className = "section-content";
    sectionContent.innerHTML = section.content[lang].replace(/\n/g, "<br>");
    sectionElement.appendChild(sectionContent);

    careerSectionsContainer.appendChild(sectionElement);
  });

  // AOS 새로고침 (애니메이션 효과 업데이트)
  if (typeof AOS !== "undefined") {
    AOS.refresh();
  }
}
