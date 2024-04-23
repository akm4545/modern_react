{
    // 리액트 애플리케이션을 서버에서 렌더링 할 수 있는 API도 제공
    // Node.js와 같은 서버 환경에서만 실행 가능 
    // 리액트 저장소의 react-dom/server.js에 있다
    // 리액트 18이 릴리스되면서 react-dom/server에 renderToPipeableStream이 추가됐고 나머지는 대부분 지원이 중단되었다
}

{
    // renderToString
    // 인수로 넘겨받은 리액트 컴포넌트를 렌더링해 HTML 문자열로 반환하는 함수
    // 서버 사이드 렌더링 구현시 가장 기초적인 API
    // 최초의 페이지를 HTML로 먼저 렌더링하는 역할

    // 예제
    // SampleComponent와 ChildrenComponent는 일반적인 리액트 컴포넌트
    // ReactDOMServer.renderToString 으로 부모 컴포넌트인 SampleComponent 렌더링
    // 이 렌더링은 루트 컴포넌트인 <div id='root' />에서 수행
    import ReactDOMServer from 'react-dom/server'

    function ChildrenComponent({fruits}: {fruits: Array<string>}){
        useEffect(() => {
            console.log(fruits)
        }, [fruits])

        function handleClick(){
            console.log('hello')
        }

        return (
            <ul>
                {fruits.map((fruit) => (
                    <li key={fruit} onClick={handleClick}>
                        {fruit}
                    </li>
                ))}
            </ul>
        )
    }

    function SampleComponent(){
        return (
            <>
                <div>hello</div>
                <ChildrenComponent fruits={['apple', 'banana', 'peach']} />
            </>
        )
    }

    const result = ReactDOMServer.renderToString(
        React.createElement('div', {id: 'root'}, <SampleComponent />)
    )

    // 위 result 는 다음과 같은 문자열 반환
    <div id="root" data-reactroot="">
        <div>hello</div>
        <ul>
            <li>apple</li>
            <li>banana</li>
            <li>peach</li>
        </ul>
    </div>

    // 렌더링 결과 useEffect와 같은 훅과 handleClick과 같은 이벤트 핸들러는 결과물에 포함되지 않는다
    // 이것은 의도된 것으로 renderToString은 인수로 주어진 리액트 컴포넌트를 기준으로 빠르게 브라우저가 렌더링 할 수 있는 
    // HTML을 제공하는데 목적이 있는 함수이다
    // 필요한 자바스크립트 코드는 여기 생성된 HTML과는 별도로 제공해 브라우저에 제공돼야 한다
    // 그러므로 실제 웹페이지가 사용자와 인터렉션할 준비가 되기 위해서는 이와 관련된 별도의 자바스크립트 코드를 모두 다운로드, 파싱, 실행 과정을 거쳐야 한다
    // div#root에 존재하는 속성인 data-reactroot가 있는데 이는 리액트 컴포넌트의 루트 엘리먼트가 무엇인지 식별하는 역할이다
    // 해당 속성은 이후 자바스크립트를 실행하기 위한 hydrate 함수에서 루트를 식별하는 기준이 된다
}

{
    // renderToStaticMarkup
    // renderToString과 매우 유사하지만 루트 요소에 추가한 data-reactroot와 같은 리액트에서만 사용하는 추가적인 DOM 속성을 만들지 않는다
    // 해당 성격으로 인해 HTML의 크기를 아주 약간이라도 줄일 수 있다는 장점이 있다

    // 예제
    // ... 이하 생략
    const result = ReactDOMServer.renderToStaticMarkup(
        React.createElement('div', {id: 'root'}, <SampleComponent />)
    )

    <div id="root">
        <div>hello</div>
        <ul>
            <li>apple</li>
            <li>banana</li>
            <li>peach</li>
        </ul>
    </div>

    // 해당 함수로 렌더링을 수행하면 클라이언트는 리액트에서 제공하는 useEffect와 같은 브라우저 API를 절대로 실행할 수 없다
    // renderToStaticMarkup의 결과물을 기반으로 리액트의 자바스크립트 이벤트 리스너를 등록하는 hydrate를 수행하면 에러가 발생한다
    // renderToStaticMarkup은 리액트의 이벤트 리스너가 필요없는 완전히 순수한 HTML을 만들 때 사용된다 ex)약관정보
}

{
    // renderToNodeStream
    // renderToString과 결과물이 완전히 동일하지만 두 가지 차이점이 있다
    // 1. renderToNodeStream은 브라우저에서 사용하는 것이 완전히 불가능하다
    // 물론 브라우저에서 실행항 이유도 없지만 Node.js 환경에 의존하고 있다

    // 2. renderToString의 결과물은 string 이지만 renderToNodeStream의 결과물은 Node.js의 ReadableStream이다 
    // ReadableStream은 utf-8로 인코딩된 바이트 스트림으로 Node.js나 Deno, Bun 같은 서버 환경에서만 사용할 수 있다
    // 궁극적으로 브라우저가 원하는 결과물(string) 을 얻기 위해서는 추가적인 처리가 필요하다
    // ReadableStream 자체는 브라우저에서도 사용 가능하지만 생성은 불가능하게 구현돼 있다

    // 스트림은 큰 데이터를 다룰 때 데이터를 청크(chunk, 작은 단위)로 분할해 조금씩 가져오는 방식을 의미한다 (ex 유튜브 영상)
    // renderToString을 사용시 HTML 크기가 매우 크면 해당 문자열을 한번에 메모리에 올려두고 응답을 수행해야 해서 Node.js가 실행되는 서버에 큰 부담이 될 수 있다
    // 대신 스트림을 활용하면 이러한 큰 크기의 데이터를 청크 단위로 분리해 순차적으로 처리할 수 있다는 장점이 있다

    // 예제
    // todos가 엄청나게 많다고 가정 시 renderToString은 이를 모두 한 번에 렌더링하려고 하기 떄문에 시간이 많이 소요될것이다
    export default function App({todos}: {todos: Array<TodoResponse>}){
        return (
            <>
                <h1>나의 할 일!</h1>
                <ul>
                    {todos.map((todo, index) => (
                        <Todo key={index} todo={todo} />
                    ))}
                </ul>
            </>
        )
    }

    // renderToNodeStream 사용 렌더링시
    // Node.js 코드
    // 응답으로 HTML이 여러 청크로 분리돼 내려온다
    // 리액트 애플리케이션을 렌더링하는 Node.js 서버의 부담을 덜 수 있다
    // 대부분의 널리 알려진 리액트 서버 사이드 렌더링 프레임워크는 모두 renderToNodeStream을 채택하고 있다
    ;(async () => {
        const response = await fetch('http://localhost:3000')

        try{
            for await (const chunk of response.body){
                console.log('-----chunk-----')
                console.log(Buffer.from(chunk).toString())
            }
        }catch(err){
            console.error(err.stack)
        }
    })()
}

{
    // renderToStaticNodeStream
    // renderToNodeStream의 renderToStaticMarkup 버전
}

{
    // hydrate
    // renderToString 과 renderToNodeStream으로 생성된 HTML 콘텐츠에 자바스크립트 핸들러나 이벤트를 붙이는 역할
    
    // hydrate와 비슷한 브라우저에서만 사용되는 메서드인 render
    // 해당 함수는 주로 create-react-app으로 생성된 프로젝의 index.jsx에서 찾아볼 수 있다
    import * as ReactDOM from 'react-dom'
    import App from './APP'

    const rootElement = document.getElementById('root')

    ReactDOM.render(<App />, rootElement)

    // render 함수는 컴포넌트와 HTML의 요소를 인수로 받는다
    // 이 인수들을 바탕으로 HTML의 요소에 해당 컴포넌트를 렌더링하며 이벤트 핸들러를 붙이는 작업까지 한 번에 수행한다

    // hydrate 예제
    import * as ReactDOM from 'react-dom'
    import App from './App'

    // containerId를 가리키는 element는 서버에서 렌더링된 HTML의 특정 위치를 의미
    const element = document.getElementById(containerId)
    // 해당 element를 기준으로 리액트 이벤트 핸들러를 붙인다
    ReactDOM.hydrate(<App />, element)

    
}