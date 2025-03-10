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
  const container = document.querySelector(".row");
  if (!container) return;

  let html = "";
  data.members.forEach((member) => {
    html += `
      <div class="col-md-4">
        <div class="member-card">
          <img src="${member.img}" alt="${member.name[lang]}">
          <div class="member-info">
            <h3>${member.name[lang]}</h3>
            <p>${member.position[lang]}</p>
          </div>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}
