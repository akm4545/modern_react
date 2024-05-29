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
    // useRef를 사용하면 직접 DOM에 접근할 수 있으므로 앞서와 비슷한 방식으로 innerHTML에 보안 취약점이 있는 스크립트를 삽입하면 동일한 문제 발생
    const html = `<span><svg/onload=alert(origin)></span>`

    function App() {
        const divRef = useRef<HTMLDivElement>(null)

        useEffect(() => {
            if(divRef.current){
                divRef.current.innerHTML = html
            }
        })

        return <div ref={divRef}></div>
    }
}

{
    // <script>나 svg/onload를 사용하는 방식 외에도 <a>태그에 잘못된 href를 삽입하거나 onclick, onload등 이벤트를 활용하는 등 여러 가지 방식의
    // XSS가 있지만 공통적인 문제는 웹사이트 개발자가 만들지 않은 코드를 삽입한다는 것에 있다
}

{
    // 리액트에서 XSS문제를 피하는 방법
    // 제 3자가 삽입할 수 있는 HTML을 안전한 HTML 코드로 한 번 치환하는 것
    // 이러한 과정을 새니타이즈(sanitize) 또는 이스케이프(escape)라고 하는데 npm에 있는 라이브러리를 사용하면 된다

    // 유명한 새니타이즈 라이브러리
    // DOMpurity(https://github.com/cure53/DOMPurity)
    // sanitize-html(https://github.com/apostrophecms/sanitize-html)
    // js-xss(https://github.com/leizongmin/js-xss)

    // sanitize-html을 사용한 예제

    import sanitizeHtml, { IOptions as SanitizeOptions } from 'sanitize-html'

    // 허용하는 태그
    const allowedTags = [
        'div',
        'p',
        'span',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'figure',
        'iframe',
        'a',
        'strong',
        'i',
        'br',
        'img'
    ]

    // 위 태그에서 허용할 모든 속성
    const defaultArrtibutes = ['style', 'class']

    // 허용할 iframe 도메인
    const allowedIframeDomains = ['naver.com']

    // 허용되는 태그 중 추가로 허용할 속성
    const allowedAttributeForTags: {
        [key in (typeof allowedTags)[number]]: Array<string>
    } = {
        iframe: ['src', 'allowfullscreen', 'scrolling', 'frameborder', 'allow'],
        img: ['src', 'alt'],
        a: ['href'],
    }

    // allowedTags, allowedAttributeForTags, defaultAttributes를 기반으로
    // 허용할 태그와 속성을 정의
    const allowedAttributes = allowedTags.reduce<
        SanitizeOptions['allowedAttributes']
    >((result, tag) => {
        const additionalAttrs = allowedAttributeForTags[tag] || []
        return { ...result, [tag]: [...additionalAttrs, ...defaultArrtibutes] }
    }, {})

    // ...
    const sanitizedOptions: SanitizeOptions = {
        allowedTags,
        allowedAttributes,
        allowedIframeDomains,
        allowIframeRelativeUrls: true,
    }

    const html = '<span><svg/onload=alert(origin)></span>'

    function App() {
        // 위 옵션을 기반으로 HTML을 이스케이프한다
        // svg는 허용된 태그가 아니므로 <span></span>만 남는다
        const sanitizeHtml = sanitizeHtml(html, sanitizedOptions)

        return <div dangerouslySetInnerHTML={{__html: sanitizeHtml }}></div>
    }

    // sanitize-html은 허용할 태그와 목록을 일일히 나열하는 이른바 허용 목록(allow list) 방식을 채택하기 떄문에 사용하기가 매우 귀찮게 
    // 느껴질 수도 있지만 이 방식이 훨씬 안전하다

    // 허용 목록에 추가하는 것을 깜박한 태그나 속성이 있다면 단순히 HTML이 안 보이는 사소한 이슈로 그치겠지만 차단 목록(block list)으로 해야
    // 할 것을 놓친다면 그 즉시 보안 이슈로 연결되기 떄문이다

    // 사용자가 콘텐츠를 저장할 때도 한번 이스케이프 과정을 거치는 것이 더 효율적이고 안전하다 
    // 애초에 XSS 위험성이 있는 콘텐츠를 데이터베이스에 저장하지 않는 것이 예기치 못한 위험을 방지하는 데 훨씬 도움이 될뿐만 아니라 한번 
    // 이스케이프하면 그 뒤로 보여줄 때마다 일ㅇ리이 이스케이프 과정을 거치지 않아도 되므로 훨씬 효율적이다

    // 이러한 치환 과저은 되도록 서버에서 수행하는 것이 좋다
    // POST 요청을 스크립트나 curl등으로 직접 요청하는 경우에는 스크립트에서 실행하는 이스케이프 과정을 생략하고 바로 저장될 가능성이 있다
    // 클라이언트에서 사용자가 입력한 데이터는 일단 의심한다 라는 자세로 클라이언트의 POST 요청에 있는 HTML을 이스케이프하는 것이 제일 안전하다

    // 단순히 게시판과 같은 예시가 웹사이트에 없더라 하더라도 XSS 문제는 충분히 발생할 수 있다
    // 예를 들어 다음과 같이 쿼리스트링에 있는 내용을 그대로 실행하거나 보여주는 경우에도 보안 취약점이 발생할 수 있다

    import { useRouter } from 'next/router'

    function App () {
        const router = useRouter()
        const query = router.query
        const html = query?.html?.toString() || ''

        return <div dangerouslySetInnerHTML={{ __html: html }} ></div>
    }

    // 개발자는 자신이 작성한 코드가 아닌 query, GET 파라미터, 서버에 저장된 사용자가 입력한 데이터 등 외부에 존재하는 모든 코드를 위험한
    // 코드로 간주하고 이를 적절하게 처리해야 한다
}