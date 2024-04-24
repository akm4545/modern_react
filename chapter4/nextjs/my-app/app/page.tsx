// _app.tsx, _error.tsx, _document.tsx, 404.tsx, 500.tsx가 Next.js에서 제공하는 예약어로 관리되는 페이지
// react-pages에 영감을 받아 만들어져 라우팅이 파일명으로 이어지는 구조가 Next.js에서 현재까지 이어지고 있다
// /pages(next13 -> /app) 디렉터리를 기초로 구성되며 각 페이지에 있는 default export로 내보낸 함수가 해당 페이지의 루트 컴포넌트가 된다

// 예제 프로젝트의 구성 정리
// /pages/index.tsx: 웹사이트 루트 localhost:3000

// /pages/hello.tsx: /pages가 생략 파일명이 주소가 된다 localhost:3000/hello

// /pages/hello/world.tsx: 디렉터리 깊이만큼 주소 설정 localhost:3000/hello/world
// 주의점은 hello/index.tsx와 hello.tsx 모두 같은 주소를 바라본다 

// /pages/hello/[greeting].tsx: []의 의미는 여기에 어떠한 문자도 올 수 있다는 뜻
// 서버 사이드에서 greeting 이라는 변수에 사용자가 접속한 주소가 오게 된다
// localhost:3000/hello/1, localhost:3000/hello/greeting 모두 유효 /pages/hello/[greeting].tsx로 오게 된다
// greeting 변수에는 각각 1, greeting이라는 값이 들어온다
// 만약 /pages/hello/world.tsx와 같이 이미 정의된 주소가 있다면 정의된 주소가 우선한다

// /pages/hi/[...props].tsx: 전개연산자와 동일 /hi 하위의 모든 주소가 여기로 온다
// localhost:3000/hi/hello, localhost:3000/hi/hello/world, localhost:3000/hi/hello/world/foo 등이 여기로 온다
// [...props] 값은 props라는 변수에 배열로 온다
