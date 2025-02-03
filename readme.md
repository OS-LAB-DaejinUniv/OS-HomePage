윈도우에서 파일 구조를 tree 로 출력하고 싶을때

```Bash
Get-ChildItem -Recurse | Where-Object { $_.FullName -notlike "*\node_modules*" } | ForEach-Object { $_.FullName.Substring($PWD.Path.Length) } | Sort-Object | ForEach-Object { $_ -replace "\\", "/" -replace "/", (" " * ($_.Split("/").Count - 1) + "|--") }
```

를 치면 됨됨

// 수정 해야할거.
연구 활동에 "자세히 보기" 버튼이랑 OS LAB 카드 사진 다시 찍기
