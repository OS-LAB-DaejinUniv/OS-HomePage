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

  // 직함에 약어 사용 (영어의 경우)
  document.getElementById("professorTitle").textContent =
    lang === "eng" ? "Prof., Dept. of Computer Eng." : "컴퓨터공학과 교수";

  // 연락처 정보 설정
  const contactDetailsContainer = document.getElementById("contactDetails");
  contactDetailsContainer.innerHTML = "";

  // 영어일 때 contact-label 클래스에 'eng' 클래스 추가
  if (lang === "eng") {
    contactDetailsContainer.classList.add("eng-mode");
  } else {
    contactDetailsContainer.classList.remove("eng-mode");
  }

  professor.contact.forEach((contact) => {
    const contactItem = document.createElement("div");
    contactItem.className = "contact-item";

    // 아이콘 선택 로직 개선
    let iconClass = "fas fa-info-circle"; // 기본 아이콘
    if (contact.label.eng === "Office") iconClass = "fas fa-building";
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

    // 영어일 때 약어 사용
    let labelText = contact.label[lang];
    if (lang === "eng") {
      if (contact.label.eng === "Academic Societies") labelText = "Societies";
      if (contact.label.eng === "Research Areas") labelText = "Research";
      // Office는 충분히 짧아서 약어가 필요없음
    }

    contactLabel.textContent = labelText;
    contactItem.appendChild(contactLabel);

    const contactValue = document.createElement("span");
    contactValue.className = "contact-value";

    // 값이 객체인 경우와 문자열인 경우를 구분
    if (typeof contact.value === "object") {
      // 영어일 때 약어 사용 및 텍스트 최적화
      let valueText = contact.value[lang];
      if (lang === "eng") {
        valueText = valueText
          .replace("Computer Engineering", "Comp. Eng.")
          .replace("Distributed & Operating Systems", "Dist. & OS")
          .replace("Korean Society For Internet Information", "KSII");
      }
      contactValue.innerHTML = valueText.replace(/\n/g, "<br>");
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
