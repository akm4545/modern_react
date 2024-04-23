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

    function SimpleComponent(){
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
}