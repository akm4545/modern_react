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

import type { NextPage } from "next";
import Link from "next/link";

// next/link = Next.js에서 제공하는 라우팅 컴포넌트 <a />태그와 비슷한 동작을 한다
// <a /> 태그로 이동 시 네트워크에 hello라는 이름의 문서를 요청 
// webpack, framework, main, hello 등 페이지를 만드는데 필요한 리소스를 처음부터 다 가져온다
// hello의 렌더링이 어디서 일어났는지 판단하기 위한 console.log도 서버와 클라이언트에 각각 동시에 기로된다
// 즉 서버에서 렌더링을 수행하고 클라이언트에서 hydrate하는 과정에서 한 번 더 실행

// next/link로 이동시 hello.js만 받아온다
// 즉 hello.js는 hello 페이지를 위한 자바스크립트이고 서버 사이드 렌더링이 아닌 클라이언트에서 필요한 자바스크립트만 불러온 뒤 라우팅하는 
// 클라이언트 라우팅/렌더링 방식으로 작동
// Next.js는 서버 사이드 렌더링의 장점, 즉 사용자가 빠르게 볼 수 있는 최초 페이지를 제공한다는 점과 싱글 페이지 애플리케이션의 장점인 자연스러운
// 라우팅이라는 두 가지 장점을 모두 살리기 위해 이러한 방식으로 작동한다

// 이러한 Next.js의 장점을 적극 살리기 위해서는 내부 페이지 이동 시 다음과 같은 규칙을 지켜야 한다
// <a> 대신 <Link> 사용
// window.loaction.push 대신 router.push를 사용

const Home: NextPage = () => {
  return (
    <ul>
      <li>
        {/* next의 eslint 룰을 잠시 끄기 위해 추가 */}
        {/* eslint-disable-next-line */}
        <a href="/hello">A 태그로 이동</a>
      </li>
      <li>
        {/* 차이를 극적으로 보여주기 위해 해당 페이지의 리소스를 미리 가져오는 prefetch를 잠시 꺼두었다 */}
        <Link prefetch={false} href="/hello">
          next/link로 이동
        </Link>
      </li>
    </ul>
  )
}

export default Home
