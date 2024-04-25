// Next.js에서는 서버 사이드 렌더링 지원을 위한 몇 가지 데이터 불러오기 전략이 존재
// 이를 Data Fetching이라고 한다
// 이 함수는 pages/의 폴더에 있는 라우팅이 되는 파일에서만 사용 가능
// 예약어로 지정되어 있어 반드시 정해진 함수명으로 export를 사용해 함수를 파일 외부로 내보내야 한다
// 이를 활용하면 서버에서 미리 필요한 페이지를 만들어서 제공하거나 해당 페이지에 요청이 있을 때마다 서버에서 데이터를 
// 조회해서 미리 페이지를 만들어 제공할 수 있다

// getStaticPaths / getStaticProps
// 어떠한 페이지를 CMS(Content Management System)나 블로그, 게시판과 같이 사용자와 관계없이 정적으로 
// 결정된 페이지를 보여주고자 할 때 사용되는 함수
// getStaticProps와 getStaticPaths는 반드시 함께 있어야 사용 가능

// /pages/post/[id] 페이지에서의 예제
import { GetStaticPaths, GetStaticProps } from "next";

// /pages/post/[id]r가 접근 가능한 주소를 정의하는 함수
// paths를 배열로 반환하는데 params를 키로 하는 함수에 적절한 값을 배열로 넘겨주면 해당 페이지에 접근 가능한 페이지 정의 가능
// 이 페이지는 /post/1 과 /post/2만 접근 가능 이외는 404

export const getStaticPaths: GetStaticPaths = async() => {
    return {
        paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
        fallback: false,
    }
}

// 앞에서 정의한 페이지를 기준으로 해당 페이지로 요청이 왔을 때 제공할 props를 반환하는 함수
// 예제는 id가 1,2로 제한돼 있기 때문에 fetchPost(1), fetchPost(2)를 기준으로 각각 함수의 응답 결과를 변수로 가져와 props의 {post}로 반환
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { id } = params

    const post = await fetchPost(id)

    return {
        props: { post },
    }
}

// getStaticProps가 반환한 post를 렌더링하는 역할
export default function Post({ post }: { post: Post }){
    //post로 페이지를 렌더링
}

// getStaticPaths에서 주소 제한 -> getStaticProps는 제한된 주소에 대한 데이터 요청을 props로 반환(모든 경우의 수) -> Post는 이 결과를 바탕으로 렌더링
// 이리하여 빌드 시점에 미리 데이터를 불러온 다음에 정적인 HTML 페이지를 만듦


// getStaticPaths의 fallback 옵션은 미리 빌드해야 할 페이지가 너무 많은 경우 사용 가능
// paths에 미리 빌드해 둘 몇 개의 페이지만 리스트로 반환하고 true나 "blocking"으로 값을 선언할 수 있다
// 이렇게 하면 next build를 실행할 때 미리 반환해둔 paths에 기재돼 있는 페이지만 미리 빌드하고 나머지 페이지는 다음과 같이 작동

// true: 사용자가 미리 빌드하지 않은 페이지에 접근 시 빌드되기 전까지는 fallback 컴포넌트 출력, 빌드 완료 후 해딩 페이지를 보여줌
function Post({ post }: { post: Post }){
    const router = useRouter()

    //아직 빌드되지 않은 페이지에 왔을 경우 사용자에게 노출할
    // 로딩 컴포넌트 정의
    if(router.isFallback){
        return <div>Loading...</div>
    }

    //post 렌더링
}

// "blocking": 별도의 로딩처리를 하지 않고 단순히 빌드가 완료될 때까지 사용자를 기다리게 함


// getServerSideProps
// 앞선 두 함수가 정적인 페이지를 제공하기 위해 사용된다면 getServerSideProps는 서버에서 실행되는 함수이며 해당 함수가 있다면
// 무조건 페이지 진입 전에 이 함수를 실행
// 응답값에 따라 페이지의 루트 컴포넌트에 props를 반환할 수도 혹은 다른 페이지로 리다이렉트시킬 수도 있다
// 이 함수가 있다면 Next.js는 꼭 서버에서 실행해야 하는 페이지로 분류해 빌드 시에도 서버용 자바스크립트 파일을 별도로 만든다

// /pages/post/[id].tsx 예제

// context.query.id를 사용하면 /post/[id] 와 같은 경로에 있는 id값에 접근 가능
// 이 값을 이용해 props를 제공하면 페이지의 Post 컴포넌트에 해당 값을 제공해 이 값을 기준으로 렌더링을 수행할 수 있다
import type { GetServerSideProps } from "next";

export default function Post({ post }: { post: Post }){
    //렌더링
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {
        query: { id = '' },
    } = context
    
    const post = await fetchPost(id.toString())

    returm {
        props: { post },
    }
}

// 해당 페이지의 결과물 예제
// getServerSideProps의 반환 값을 기반으로 렌더링
// Next.js의 서버 사이드 렌더링은 getServerSideProps의 실행과 함께 이뤄진다
// __NEXT_DATA__라는 id가 지정된 script가 있는데 Next.js 구동에 필요한 다양한 정보가 담겨 있다
// 리액트 서버 사이드 렌더링 순서
// 1.서버에서 fetch 등으로 렌더링에 필요한 정보 가져오기
// 2.1의 정보를 기반으로 HTML 작성
// 3.2의 정보를 클라이언트에 제공
// 4.3의 정보를 바탕으로 클라이언트에서 hydrate 작업 
// 5.4번 hydrate로 만든 리액트 컴포넌트 트리와 서버에서 만든 HTML이 다르면 불일치 에러
// 6.5번 비교 작업도 1번과 마찬가지로 fetch 등을 이용해 정보를 가져온다

// 1~6번 작업 사이에 fetch 시점에 따라 결과물의 불일치가 발생할 수 있으므로 1번의 결과물인 HTML에 script 형태로 내려준다
// 이 작업으로 인해 1번 작업을 6번에서 반복하지 않고 시점 차이로 인한 결과물의 차이도 막을 수 있다
// Next.js는 이 정보를 window 객체에도 저장 (window.__NEXT_DATA__)
<!DOCTYPE html>
<html>
    {/* 생략 */}
    <body>
        <div id="__next" data-reactroot="">
            <h1>안녕하세요</h1>
            <p>반갑습니다.</p>
        </div>
        {/* 생략 */}
        <script id="__NEXT_DATA__" type="application/json">
            {
                "props": {
                    "pageProps": {
                        "post": { "title": "안녕하세요", "contents": "반갑습니다." }
                    },
                    "__N_SSP": true
                },
                "page": "/post/[id]",
                "query": { "id": "1" },
                "buildId": "development",
                "isFallback": false,
                "gssp": true,
                "scriptLoader": []
            }
        </script>
    </body>
</html>

// 일반적인 리액트의 JSX와는 다르게 getServerSideProps의 props로 내려줄 수 있는 값은 JSON으로 제공할 수 있는 값으로 제한
// JSON 직렬화가 불가능한 값 (class, Date 등) props로 제공 불가
// 값에 대한 가공이 필요하다면 실제 페이지나 컴포넌트에서 하는 것이 옳다

// getServerSideProps는 서버에서만 실행되기 때문에 제약사항이 존재한다
// 1. window, document같이 브라우저에서만 접근 가능한 객체는 접근할 수 없다
// 2. API 호출 시 /api/some/path와 같이 protocol과 domain 없이 fetch 요청을 할 수 없다 브라우저와 다르게 서버는 자신의 호스트를 유추할 수 없기 떄문
// 3. 에러 발생 시 500.tsx와 같이 미리 정의된 에러 페이지로 리다이렉트

// DOM에 추가하는 이벤트 핸들러 함수와 useEffect와 같이 몇 가지 경우를 제외하고는 서버에서 실행될 수 있다는 사실을 기억해야 한다
// 클라이언트에서만 실행 가능한 변수, 함수, 라이브러리 등은 서버에서 실행되지 않도록 별도로 처리해야 한다
// 이 함수가 실행이 끝나기 전까지는 사용자에게 어떠한 HTML도 보여줄 수 없으므로 최대한 간결하게 작성해야 하고 꼭 최초에 보여줘야 하는 데이터가
// 아니라면 getServerSideProps보다 클라이언트에서 호출하는 것이 더 유리하다

// getServerSideProps에서 조건에 따라 다른 페이지로 보내는 예제
// post 조회 실패 시 404 페이지 리다이렉트는 클라이언트보다 서버에서 처리하는 것이 훨씬 더 자연스럽다
// 클라이언트에서는 아무리 리다이렉트를 초기화해도 자바스크립트가 어느 정도 로딩된 이후에 실행할 수밖에 없다
export const getServerSideProps: GetServerSideProps = async (context) => {
    const {
        query: { id = '' },
    } = context
    const post = await fetchPost(id.toString())

    if(!post){
        redirect: {
            destination: '/404'
        }
    }

    return {
        props: { post },
    }
}