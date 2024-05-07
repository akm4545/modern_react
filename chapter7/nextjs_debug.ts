{
    // 서버 사이드 렌더링 시 메모리 누수가 발생하면 서버 자체에 부담이 발생하고
    // 곧 모든 사용자가 서비스를 사용할 수 없는 심각한 상황을 초래하게 될 것이다
}

{
    // Next.js 프로젝트를 디버그 모드로 실행

    // 다음과 같은 방법으로 Next.js 프로젝트 실행
    "dev": NODE_OPTIONS='--inspect' next dev

    // 웹소켓 주소가 나타나면 디버거에 연결될 준비가 된것이다
    // 크롬 부라우저에서 chrome://inspect로 이동
    // Open dedicated DevTools for Node 클릭
}

{
    // Next.js 서버에 트래픽 유입시키기
    // 서버 사이드 렌더링과 같이 서버에서 제공되는 서비스는 서버를 실행한 뒤 
    // 사용자가 서서히 유입되면서 메모리 누수가 발생하는 경우가 많다
    // 따라서 서버에 직접 트래픽을 발생시켜서 확인하는 편이 제일 확실한 방법이다

    // 오픈소스 도구 ab
    // 아파치 재단에서 제공하는 웹서버 성능 검사 도구 
    // HTTP 서버의 성능을 벤치마킹할 수 있는 도구
    
    // 터미널 입력
    // ab -k -c 50 -n 10000 "http://127.0.0.1:3000"/
    // http://127.0.0.1:3000을 향해 한 번에 50개의 요청을 총 10000회 시도   
}

{
    // Next.ks의 메모리 누수 지점 확인

    // 예제 코드
    // getServerSideProps가 실행될 때마다 전역 변수로 선언된 access_users에 끊임없이 push 수행
    // 해당 페이지 사용자가 방문할 때마다 메모리 사용이 점차 증가
    import type { GetServerSidePropsContext, NextPage } from 'next'

    const access_users = []

    function Home({ currentDateTime }: { currentDateTime: number }){
        return <>{currentDateTime}</>
    }

    export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
        const currentDateTime = new Date().getTime()

        access_users.push({
            user: `user-${Math.round(Math.random() * 100000)}`,
            currentDateTime
        })

        return {
            props: {
                currentDateTime
            },
        }
    }

    export default Home

    // 페이지를 방문하여 메모리 탭에서 메모리 도구로 프로파일링 하면 getServerSideProps의 다수 실행과 메모리 누수를 확인할 수 있다
    // getSErverSideProps는 페이지 접근 요청이 있을 때마다 실행되는 함수이므로 최대한 부수효과가 없는 순수 함수로 만들어야 한다
}