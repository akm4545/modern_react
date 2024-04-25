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

// 전역 스타일
// CSS Reset = 브라우저 기본 제공 스타일 초기화 후 애플리케이션 전체에 공통으로 적용하는 스타일
// next13 이전 기준 _app.tsx에 필요 스타일 import 
// 글로벌 스타일은 다른 페이지, 컴포넌트와 충돌할 수 있으므로 반드시 _app.tsx에서 제한적으로 작성 필요

// 예제
//import type { AppProps } from "next/app";

//적용하고 싶은 글로벌 스타일 
//import '../style.css'

// 혹은 node_modules에서 바로 꺼내올 수도 있다
// import 'normalize.css/normalize.css'

// export default function MyApp({ Component, pageProps }: AppProps){
//   return <Component {...pageProps} />
// }

// 최근의 자바스크립트 내부에 스타일시트를 삽입하는 CSS-in-JS 방식이 유행
// CSS와의 비교시 코드 작성 편의성 외에 성능 이점을 가지고 있는지는 논쟁
// 직관적이고 편리
// 해당 라이브러리로는 styled-jsx, styled-components, Emotion, Linaria등이 있다
// styled-components가 가장 많은 사용자를 보유 중

// 예제
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document'
import {ServerStyleSheet} from 'styled-components'

export default function MyDocument(){
  return (
    <Html lang="ko">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

MyDocument.getInitialProps = async (
  ctx: DocumentContext,
): Promise<DocumentInitialProps> => {
  // styled-components의 스타일을 서버에서 초기화해 사용되는 클래스
  // 서버에서 styled-components가 작동하기 위한 다양한 기능을 가지고 있다
  const sheet = new ServerStyleSheet()
  // 기존의 ctx.renderPage가 하는 작업에 추가적으로 styled-components 관련 작업을 하기 위해 별도 변수로 분리
  const originalRenderPage = ctx.renderPage

  console.log(sheet)

  try{
    ctx.renderPage = () =>
      //  기존에 해야 하는 작업과 함께 enhanceApp (App 렌더링 시 추가 수행 작업) 정의
      originalRenderPage({
        // 추가 작업 내용 
        // sheet.collectStyles는 StyleSheetManager라고 불리는 Context.API로 감싸는 역할
        // 우리가 가지고 있는 기존의 <App/> 위에 styled-components의 Context.API로 한 번 더 감싼 형태
        enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
      })
    
      // 기존의 _document.tex가 렌더링을 수행할 때 필요한 getInitialProps를 생성하는 작업
      const initialProps = await Document.getInitialProps(ctx)

      // 기본적으로 내려주는 props에 추가적으로 styled-components가 모아둔 자바스크립트 파일 내 스타일 반환
      // 이렇게 되면 서버 사이드 렌더링 시에 최초로 _document 렌더링 될 때 styled-components에서 수집한 스타일도 함께 내려줄 수 있다
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      }
  } finally {
    sheet.seal()
  }
}

// 리액트 트리 내부에서 사용하고 있는 styled-components의 스타일 모두 모은 다음 각각의 스타일에 유니크한 클래스명을 부여
// 스타일이 충돌하지 않게 클래스명과 스타일을 정리해 이를 _document.tsx가 서버에서 렌더링할 때 React.Context 형태로 제공
// CSS-in-JS의 스타일을 서버에서 미리 모은 다음 서버 사이드 렌더링에서 한꺼번에 제공해야 올바른 스타일을 적용할 수 있다
// 이런 과정을 거치지 않는다면 스타일이 브라우저에서 뒤늦게 추가되어 FOUC(flash of unstyled content)라는 스타일이 입혀지지 
// 않은 날것의 HTML을 잠시간 사용자에게 노출
// 바벨 대신 swc를 사용한다면 next.config.js에 compiler.styledComponents를 추가하면 된다

// 프로덕션 모드로 빌드 시 SPEEDY_MODE라고 하는 설정을 사용하면
// HTML에 스타일을 적용하는 대신 자바스크립트를 활용해 CSSOM 트리에 직접 스타일을 넣는다
// 기존 스타일링 방식보다 훨씬 빠르다
// 실제 스타일이 어떻게 삽입돼 있는지 확인하고 싶다면 document.styleSheets를 활용하면 된다

// 별도의 바벨 설정 없이 swc와 함께 사용 가능한 CSS-in-JS 라이브러리는 현재 Next.js에서 만든  (Next.js, SWC 조합시 추천)
// styled-jsx, styled-components, Emotion이 있다
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
}

module.exports = nextConfig

// 설정 완료 후 결과물
import styled from 'styled-components'

const ErrorButton = styled.button`
  color: red;
  font-size: 16px;
`

export function Button(){
  return(
    <>
      <ErrorButton type="button">경고</ErrorButton>
    </>
  )
}

// 생략
<style data-styled="" data-styled-version="5.3.5">
  .bXqOdA{
    color: red;
    font-size: 16px;
  } /*!sc*/
  data-styled.g1[id='Button__ErrorButton-sc-8cb2349-0']{
    content: 'bXqOdA,';
  } /*!sc*/
  {/* 생략 */}
  <button type="button" class="Button__ErrorButton-sc-8cb2349-0 bXqOdA">
    경고!
  </button>
</style>



// 사용자가 처음 서비스에 접근 시 처리하고 싶은 무언가를 작성할때 _app.tsx에 작성
import App, {AppContext} from 'next/app'
import type {AppProps} from 'next/app'

function MyApp({Component, pageProps}: AppProps){
  return (
    <>
      <Component {...pageProps} />
    </>
  )
}

// _app.tsx에 getInitialProps를 추가하려면 반드시 
// const appProps = await App.getInitialProps(context)를 실행한 뒤 해당 값을 반환해야 한다
// 이 코드가 없다면 다른 페이지의 getInitialProps가 정상작동하지 않는다
MyApp.getInitialProps = async (context: AppContext) => {
  const appProps = await App.getInitialProps(context)

  return appProps
}

export default MyApp


// 해당 코드를 작성하고 라우팅 반복 (애플리케이션 전체 적용됨)
// 실행 절차
// 1.가장 먼저 자체 페이지에 getInitialProps가 있는 곳을 방문
// 로그: [서버] /test/GIP에서 /test/GIP를 요청
// 2. getServerSideProps가 있는 페이지를 <Link>를 이용해서 방문
// 로그: [서버] /test/GSPP에서 /_next/data/XBY50vq6_LSP5vdU2XD5n/test/GSSP.json를 요청
// 3. 다시 1번의 페이즈를 <Link>를 이용해서 방문
// 로그: [클라이언트] /test/GSPP에서 undefined를 요청
// 4. 다시 2번의 페이지를 <Link>를 이용해서 방문
// 로그: [클라이언트] /test/GSPP에서 /_next/data/XBY50vq6_LSP5vdU2XD5n/test/GSSP.json를 요청

// 페이지 방문 최초 시점 1번은 서버 사이드 렌더링이 전체적으로 작동해야 해서 페이지 전체 요청
// 이후 클라이언트 라우팅을 수행하기 위해 페이지가 getSErverSiceProps와 같은 서버 관련 로직이 있다 하더라도 전체 페이지를 가져오는 것이 아닌
// 해당 페이지 getServerSideProps 결과를 json파일만 요청해서 가져옴
MyApp.getInitialProps = async (context: AppContext) => {
  const appProps = await App.getInitialProps(context)
  const isServer = Boolean(context.ctx.req)

  console.log(
    `[${isServer ? '서버' : '클라이언트'}] ${context.router.pathname}에서 ${context.ctx?.req?.url}를 요청함.`,
  )

  return appProps
}


// 서버 최초 진입시 작업 처리 예제
MyApp.getInitialProps = async (context: AppContext) => {
  const appProps = await App.getInitialProps(context)
  const {
    ctx: { req },
    router: { pathname },
  } = context

  // 클라이언트 사이드 렌더링이 아닐 시 
  // req가 있다면 서버로 오는 요청
  // req.url이 /_next로 시작하지 않는다면 이는 클라이언트 렌더링으로 인해 발생한 getServerSideProps 요청이 아님
  // pathname이 에러 페이지가 아니라면 정상 접근
  // 위 조건을 만족한다면 최초 서버 사이드 렌더링을 어느 정보 보장 가능
  // 여기에서 userAgent 확인이나 사용자 정보와 같은 애플리케이션 전역에서 걸쳐 사용해야 하는 정보 등을 호출하는 작업을 수행할 수 있다
  if(
    req && 
    !req.url?.startsWith('/_next') &&
    !['/500', '/404', '/_error'].includes(pathname)
  ) {
    doSomethingOnlyOnce()
  }

  return appProps
}