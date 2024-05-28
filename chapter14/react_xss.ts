{
    // 크로스 사이트 스크립팅(Cross-Site Scriptiong XXS) 
    // 웹 애플리케이션에서 가장 많이 보이는 취약점 중 하나 
    // 웹사이트 개발자가 아닌 제3자가 웹사이트에 악성 스크립트를 삽입해 실행할 수 있는 취약점
    // 일반적으로 게시판과 같이 사용자가 입력을 할 수 있고 이 입력을 다른 사용자에게 보여줄 수 있는 경우에 발생

    <p>사용자가 글을 작성했습니다.</p>
    <script>
        alert('XSS')
    </script>

    // alert 실행 코드 XXS
}

{
    // 리액트에서 XSS 이슈 발생 예
    // dangerouslySetInnerHTML prop
    // 특정 브라우저 DOM의 innerHTML을 특정한 내용으로 교체할 수 있는 방법
    // 일반적으로 게시판과 같이 사용자나 관리자가 입력한 내용을 브라우저에 표시하는 용도로 사용 
    function App() {
        // 다음 결과물은 <div>First - Second</div>이다
        return <div dangerouslySetInnerHTML={{__html: 'First &middot; Second'}}></div>
    }

    // dangerouslySetInnerHTML은 오직 __html을 키로 가지고 있는 객체만 인수로 받을 수 있으며 이 인수로 넘겨받은 문자열을 DOM에 그대로
    // 표시하는 역할 

    // dangerouslySetInnerHTML의 위험성은 dangerouslySetInnerHTML이 인수로 받는 문자열에 제한이 없다는 것이다

    const html `<span><svg/onload=alert(origin)></span>`

    function App() {
        return <div dangerouslySetInnerHTML={{__html: html}}></div>
    }

    export default App

    // 해당 사이트를 방문하면 origin이 alert으로 나타나게 된다
    // dangerouslySetInnerHTML사용 시 주의해야 하며 문자열 값은 한 번 더 검증이 필요하다
}

{
    // useRef를 활용한 직접 삽입
}