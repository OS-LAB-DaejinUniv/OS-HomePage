const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// EJS 설정
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 기본 라우트
app.get("/", (req, res) => {
  let lang = req.cookies.language || "kor";
  res.render("pages/home", { lang });
});

// 기본 라우트
app.get("/Professor", (req, res) => {
  let lang = req.cookies.language || "kor";
  res.render("pages/Professor", { lang });
});

app.get("/Research", (req, res) => {
  let lang = req.cookies.language || "kor";
  res.render("pages/Research", { lang });
});

app.get("/Members", (req, res) => {
  let lang = req.cookies.language || "kor";
  res.render("pages/Members", { lang });
});

// 언어 변경 라우트
app.get("/setLanguage/:lang", (req, res) => {
  const { lang } = req.params;
  res.cookie("language", lang, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  res.redirect("back");
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
