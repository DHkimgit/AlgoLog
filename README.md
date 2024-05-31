# 👉 프로젝트 소개
**내가 푼 알고리즘 문제 한번에 보기**
* 사용자가 백준이나 프로그래머스에서 푼 알고리즘 문제들을 한번에 확인하고 편리하게 복습 할 수 있는 웹사이트 구현을 목표로 하고 있습니다.
* 클라이언트(프론트) - 서버 - 데이터베이스(비정형 DB) 의 각각의 동작 구조와 패턴, 상호 통신 원리를 공부하기 위한 프로젝트입니다.
* 단순한 CRUD 외에 다른 로직 처리를 경험해 보고 싶어서 크롤링 기능을 사용하는 도메인을 구상했습니다.
## 🤹‍♀️ 기술 스택  
![stack](https://github.com/DHkimgit/AlgoLog/assets/96455522/d2d27c5e-0693-46ef-978b-988df0e53301)
* **프론트 엔드**: 리엑트, 리코일(전역상태 관리), styled-component(css), Ant Design(css)
* **벡엔드**: Fastapi, pydantic(data schema), motor(mongodb Asynchronous Driver for python), beautifulsoup(크롤링)
* **데이터베이스**: MongoDB
* **개발환경**: Win 11 & wsl2(Ubuntu 22.04.3) & Docker Descktop(프론트엔드, 백엔드, DB 독립적인 컨테이너로 구성함) & vscode 
