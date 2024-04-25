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