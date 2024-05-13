2023년 1월 리액트 팀은 create-react-app은 미래에 더 이상 리액트 애플리케이션을 만드는 보일러플레이트 CLI가 아니라
여러 리액트 기반 프레임워크를 제안하는 런처 형태로 변경될 예정이라고 밝혔다 따라서 create-react-app의 대안 (create-next-app과 같은) 
또는 아무것도 없는 상태에서 리액트 프레임워크를 구축하는 방법을 알아야 한다

npm init으로 package.json 생성

Next.js 프로젝트 실행에 필요한 핵심 라이브러리 react, react-dom, next 설치
npm i react react-dom next

devDependencies에 필요한 패키지 설치
(typescript, 리액트 타입 지원에 필요한 @types/react, @types/react-dom, Node.js의 타입을 사용하기 위한 @types/node, ESLint 사용에 필요한
eslint, eslint-config-next)
npm i @types/node @types/react @types/react-dom eslint eslint-config-next typescript --save-dev