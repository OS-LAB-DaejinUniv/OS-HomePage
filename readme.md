윈도우에서 파일 구조를 tree 로 출력하고 싶을때

```Bash
Get-ChildItem -Recurse | Where-Object { $_.FullName -notlike "*\node_modules*" } | ForEach-Object { $_.FullName.Substring($PWD.Path.Length) } | Sort-Object | ForEach-Object { $_ -replace "\\", "/" -replace "/", (" " * ($_.Split("/").Count - 1) + "|--") }
```

를 치면 됨됨

// 수정 해야할거.
연구 활동에 "자세히 보기" 버튼이랑 OS LAB 카드 사진 다시 찍기

컨테이너 높이: 625px
레이아웃 방식: Flexbox (4개 이미지 한 줄에 모두 표시)
이미지 크기:
너비: flex: 1 (기본 상태에서 균등 분배)
높이: 625px (컨테이너 높이의 100%)
호버 효과:
호버한 이미지: flex: 1.25로 확장
다른 이미지: flex: 0.92로 약간 축소
이미지 비율: object-fit: cover (원본 비율 유지하며 컨테이너 채움) 2. 태블릿 버전 (768px ~ 980px)
갤러리 특성:

컨테이너 높이: 550px
레이아웃 방식: 슬라이더 (2개 이미지씩 표시)
이미지 크기:
너비: 50% (화면의 절반)
높이: 550px에서 패딩(8px)을 제외한 값
슬라이드 패딩: 8px (이미지 간 간격 제어)
이미지 비율: object-fit: cover 3. 모바일 버전 (767px 이하)
일반 모바일:

컨테이너 높이: 450px
레이아웃 방식: 슬라이더 (1개 이미지씩 표시)
이미지 크기:
너비: 100% (전체 화면)
높이: 450px에서 패딩을 제외한 값
슬라이드 패딩: 15px 25px (좌우 여백 더 넓게)
이미지 비율: object-fit: cover
작은 모바일 (575px 이하):

컨테이너 높이: 350px
슬라이드 패딩: 10px 20px (작은 화면에 맞게 약간 축소)
