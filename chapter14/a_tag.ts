{
    // a 태그의 href에 javascript:로 시작하는 코드도 조심해야 한다
    // 이는 주로 a 태그의 기본 기능, 즉 href로 선언된 URL로 페이지를 이동하는 것을 막고 onClick 이벤트와 같이
    // 별도 이벤트 핸들러만 작동시키기 위한 용도로 주요 사용

    function App() {
        function handleClick() {
            console.log('hello')
        }

        return (
            <>
                <a href="javascript:;" onClick={handleClick}>
                    f링크
                </a>
            </>
        )
    }

    // 이러한 사용법은 마크업 관점에서 또한 안티패턴으로 볼 수 있다 
    // <a> 태그는 반드시 페이지 이동이 있을 때만 사용하는 것이 좋다
    // 페이지 이동 없이 어떠한 핸들러만 작동시키고 싶다면 button을 사용하는 것이 좋다

    // 그러나 이 코드를 정확히 이야기 하자면 href가 작동하지 않는 것이 아니라 href의 javascript:; 만 실행된 것이다 
    // 즉 href내에 자바스크립트 코드가 존재한다면 이를 실행한다는 뜻이다

    // 사용자가 href에 주소를 넣을 수 있다면 이 또한 보안 이슈로 이어질 수 있다
    // 피싱 사이트로 이동하는 것을 막기 위해 가능하다면 origin도 확인해 처리하는 것이 좋다
    function isSafeHref(href: string){
        let isSafe = false

        try{
            // javascript:가 오면 protocol이 javascript:가 된다
            const url = new URL(href)

            if(['http:', 'https:'].includes(url.protocol)){
                isSafe = true
            }
        }catch {
            isSafe = false
        }

        return isSafe
    }

    function App() {
        const unsafeHref = "javascript:alert('hello');"
        const safeHref = 'https://www.naver.com'

        return (
            <>
                // 위험한 href로 분류되어 #이 반환된다
                <a href={isSafeHref(unsafeHref) ? unsafeHref : '#'}>위험한 href</a>
                // 안전한 href로 분류되어 원하는 페이지로 이동할 수 있다
                <a href={isSafeHref(safeHref) ? safeHref : '#'}>안전한 href</a>
            </>
        )
    }
}