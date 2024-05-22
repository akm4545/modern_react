// nextjs 13 기준 
{
    // 공통 헤더와 공통 사이드 바가 거의 대분의 페이지 필요한 웹사이트를 개발한다고 가정 시
    // react-router-dom을 사용한 코드 예제
    import { Routes, Route, Outlet, Link } from 'react-router-dom'

    export default function App() {
        return (
            <div>
                <div>Routes 외부의 공통 영역</div>

                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="/menu1" element={<Menu1 />} />
                        <Route path="/menu2" element={<Menu2 />} />
                        <Route path="*" element={<NoMatch />} />
                    </Route>
                </Routes?
            </div>
        )
    }

    function Layout() {
        return (
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/menu1">menu1</Link>
                        </li>
                        <li>
                            <Link to="/menu2">menu2</Link>
                        </li>
                    </ul>
                </nav>

                <hr />
                <div>/ path 하위의 공통 영역</div>

                <Outlet />
            </div>
        )
    }

    function Home() {
        return (
            <div>
                <h2>Home</h2>
            </div>
        )
    }

    function Menu1() {
        return (
            <div>
                <h2>Menu1</h2>
            </div>
        )
    }

    function Menu2() {
        return (
            <div>
                <h2>Menu2</h2>
            </div>
        )
    }

    function NoMatch(){
        return (
            <div>
                <h2>Nothing to see here!</h2>
                <p>
                    <Link to="/">Go to the home page</Link>
                </p>
            </div>
        )
    }

    // <Routes>의 영역은 주소에 따라 바뀌는 영역으로 각 주소에 맞는 컴포넌트를 선언해서 넣어주면 된다
    // <Routes>의 외부 영역은 주소가 바뀌더라도 공통 영역으로 남을 것이며 <Routes>내부만 주소에 맞게 변경될 것이다
    // 또한 <Routes> 내부의 <Outlet />은 <Routes>의 주소 체계 내부의 따른 하위 주소를 렌더링하는 공통 영역이다
    // 사용하기에 따라서 <Routes>의 외부 영역 같이 해당 주소의 또 다른 영역을 공통으로 꾸미는 등의 작업이 가능하다
}

{
    // Nextjs 13 버전 이전까지는 모든 페이지는 각각의 물리적으로 구별된 파일로 독립돼 있었다 
    // 페이지의 공통으로 무언가를 집어 넣을 수 있는 곳은 _document와 _app이 유일하다
    // 그나마도 이 파일들은 다음과 같이 서로 다른 목적을 지니고 있다

    // _document: 페이지에서 쓰이는 <html>과 <body> 태그를 수정하거나 서버 사이드 렌더링 시 styled-components같은 일부 CSS-in-JS를 지원하기 위한 
    // 코드를 삽입하는 제한적인 용도로 사용
    // 오직 서버에서만 작동하므로 onClick 같은 이벤트 핸들러를 붙이거나 클라이언트 로직을 붙이는 것을 금지

    // _app: _app은 페이지를 초기화기 위한 용도로 사용 다음과 같은 작업이 가능하다고 명시돼 있다
    // 페이지 변경 시에 유지하고 싶은 레이아웃
    // 페이지 변경 시 상태 유지
    // componentDidCatch를 활용한 에러 핸들링
    // 페이지간 추가적인 데이터 삽입
    // global CSS 주입

    // NextJS 12 버전까지는 공통 레이아웃을 유지할 방법이 _app이 유일했다
    // 그러나 이 방식은 _app에서밖에 할 수 없어 제한적이고 각 페이지별로 서로 다른 레이아웃을 유지할 수 있는 여지도 부족하다
    // 이러한 레이아웃의 한계를 극복하기 위해 나온 것이 NextJS의 app 레이아웃이다

    // Next.js 13.4.0 버전 미만 
    // app 라우팅은 베타 버전이기 때문에 정상적인 방법으로는 사용할 수 없다 next.config.js에 다음과 같이 옵션을 활성화해야 /app 기반 라우팅을 사용할 수 있다
    /** @type {import('next').NextConfig} */
    const nextConfig = {
        reactStrictMode: true,
        experimental: {
            appDir: true, //이 옵션을 experimental 아래에서 활성화해야 한다
        }
    }
}

{
    // 라우팅
    // 기존의 /pages로 정의하던 하우팅 방식이 /app 디렉터리로 이동했다
    // 그리고 파일명으로 라우팅이 불가능해졌다

    // 라우팅 정의하는 법
    // Next.js의 라우팅은 파일 시스템을 기반으로 하고 있다
    // app 기반 라우팅 시스템은 기존에 /pages를 사용했던 것과 비슷하지만 차이가 있다

    // Next.js 12 이하: /pages/a/b.tsx 또는 /pages/a/b/index.tsx는 모두 동일한 주소로 변환 즉 파일명이 index라면 이 내용은 무시

    // Next.js 13 app: /app/a/b는 /a/b로 변환되며 파일명은 무시 폴더명까지만 주소로 변환
    // app 내부에서 가질 수 있는 파일명은 예약어로 제한
}

{
    // layout.js
    // Next.js 13부터는 app 디렉터리 내부의 폴더명이 라우팅이 되며 이 폴더에 포함될 수 있는 파일명은 몇 가지로 제한돼 있다
    // 그 중 하나가 layout.js다 이 파일은 페이지의 기본적인 레이앙ㅅ을 구성하는 요소다 
    // 해당 폴더에 layout이 있다면 그 하위 폴더 및 주소에 모두 영향을 미친다

    // app/layout.tsx
    import { ReactNode } from 'react'

    export default function AppLayout({ children }: { children: ReactNode }){
        return (
            <html lang="ko">
                <head>
                    <title>안녕하세요!</title>
                </head>
                <body>
                    <h1>웹페이지에 오신 것을 환영합니다.</h1>
                    <main>{children}</main>
                </body>
            </html>
        )
    }

    // app/blog/layout.tsx
    import { ReactNode } from 'react'

    export default function BlogLayout({ children }: { children: ReactNode }){
        return <section>{children}</section>
    }

    // 루트에는 단 하나의 layout을 만들어 둘 수 있다 
    // 이 layout은 모든 페이지에 영향을 미치는 공통 레이아웃이다
    // 일반적으로 웹 페이지를 만드는 데 필요한 공통적인 내용 (html, head 등)을 다루는 곳으로 보면 된다
    // 이는 이전 버전부터 많은 개발자들을 헷갈리게 만들었다 _app, _document를 하나로 대체할 수 있다
    // 꼭 공통 레이아웃이 필요하진 않더라고 웹페이지에 필요한 기본 정보만 담아둬도 충분히 유용하다

    // 페이지 하위에 추가되는 layout은 해당 주소 하위에만 적용 
    // 앞의 레이아웃을 활용하면 나오는 html
    <html lang="ko">
        <body>
            <h1>웹페이지에 오신 것을 환영합니다.</h1>
            <main><section>여기에 블로그 글</section></main>
        </body>
    </html>

    // 주소별 공통 UI뿐만 아니라 _app과 _document를 대신해 웹페이지를 시작하는 데 필요한 공통 코드를 삽입할 수도 있다 그리고 이 공통 코드는
    // 기존의 _app과 _document처럼 모든 애플리케이션에 영향을 미치지 않고 오로지 자신과 자식 라우팅에만 미치게 된다
    // 이로써 개발자들은 하나의 애플리케이션에서 레이아웃을 더욱 유연하게 구성할 수 있게 됐다

    // layout.js의 또 다른 장점은 _document.jsx에서만 처리할 수 있었던 부자연스러움이 사라졌다는 것이다
    // 기존 애플리케이션의 <html/>나 <body/>에 무언가 스타일을 추가하는 등의 작업을 하려면 _document.jsx를 사용해야 했을뿐만 아니라
    // <Html/> 이나 <Body/><Head/> 처럼 Next.js에서 제공하는 태그를 사용해야 했다
    // 그러나 이제 HTML에서 기본으로 제공하는 <html/>등의 태그를 추가하고 수정함으로써 별도로 import하는 번거로움이 사라지고 좀 더 자연스럽게 코드를 작성할 수 있게 됐다

    // layout 주의점
    // layout은 app 디렉토리 내부에서는 예약어다 무조건 layout.{js|jsx|ts|tsx}로 사용해야 하며 레이아웃 이외의 다른 목적으로는 사용할 수 없다
    // layout은 children을 props로 받아서 렌더링해야 한다 레이아웃이므로 당연히 그려야 할 컴포넌트를 외부에서 주입받고 그려야 한다
    // layout 내부에는 반드시 export default로 내보내는 컴포넌트가 있어야 한다
    // layout 내부에서도 API 요청과 같은 비동기 작업을 수행할 수 있다
}

{
    // 과거 _document에서 CSS-in-JS의 스타일을 모두 모은다음 서버 사이드 렌더링 시에 이를 함께 렌더링하는 방식으로 적용했는데 
    // _document가 사라짐으로써 이제 그러한 방식을 적용하는 것은 불가능하다 대신 이 작업 또한 마찬가지로 루트의 레이아웃에서 적용하는 방식으로 바뀌었다

    // lib/StyledComponentsRegistry.tsx
    // 클라이언트 컴포넌트를 의미하는 지시자
    // 리액트 18에서 새롭게 등장
    'use client'

    import { ReactNode, useState } from 'react'
    import { useServerInsertedHTML } from 'next/navigation'
    import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

    export default function StyledComponentsRegistry({
        children,
    }: {
        children: ReactNode
    }){
        const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

        // 과거 useFlushEffects라는 이름의 훅이였는데 명확한 이름으로 변경
        // useInsertionEffect를 기반으로 하는 훅으로 CSS-in-JS 라비르러리와 같이 서버에서 추가해야 할 HTML을 넣는 용도로 만듦
        useServerInsertedHTML(() => {
            const styles = styledComponentsStyleSheet.getStyleElement()

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            styledComponentsStyleSheet.instance.clearTag()

            return <>{styles}</>
        })

        if(typeof window !== 'undefined'){
            return <>{children}</>
        }

        return (
            <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
                <>{children}</>
            </StyleSheetManager>
        )
    }

    // app/layout.tsx
    import StyledComponentsRegistry from './lib/StyledComponentsRegistry'

    export default function RootLayout({
        children
    }: {
        children: React.ReactNode
    }) {
        return (
            <html>
                <body>
                    <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
                </body>
            </html>
        )
    }
}

{
    // page.js
    // page도 예약어이다 
    // Next.js에서 일반적으로 다뤘던 페이지를 의미한다

    // page가 받는 props
    // params: 옵셔널 값으로 [...id]와 같은 동적 라우트 파리미터를 사용할 경우 해당 파리미터 값이 들어온다

    // searchParams: URL에서 ?a=1과 같은 URLSearchParams를 의미한다 ?a=1&b=2로 접근할 경우 
    // searchParams에는 { a: '1', b: '2' }라는 자바스크립트 객체 값이 오게 된다 이 값은 layout에서는 제공되지 않는다
    // 그 이유는 layout은 페이지 탐색 중에는 리렌더링을 수행하지 않기 때문이다
    // 즉 같은 페이지에서 search parameter만 다르게 라우팅을 시도하는 경우 layout을 리렌더링하는 것은 불필요하기 때문
    // 만약 search parameter에 의존적인 작업을 해야 한다면 반드시 page 내부에서 수행

    // page의 규칙
    // page도 app 디렉터리 내부의 예약어 무조건 page.{js|jsx|ts|tsx}로 사용해야 하며 레이아웃 이외의 다른 목적으로는 사용할 수 없다
    // page도 내부에 반드시 export default로 내보내는 컴포넌트가 있어야 한다
}

{
    // error.js
    // error.js는 해당 라우팅 영역에서 사용되는 공통 에러 컴포넌트
    // error.js를 사용하면 특정 라우팅 별로 서로 다른 에러 UI를 렌더링하는 것이 가능

    'use client'

    import { useEffect } from 'react'

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    export default function Error({
        error,
        reset,
    }: {
        error: Error
        reset: () => void
    }) {
        useEffect(() => {
            // eslint-disable-next-line no-console
            console.log('logging error:', error)
        }, [error])

        return (
            <>
                <div>
                    <strong>Error:</string> {error?.message}
                </div>
                <div>
                    <button onClick={() => reset()}>에러 리셋</button>
                </div>
            </>
        )
    }

    // error 페이지는 에러 정보를 담고 있는 error:Error 객체와 에러 바운더리를 초기화할 reset: () => void를 props로 받는다 
    // 에러 바운더리는 클라이언트에서만 작동하므로 error 컴포넌트도 클라이언트 컴포넌트여야 한다
    // error 컴포넌트는 같은 수준의 layout에서 에러가 발생할 경우 해당 error 컴포넌트로 이동하지 않는다
    // Layout 에러를 처리하고 싶다면 상위 컴포넌트의 error을 사용하거나 app의 루트 에러 처리를 담당하는 app/global-error.js 페이지를 생성
}

{
    
}