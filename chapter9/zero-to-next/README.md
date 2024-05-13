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

타입스크립트 설정을 위한 tsconfig.json 작성
tsconfig.json 파일을 생성하고 최상단에 해당 문구 작성

schemaStore에서 제공해 주는 정보 
해당 JSON 파일이 무엇을 의미하는지 또 어떤 키와 어떤 값이 들어갈 수 있는지 알려주는 도구 
자동 완성이 가능해진다
{
    "$schema": "https://json.schemastore.org/tsconfig.json"
}

이 밖에도 .eslintrc, .prettierrc와 같이 JSON 방식을 ㅗ설정을 작성하는 라이브러리가 schemastore에 해당 내용을 제공하고 있다면 더욱 편리하게 JSON 설정을 작성할 수 있다