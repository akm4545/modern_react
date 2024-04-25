import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Next.js 13버전으로 변경됨으로 인해 
// _app.tsx, _document.tsx 파일의 역할을 layout.tsx 파일로 넘김

// _app.tsx 
// _app.tsx, 그리고 내부에 있는 default export로 내보낸 함수는 애플리케이션의 전체 페이지의 시작점
// 페이지의 시작점이라는 특징 때문에 웹 애플리케이션에서 공통으로 설정해야 하는 것들을 여기에서 실행 가능
// Next.js를 초기화하는 파일, Next.js 설정과 관련된 코드를 모아두는 곳
// 경우에 따라 서버, 클라이언트 모두에서 렌더링 가능
// _app.tsx에서 할 수 있는 내용
// 1. 에러 바운더리를 사용해 애플리케이션 전역에서 발생하는 에러 처리
// 2. reset.css 같은 전역 css 선언
// 3. 모든 페이지에 공통으로 사용 또는 제공해야 하는 데이터 제공

// _document.tsx
// 없어도 실행하는데 지장이 없는 파일
// 애플리케이션의 HTML을 초기화 하는 곳
// CSS-in-JS의 스타일을 서버에서 모아 HTML로 제공 가능하다
// _app.tsx와 차이점
// 1.<html>이나 <body>에 DOM 속성을 추가하고 싶다면 _document.tsx를 사용
// 2. _app.tsx는 렌더링이나 라우팅에 따라 서버나 클라이언트에서 실행될 수 있지만 _document는 무조건 서버에서 실행
// 따라서 이벤트 핸들러 추가가 불가능하다 이벤트 핸들러 추가는 클라이언트에서 실행되는 hydrate의 몫이기 때문
// 3. Next.js에는 두 가지 <head>가 존재 하나는 next/document에서 제공하는 head이고 다른 하나는 next/head에서 기본적으로 제공하는
// head가 있다 
// 브라우저의 <head />와 동일하지만 next/document는 오직 _document.tsx에서만 사용 가능 
// next/head는 페이지에서 사용할 수 있으며 SEO에 필요한 정보나 title 등을 담을 수 있다
// next/document의 <Head /> 내부에는 <title />을 사용할 수 없다 
// 웹 애플리케이션에 공통적인 제목이 필요하면 _app.tsx에, 페이지별 제목이 필요하면 페이지 파일 내부에서 후자를 사용하면 된다
// 4. getServerSideProps, getStaticProps등 서버에서 사용 가능한 데이터 불러오기 함수는 여기에서 사용할 수 없다

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

// _document.tsx 예제
// import {Html, Head, Main, NextScript} from 'next/document'

// export default function Document(){ -> RootLayout으로 대체된듯 함
//   return(
//     <Html lang="ko">
//       <Head />
//       <body className="body">
//         <Main />
//         <NextScript />
//       </body>
//     </Html>
//   )
// } 

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head />
      <body className={inter.className}>{children}</body>
    </html>
  );
}