# OS LAB 홈페이지 프로젝트 (Version without DB)

![OS LAB 로고](/public/images/Logo.png)

## 📌 프로젝트 개요

OS LAB 홈페이지는 대진대학교 운영체제 연구실을 소개하는 웹사이트입니다. 연구실의 활동, 교수, 연구 프로젝트 및 멤버들에 대한 정보를 제공하며, 한국어와 영어를 지원하는 다국어 인터페이스를 갖추고 있습니다.

## ✨ 주요 기능

- **다국어 지원**: 한국어/영어 전환 기능
- **반응형 디자인**: 데스크탑, 태블릿, 모바일 환경에 최적화된 UI
- **페이지**:
  - 🏠 **메인 화면**: 연구실 소개 및 주요 활동 정보
  - 👨‍🏫 **교수 소개**: 지도교수 프로필 및 업적
  - 🔬 **연구 활동**: 연구실에서 진행하는 프로젝트 소개
  - 👥 **멤버 소개**: 연구실 구성원 정보 및 관심 분야
- **인터랙티브 요소**:
  - 자동 슬라이드 갤러리
  - AOS(Animate On Scroll) 애니메이션
  - 모달 상세 정보

## 🛠 기술 스택

### 프론트엔드

- HTML, CSS, JavaScript
- Bootstrap 5
- Tailwind CSS
- Font Awesome
- AOS (Animate On Scroll)

### 백엔드

- Node.js
- Express
- EJS (템플릿 엔진)
- JSON (데이터 저장)

## 📂 프로젝트 구조

```md
    OS-HomePage/
    ├── app.js                         # 메인 서버 파일
    ├── public/                        # 정적 파일 디렉토리
    │   ├── css/                       # 스타일시트 파일
    │   ├── js/                        # 클라이언트 스크립트
    │   │   ├── cookies.js             # 쿠키 관리 유틸리티
    │   │   ├── language-utils.js      # 다국어 처리 모듈
    │   │   ├── navbar.js              # 내비게이션 기능
    │   │   ├── gallery-slider.js      # 갤러리 슬라이더 기능
    │   │   ├── Members-lang.js        # 멤버 페이지 특화 기능
    │   │   ├── Professer-lang.js      # 교수 페이지 특화 기능
    │   │   └── research-lang.js       # 연구 페이지 특화 기능
    │   ├── images/                    # 이미지 파일
    │   └── json/                      # 데이터 파일
    │       ├── home.json              # 홈페이지 콘텐츠
    │       ├── members.json           # 멤버 정보
    │       ├── professor.json         # 교수 정보
    │       └── research.json          # 연구 프로젝트 정보
    └── views/                         # EJS 템플릿 파일
        ├── pages/                     # 페이지 템플릿
        │   ├── home.ejs
        │   ├── Professor.ejs
        │   ├── Research.ejs
        │   └── Members.ejs
        └── partials/                  # 재사용 컴포넌트
            ├── header.ejs
            └── footer.ejs
```

## 🚀 설치 및 실행 방법

### 필요 사항

- Node.js (v14 이상)
- npm (v6 이상)

### 설치

1. 저장소 클론

   ```bash
   git clone https://github.com/OS-LAB-DaejinUniv/OS-HomePage.git
   cd OS-HomePage
   ```

2. 의존성 설치

   ```bash
   npm install
   ```

3. 서버 실행

   ```bash
   npm start
   ```

4. 브라우저에서 확인

   ```bash
   http://localhost:9000
   ```

## 📱 반응형 디자인

- **데스크탑**: 넓은 화면에 최적화된 레이아웃
- **태블릿**: 미디움 사이즈 화면 (768px ~ 980px)
  - 갤러리: 2개 이미지 슬라이드 표시
- **모바일**: 작은 화면 (767px 이하)
  - 갤러리: 1개 이미지 슬라이드 표시
  - 햄버거 메뉴 네비게이션

## 🌐 언어 처리

- 쿠키 기반 언어 설정 저장
- 페이지별 콘텐츠 번역 자동 적용
- 브라우저 사용자 환경에 맞는 초기 언어 설정

## 📊 주요 컴포넌트

### 메인 페이지

- 슬로건 섹션
- 피처 카드
- 갤러리 슬라이더

### 교수 페이지

- 프로필 카드
- 경력 및 업적 섹션

### 연구 페이지

- 프로젝트 리스트
- 세부 정보 링크

### 멤버 페이지

- 멤버 카드
- 상세 정보 모달

## 🎯 향후 개선 사항

- SEO 최적화
- 성능 개선을 위한 이미지 최적화
- 더 많은 접근성 기능 추가
- 멤버 로그인 기능 구현
- 드라이브 연동 기능

## 👨‍💻 연락처

- **이메일** : admin@os-lab.dev
- **위치** : 대진대학교 이공학관 다동 A9-4131
- **GitHub** : [OS-LAB-DaejinUniv](https://github.com/OS-LAB-DaejinUniv)

<!-- ## 📜 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE)에 따라 라이선스가 부여됩니다.

---

© 2023-2024 OS LAB, Daejin University. All Rights Reserved.

--- -->

윈도우에서 파일 구조를 tree 로 출력하고 싶을때

```Bash
Get-ChildItem -Recurse | Where-Object { $_.FullName -notlike "*\node_modules*" } | ForEach-Object { $_.FullName.Substring($PWD.Path.Length) } | Sort-Object | ForEach-Object { $_ -replace "\\", "/" -replace "/", (" " * ($_.Split("/").Count - 1) + "|--") }
```
