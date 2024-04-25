// getStaticProps나 getServerSideProps가 나오기 전에 사용할 수 있었던 유일한 페이지 데이터 불러오기 수단
// 대부분의 경우에 위 두가지 함수를 사용하는것을 추천
// 과거 작성된 Next.js 코드에는 getInitialProps만 존재하고 _app.tsx와 같이 일부 페이지에서는 getInitialProps밖에 사용 불가하므로 반드시 알고 
// 있어야 한다

// 예제 
import Link from "next/link";

interface Todo {
    title: string
}

export default function Todo({ todo } : { todo: Todo }){
    return (
        <>
            <h1>{todo.title}</h1>
            <ul>
                <li>
                    <Link href="/todo/1">1번</Link>
                </li>
                <li>
                    <Link href="/todo/2">2번</Link>
                </li>
                <li>
                    <Link href="/todo/3">3번</Link>
                </li>
            </ul>
        </>
    )
}

// 페이지의 루트 함수에 정적 메서드로 추가하고 props 객체를 반환하는 것이 아니라 바로 객체를 반환
// 최초 진입시 서버에서 그 이후 클라이언트에서 라우팅을 수행했다면 클라이언트에서 실행 
// context 포함 값
// pathname: 현재 경로명 (페이지상 경로)
// asPath: 브라우저에 표시되는 실제 경로
// query: URL에 존재하는 쿼리 pathname에 있는 [id] 값도 포함
// 만약 /todo/2?foo=bar&id=3처럼 쿼리 문자열 추가 시 {foo: 'bar', id: '2'} 객체 반환 [id]는 페이지의 query를 우선하므로 다른값으로 변경해야함
// req: Node.js에서 제공하는 HTTP request 객체 (http.IncomingMessage)
// res: Node.js에서 제공하는 HTTP response 객체 (http.ServerResponse)
// getInitialProps은 _app.tsx나 _error.tsx와 같이 Next.js의 특성상 사용이 제한돼 있는 곳에서만 사용하는 것이 좋다
Todo.getInitialProps = async(ctx) => {
    const isServer = ctx.req
    console.log(`${isServer ? '서버' : '클라이언트'}에서 실행됐습니다.`)

    const {
        query: { id = '' }
    } = ctx

    const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${id},`
    )

    const result = await response.json()
    console.log('fetch Complete!')
    return { todo: result}
}

// 클래스 컴포넌트로 작성하면 다음과 같이 쓸 수 있다
// export default class Todo extends React.Component{
//     static async getInitialProps(){
//         const {
//             query: { id = '' },
//         } = ctx

//         const response = await fetch(
//             `https://jsonplaceholder.typicode.com/todos/${id},`
//         )

//         const result = await response.json()
//         console.log('fetch Compolete!')

//         return { todo: result }
//     }

//     render() {
//         // ...
//     }
// }