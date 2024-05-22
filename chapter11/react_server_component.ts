{
    // 리액트 18에서 새로 도입된 리액트 서버 컴포넌트는 서버 사이드 렌더링과 완전히 다른 개념
    // 서버에서 무언가 작업을 수행한다는 점을 제외하면 완전히 다른 개념을 보는 것이 옳다
}

{
    // 기존 리액트 컴포넌트와 서버 사이드 렌더링의 한계
    // 리액트의 모든 컴포넌트는 클라이언트에서 작동하며 브라우저에서 자바스크립트 코드 처리가 이뤄진다

    // 웹사이트
    // 실행에 필요한 코드 다운
    // 리액트 컴포넌트 트리 생성
    // DOM 렌더링

    // 서버 사이드 렌더링
    // 미리 서버에서 DOM을 만든다
    // 클라이언트에서는 이렇게 만들어진 DOM을 기준으로 하이드레이션을 진행
    // 이후 브라우저에서는 상태를 추적하고 이벤트 핸들러를 DOM에 추가하고 으답에 따라 렌더링 트리를 변경하기도 한다

    // 이 구조의 한계점

    // 자바스크립트 번들 크기가 0인 컴포넌트를 만들 수 없다: 게시판 등 사용자가 작성한 HTML에 위험한 태그를 제거하기 위해 사용되는 라이브러리로
    // sanitize-html이 있다 이 라이브러리를 리액트 컴포넌트에서 사용한다고 가정 시

    import sanitizeHtml from 'sanitize-html' // 206K (63.3K gzipped)

    function Board({ text }: { text: string }){
        const html = useMemo(() => sanitizeHtml(text, [text]))

        return <div dangerouslySetInnerHTML={{ __html: html }} ></div>
    }

    // 이 컴포넌트는 63.3kb에 달하는 sanitize-html을 필요로 하며 더욱이 이는 클라이언트인 브라우저에서 해당 라이브러리를 다운로드 해야 
    // 할뿐만 아니라 실행까지 거쳐야 한다
    // 어느정도 규모 있는 웹 애플리케이션을 작성하다 보면 브라우저 환경에서 타사 라이브러리의 이용은 피할 수 없게 된다
    // 그리고 이는 그만큼 사용자 기기의 부담으로 자리 잡는다
    // 만약 이 컴포넌트를 서버에서만 렌더링하고 클라이언트는 결과만 받는다면 클라이언트는 무거운 sanitize-html 라이브러리를 다운로드해 실행하지 않고도
    // 사용자에게 보여주고 싶은 컴포넌트를 렌더링 할 수 있게 될 것ㅇ다
}

{
    // 백엔드 리소스에 대한 직접적인 접근이 불가능하다: 리액트를 사용하는 클라이언트에서 백엔드 데이터에 접근하려면 REST API와 같은 방법을 
    // 사용하는 것이 일반적이다 이 방법은 편리하지만 백엔드에서 항상 클라이언트에서 데이터 접근하기 위한 방법을 마련해야 한다는 불편한 점이 있다
    // 만약 클라이언트에서 직접 백엔드에 접근해 원하는 데이터를 가져올 수 있다면

    import db from 'db' //어떤 DB

    async function Board({ id }: { id: string }){
        const text = await db.board.get(id)

        return <>{text}</>
    }

    // 이처럼 데이터베이스에 직접 액세스 하거나 혹은 백엔드의 파일 시스템에 직접 접근하는 등 클라이언트에 데이터를 제공하기 위한 수고로움이 줄어들 것이다
    // 또한 성능 관점에서 볼 때도 마찬가지로 백엔드에 접근할 수 있는 단계가 하나 줄어든 셈이므로 이점을 가지고 있다고 볼 수 있다
}

{
    // 자동 코드 분할(code split)이 불가능하다: 코드 분할이란 하나의 거대한 코드 번들 대신 코드를 여러 작은 단위로 나누어 필요할 때만
    // 동적으로 지연 로딩함으로서 앱을 초기하하는 속도를 높여주는 기법
    // 일반적으로 리액트에서는 lazy를 사용해 구현

    // 리액트 RFC 저장소에 있는 코드 분할 예제
    // PhotoRenderer.js
    // NOTE: *before* Server Components

    import { lazy } from 'react'

    const OldPhotoRenderer = lazy(() => import('./OldPhotoRenderer.js'))
    const NewPhotoRenderer = lazy(() => import('./NewPhotoRenderer.js'))

    function Photo(props){
        // 이 플래그에 따라 어떤 컴포넌트를 사용할지 결정
        if(FeatureFlags.useNewPhotoRenderer) {
            return <NewPhotoRenderer {...props} ></NewPhotoRenderer>
        } else{
            return <OldPhotoRenderer {...props} ></OldPhotoRenderer>
        }
    }

    // 이 기법은 훌륭하지만 몇 가지 단점이 있다

    // 먼저 일일이 lazy로 감싸야 한다 개발자는 항상 코드 분할을 해도 되는 컴포넌트인지를 유념하고 개발해야 하기 때문에 이를 누락하는 경우가 발생할 수 있다

    // 해당 컴포넌트가 호출되고 (Photo) if문을 판단하기 전까지 어떤 지연 로딩한 컴포넌트를 불러올지 결정할 수 없다 이는 지연 로딩으로 인한 성능 이점을
    // 상쇄해 버리는 결과를 만들고 만다

    // 만약 이 코드 분할을 서버에서 자동으로 수행한다면 개발자는 굳이 코드 분할을 염두에 두지 않더라도 자연스럽게 성능 이점을 누릴 수 있을 것이다
    // 어떤 컴포넌트를 미리 불러와서 클라이언트에 내려줄지 서버에서 결정할 수 있다면 코드 분할의 이점을 100% 활용할 수 있게 된다
}

{
    // 연쇄적으로 발생하는 클라이언트와 서버의 요청을 대응하기 어렵다: 하나의 요청으로 컴포넌트가 렌더링되고 그 컴포넌트의 렌더링 결과로 또 다른 
    // 컴포넌트들을 렌더링하는 시나리오
    // 이 시나리오에서는 최초 컴포넌트의 요청과 렌더링이 끝나기 전까지는 하위 컴포넌트의 요청과 렌더링이 끝나지 않는다는 단점 존재
    // 또한 그만큼 서버에 요청하는 횟수도 늘어난다
    // 부모 컴포넌트의 요청과 렌더링이 결정되기 전까지 그 부모 컴포넌트의 결과물에 의존하는 하위 컴포넌트들의 서버 요청이 지연되고 아직 렌더링할
    // 준비가 되지 않았음을 나타내는 불필요한 렌더링까지 발생한다

    // 데이터를 불러오고 컴포넌트를 렌더링하는 것이 모두 서버에서 이뤄지면 클라이언트에서 서버로 요청하는 지연을 줄일 수 있고
    // 클라이언트에서 반복적으로 요청을 수행할 필요도 없어진다
}

{
    // 추상화에 드는 비용 증가: 리액트는 템플릿 언어로 설계되지 않았다 템플릿 언어란 HTML에 특정 언어의 문법을 집어넣어 사용할 수 있는 것을 의미

    // 장고 예시
    {% for post in posts %}
    <li>
        <a href="/post/{{ post.id}}/">{{ post.text }}<a>
    </li>
    {% endfor %}

    // 템플릿 언어는 HTML에서 할 수 없는 for문이나 if문 등을 처리할 수 있지만 그 밖의 복잡한 추상화나 함수 사용은 어렵다
    // 리액트는 자바스크립트를 기반으로 함수나 클래스를 사용해 다양한 작업을 수행할 수 있게끔 제공한다
    // 이는 개발자에 자유를 주지만 문제는 이러한 추상화가 복잡해질수록 코드의 양은 많아지고 런타임 시에는 오버헤드가 발생한다

    // 예제 코드
    //Note.js
    import db from 'db'
    import NoteWithMarkdown from 'NoteWithMarkdown.js'
    import { fetchNote } from 'services.js'

    function Note({ id }){
        const [note, setNote] = useState(null)

        useEffect(() => {
            ;(async () => {
                const result = await fetchNote()
                const response = await result.json()
            })()
        }, [])

        if(note === null){
            return null
        }

        return <NoteWithMarkdown note={note} ></NoteWithMarkdown>
    }

    // NoteWithMarkdown.js
    import marked from 'marked'
    import sanitizeHtml from 'sanitize-html'

    function NoteWithMarkdown({ note }){
        const html = sanitizeHtml(marked(note.text))

        return <div dangerouslySetInnerHTML={{ __html: html }} ></div>
    }

    // 이 코드는 클라이언트에서 어떤 정보를 불러와서 이를 화면에 보여주는 역할을 하는 두 컴포넌트다 
    // 이 컴포넌트 내부의 내용은 복잡하지만 결국 사용자가 보는 것은 다음과 같은 단순한 결과물이다
    <div>
        // ... 노트
    </div>

    // 이런 복잡한 추상화에 따른 결과물 연산 작업을 서버에서 수행하면
    // 클라이언트에서는 복잡한 작업을 하지 않아도 되므로 속도가 빨리지고 서버에서 클라이언트에 전송되는 결과물 또한 단순해 가벼워질 것이다
    // 코드 추상화에 따른 비용은 서버에서만 지불하면 된다
}

{
    // 서버 사이드 렌더링, 클라이언트 사이드 렌더링은 모두 이 문제를 해결하기에는 조금씩 아쉬움이 있다
    // 서버 사이드 렌더링은 정적 콘텐츠를 빠르게 제공하고 서버에 있는 데이터를 손쉽게 제공할 수 있는 반면 사용자의 인터랙션에 따른
    // 다양한 사용자 경험을 제공하긴 어렵다
    // 클라이언트 사이드 렌더링은 사용자의 인터랙션에 따라 정말 다양한 것들을 제공할 수 있지만 서버에 비해 느리고 데이터를 가져오는 것도 어렵다

    // 이런 두 구족의 장점을 모두 취하고자 하는 것이 리액트 서버 컴포넌트다
}

{
    // 서버 컴포넌트란 하나의 언어, 하나의 프레임워크, 하나의 API와 개념을 사용하면서 서버와 클라이언트 모두에서 컴포넌트를 렌더링 할 수 있는 기법
    // 서버에서 할 수 잇는 일은 서버가 처리하게 두고 서버가 할 수 없는 나머지 작업은 클아이언트인 브라우저에서 수행된다

    // 즉 일부는 서버, 일부는 클라이언트에서 렌더링되는 것이다
    // 한 가지 명심해야 할점은 클라이언트 컴포넌트는 서버 컴포넌트를 import 할 수 없다는 것이다
    // 만약 클라이언트 컴포넌트가 서버 컴포넌트를 불러오게 된다면 클라이언트 컴포넌트는 서버 컴포넌트를 실행할 방법이 없기 때문에 컴포넌트를 호출 할 수 없다

    // 서버 컴포넌트의 이론에 따르면 모든 컴포넌트는 서버 컴포넌트가 될 수도 있고 클라이언트 컴포넌트가 될 수도 있다
    // 이런 구조가 가능한 이유는 children으로 자주 사용되는 ReactNode에 있다

    // ClientComponent.jsx
    'use client'
    // 이렇게 클라이언트 컴포넌트에서 서버 컴포넌트를 불러오는 것은 불가능하다
    import ServerComponent from './ServerComponent.server'

    export default function ClientComponent(){
        return (
            <div>
                <ServerComponent></ServerComponent>
            </div>
        )
    }

    'use client'
    // ClientComponent.jsx
    export default function ClientComponent({ children }){
        return (
            <div>
                <h1>클라이언트 컴포넌트</h1>
                {children}
            </div>
        )
    }

    // ServerComponent.jsx
    export default function ServerComponent() {
        return <span>서버 컴포넌트</span>
    }

    // ParentServerComponent.jsx
    // 이 컴포넌트는 서버 컴포넌트일 수도, 클라이언트 컴포넌트일 수도 있다
    // 따라서 두 군데 모두에서 사용할 수 있다
    import ClientComponent from './ClientComponent'
    import ServerComponent from './ServerComponent'

    export default function ParentServerComponent() {
        return (
            <ClientComponent>
                <ServerComponent></ServerComponent>
            </ClientComponent>
        )
    }

    // 리액트 서버 컴포넌트를 기반으로 리액트 컴포넌트 트리를 설계할 때 어떠한 제한이 생기는지 나타낸 코드
    // 서버 컴포넌트와 클라이언트 컴포넌트가 있으며 동시에 두 군데에서 모두 사용할 수 있는 공용 컴포넌트가 있다

    // 서버 컴포넌트
    // 요청이 오면 그 순간 서버에서 딱 한 번 실행될 뿐이므로 상태를 가질 수 없다 따라서 리액트에서 상태를 가질 수 있는 useState, useReducer등의 훅을
    // 사용할 수 없다
    
    // 렌더링 생명주기도 사용할 수 없다 한번 렌더링되면 그걸로 끝이기 때문이다 따라서 useEffect, useLayoutEffect를 사용할 수 없다

    // 앞의 두 가지 제약사항으로 인해 effect나 state에 의존하는 사용자 정의 훅 또한 사용할 수 없다
    // 다만 effect나 state에 의존하지 않고 서버에서 제공할 수 있는 기능만 사용하는 훅이라면 충분히 사용 가능

    // 브라우저에서 실행되지 않고 서버에서만 실행되기 떄문에 DOM API를 쓰거나 window, document등에 접근할 수 없다

    // 데이터베이스, 내부 서비스, 파일 시스템 등 서버에만 있는 데이터를 async/await으로 접근할 수 있다
    // 컴포넌트 자체가 async한 것이 가능하다

    // 다른 서버 컴포넌트를 렌더링하거나 div, span, p 같은 요소를 렌더링하거나 혹은 클라이언트 컴포넌트를 렌더링 할 수 있다

    // 클라이언트 컴포넌트
    // 브라우저 환경에서만 실행되므로 서버 컴포넌트를 불러오간 서버 전용 훅이나 유틸리티를 불러올 수 없다

    // 서버 컴포넌트가 클라이언트 컴포넌트를 렌더링 하는데 그 클라이언트 컴포넌트가 자식으로 서버 컴포넌트를 갖는 구조는 가능하다
    // 그 이유는 클라이언트 입장에서 봤을 때 서버 컴포넌트는 이미 서버에서 만들어진 트리를 가지고 있을 것이고 클라이언트 컴포넌트는 이미
    // 서버에서 만들어진 그 트리를 삽입해 보여주기만 하기 때문이다 따라서 서버 컴포넌트와 클라이언트 컴포넌트를 중첩해서 갖는 구조로 설계하는
    // 것이 가능하다

    // 공용 컴포넌트(shared components)
    // 이 컴포넌트는 서버와 클라이언트 모두에서 사용할 수 있다 공통으로 사용하는 만큼 당연히 서버컴포넌트와 클라이언트 컴포넌트의 모든 제약을 받는
    // 컴포넌트가 된다
}

{
    
}

