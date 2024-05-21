{
    // 리액트 18에서 가장 큰 변경점은 동시성 지원이다
}

{
    // 리액트 18에서 새로 추가된 훅

    // useId
    // 컴포넌트별로 유니크한 값을 생성하는 훅

    // 유니크 값을 만들기 위해 고려해야 할 점
    // 1. 하나의 컴포넌트를 여러 군데에서 재사용 하는 경우
    // 2. 리액트 컴포넌트 트리에서 컴포넌트가 가지는 모든 값이 겹치지 않고 다 달라야 한다는 제약
    // 3. 서버 사이드 렌더링 환경에서 하이드레이션이 일어날 때도 서버와 클라이언트에서 동일한 값을 가져야 한다

    // 다음 컴포넌트가 서버 사이드에서 렌더링되어 클라이언트에 제공된다면
    export default function UniqueComponent() {
        return <div>{Math.rendom()}</div>
    }

    // 에러 발생
    // Text content did not match. Server: "0.321312..." Client: "0.7689646"

    // 서버에서 렌더링하고 클라이언트에서 해당 결과물을 받고 이벤트를 입히기 위한 하이드레이션을 했을 때 Math.random() 값이 다르기 때문
    // 리액트 17까지는 컴포넌트별로 고유한 값을 사용한다면 반드시 하이드레이션을 고려해야 해서 리액트 17까지는 굉장히 까다로운 작업이다

    // useId를 사용하면 클라이언트와 서버에서 불일치를 피하면서 컴포넌트 내부의 고유한 값을 생성할 수 있게 됐다
    import { useId } from 'react'

    function Child(){
        const id = useId()
        return <div>child: {id}</div>
    }

    function SubChild(){
        const id = useId()

        return (
            <div>
                Sub Child: {id}
                <Child />
            </div>
        )
    }

    export default function Random(){
        const id = useId()

        return (
            <>
                <div>Home: {id}</div>
                <SubChild />
                <SubChild />
                <Child />
                <Child />
                <Child />
            </>
        )
    }
    
    // 이 컴포넌트를 서버 사이드에서 렌더링하면 다음과 같은 HTML을 확인할 수 있다
    <div>
        <div>
            Home:
            <!-- -->:Rm:
        </div>
        <div>
            Sub Child:<!-- -->:Ram:
            <div>
                child:
                <!-- -->:R7am:
            </div>
        </div>
        <div>
            Sub Child:<!-- -->:Rem:
            <div>
                Child:
                <!-- -->:R7em:
            </div>
        </div>
        <div>
            child:
            <!-- -->:Rim:
        </div>
        <div>
            child:
            <!-- -->:Rmm:
        </div>
        <div>
            child:
            <!-- -->:Rqm:
        </div>
    </div>

    // 같은 컴포넌트여도 서로 인스턴스가 다르면 다른 랜덤한 값들어 내며 이들 모두 유니크하다
    // 서버와 클라이언트 간에 동일한 값이 생성되어 하이드레이션 이슈도 발생하지 않는다
    // useId의 값은 :로 감싸져 있는데 이는 CSS 선택자나 querySelector에서 작동하지 않도록 하기 위한 의도적인 결과다
}

{
    // useTransition
    // UI 변경을 자로막지 않고 상태를 업데이트할 수 있는 리액트 훅
    // 이를 활용하면 상태 업데이트를 긴급하지 않은 것으로 간주해 무거운 렌더링 작업을 조금 미룰 수 있으며 사용자에게 조금 더 나은 경험을 제공한다

    // App.tsx
    type Tab = 'about' | 'posts' | 'contact'

    export default function App() {
        const [tab, setTab] = useState<Tab>('about')

        function selectTab(nextTab: Tab){
            setTab(nextTab)
        }

        return (
            <>
                <TabButton isActive={tab === 'about'} onClick={() => selectTab('about')}>
                    Home
                </TabButton>
                <TabButton isActive={tab === 'posts'} onClick={() => selectTab('potst')}>
                    Posts (slow)
                </TabButton>
                <TabButton isActive={tab === 'contact'} onClick={() => selectTab('contact')}>
                    Contact
                </TabButton>
                <hr />

                // 일반적인 컴포넌트
                {tab === 'about' && <About />}
                // 매우 무거운 연산이 포함된 컴포넌트
                {tab === 'posts' && <Posts />}
                // 일반적인 컴포넌트
                {tab === 'contact' && <Contact />}
            </>
        )
    }

    //PostTab.tsx
    import {memo} from 'react'

    const PostsTab = memo(function PostsTab() {
        const items = Array.from({ length: 1500 }).map((_, i) => (
            <SlowPost key={i} index={i} />
        )) 

        return <ul className="items">{items}</ul>
    })

    function SlowPost({ index } : { index: number }){
        let startTime = performance.now()
        // 렌더링이 느려지는 상황을 가정하기 위해 느린 코드 추가
        while(performance.now() - startTime < 1){
            // 아무것도 하지 않음
        }

        return <li className="item">Post #{indext + 1}</li>
    }

    export default PostsTab

    // 실수로 사용자가 Post를 누른 후 Contact를 선택했다고 가정 시 Post의 느린 렌더링 작업으로 인해 Contact로 바로 넘어갈 수 없다
    // Post 렌더링을 중단하고 Contact로 넘어가는 것이 적절한 시나리오다

    // 이를 useTransition훅을 사용해 해결할 수 있다

    import { useState, useTransition } from 'react'

    export default function TabContainer() {
        const [isPending, startTransition] = useTransition()
        const [tab, setTab] = useState<Tab>('about')

        function selectTab(nextTab: Tab){
            startTransition(() => {
                setTab(nextTab)
            })
        }

        return (
            <>
                // ...
                {isPending ? (
                    '로딩 중'
                ) : (
                    <>
                        {tab === 'about' && <About />}
                        {tab === 'posts' && <Posts />}
                        {tab === 'contact' && <Contact />}
                    </>
                )}
            </>
        )
    }

    // useTransition은 아무것도 인수로 받지 않으며 isPending과 startTransition이 담긴 배열을 반환
    // isPending은 상태 업데이트가 진행 중인지 확인할 수 있는 boolean
    // startTransition은 긴급하지 않은 상태 업데이트로 간주할 set함수를 넣어둘 수 있는 함수를 인수로 받는다
    // 경우에 따라서 여러 개의 setter를 넣어줄 수도 있다

    // 이 경우 Post를 클릭하고 다른 메뉴를 클릭하면 Post 렌더링을 종료하고 넘어간다
    // 즉 비동기로 렌더링한다 렌더링 와중에 다른 상태 업데이트로 전환되면 렌더링이 취소될 수도 혹은 완성될 때까지 기다리되 다른 렌더링을
    // 가로막지 않을 수 있다

    // useTransition은 리액트 18의 변경 사항의 핵심 중 하나인 동시성(concurrency)을 다룰 수 있는 훅이다
    // 과거 리액트의 모든 렌더링은 동기적으로 작동해 느린 렌더링 작업이 있을 경우 애플리케이션 전체적으로 영향을 끼쳤지만 
    // useTransition과 같은 동시성을 지원하는 기능을 사용하면 느린 렌더링 과정에서 로딩 화면을 보여주거나 혹은 지금 진행 중인 렌더링을
    // 버리고 새로운 상태값으로 다시 렌더링하는 등의 작업을 할 수 있게 된다

    // useTransition은 컴포넌트에서만 사용 가능한 훅이다 훅을 사용할 수 없는 상황이면 단순히 startTransition을 바로 import 할 수도 있다

    import { startTransition } from 'react'

    // useTransition 사용 시 주의점

    // startTransition 내부는 반드시 setState와 같은 상태를 업데이트하는 함수와 관련된 작업만 넘길 수 있다 만약 props나 사용자 정의 훅에서
    // 반환하는 값 등을 사용하고 싶다면 useDefferedValue를 사용한다

    // startTransition으로 넘겨주는 상태 업데이트는 다른 모든 동기 상태 업데이트로 인해 실행이 지연될 수 있다
    // 예를 들어 타이핑으로 인해 setState가 일어나는 경우 타이핑이 끝날 떄까지 useTransition으로 지연시킨 상태 업데이트는 일어나지 않는다

    // startTransition으로 넘겨주는 함수는 반드시 동기 함수여야 한다 비동기 함수를 넣으면 제대로 작동하지 않게 된다
    // 이는 startTransition이 작업을 지연시키는 작업과 비동기로 함수가 실행되는 작업 사이에 불일치가 일어나기 때문
}

{
    // useDeferredValue
    // 리액트 컴포넌트 트리에서 리렌더링이 급하지 않은 부분을 지연할 수 있게 도와주는 훅
    // 특정 시간 동안 발생한 이벤트를 하나오 인식해 한 번만 실행하게 해주는 디바운스와 비슷하지만 디바운스 대비 useDeferredValue 만이 가진 장점이
    // 몇 가지 있다

    // 디바운스는 고정된 지연 시간을 필요로 하지만 useDeferredValue는 고정된 지연 시간 없이 첫 번째 렌더링이 완료된 이후에 지연된 렌더링을 수행한다
    // 그러므로 이 지연된 렌더링은 중단할 수도 있으며 사용자의 인터랙션을 차단하지도 않는다

    export default function input() {
        const [text, setText] = useState('')
        const deferredText = useDeferredValue(text)

        const list = useMemo(() => {
            const arr = Array.from({ length: deferredText.length }).map(
                (_) => deferredText,
            )

            return (
                <ul>
                    {arr.map((str, indext) => (
                       <li key={indext}>{str}</li>
                    ))}
                </ul>
            )
        }, [deferredText])

        function handleChange(e: ChangeEvent<HTMLInputElement>){
            setText(e.target.value)
        }

        returm (
            <>
                <input value={text} onChange={handleChange} />
                {list}
            </>
        )
    }

    // list를 생성하는 기준을 text가 아닌 deferredText로 설정함으로써 잦은 변경이 있는 text를 먼저 업데이트해 렌더링하고 이후 여유가 있을 때 
    // 지연된 deferredText를 활용해 새로운 list를 새로 생성하게 된다
    // list에 있는 작업이 더 무겁고 오래 걸릴수록 useDeferredValue를 사용하는 이점을 더욱 누릴 수 있다

    // useDeferredValue와 useTransition의 방시그이 차이가 있지만 지연된 렌더링을 한다는 점에서 모두 동일한 역할을 한다
    // 만약 낮은 우선순위로 처리해야 할 작업에 대해 직접적으로 상태를 업데이트할 수 있는 코드에 접근할 수 있다면 useTransition을 사용하는 것이 좋다
    // 그러나 컴포넌트의 props와 같이 상태 업데이트에 관여할 수 없고 오로지 값만 받아야 하는 상황이라면 useDeferredValue를 사용하는 것이 타당하다
}

{
    // useSyncEcternalStore
    // 일반적인 애플리케이션 코드를 작성할 때는 사용할 일이 별로 없다
    // useSubscription의 구현이 리액트 18에서 useSyncEcternalStore로 대체되었다
    
    // 테어링(tearing)
    // 영어로 찢어진다라는 뜻으로 리액트에서 하나의 state 값이 있음에도 서로 다른 값 (보통 state나 props의 이전과 이후)을 기준으로 렌더링되는 현상
    // 리액트 17에서는 이러한 현상이 일어날 여지가 없지만 리액트 18에서는 비동기 렌더링을 지원하는 훅을 사용해서 최적화가 가능해지면서 동시성 이슈가 발생할 수 있다

    // 예를 들어 startTransition으로 렌더링을 일시 중지했다고 가정할때
    // 이러한 일시 중지 관정에서 값이 업데이트되면 동일한 하나의 변수(데이터)에 대해서 서로 다른 컴포넌트 형태가 나타날 수 있다
    // 1. A 컴포넌트에서 외부 데이터 스토어의 값이 파란색이었으므로 파란색을 렌더링
    // 2. B, C 컴포넌트들도 파란색으로 렌더링 준비
    // 3. 그러다 갑자기 외부 데이터 스토어의 값이 빨간색으로 변경
    // 4. B, C 컴포넌트들은 렌더링 도중에 바뀐 색을 확인해 빨간색으로 렌더링
    // 5. 같은 데이터 소스를 발보고 있음에도 컴포넌트의 색상이 달라지는 테어링 현상 발생

    // 리액트 내부에서 문제를 해결하기 위해 해당 훅들에 처리를 해뒀지만 리액트가 관리할 수 없는 외부 데이터 소스에서라면 문제가 달라진다
    // 리액트가 관리할 수 없는 외부 데이터 소스 
    // 리액트의 클로저 범위 밖에 있는 값들 (글로벌 변수, document.body, window.innerWidth, DOM, 리액트 외부에 상태를 저장하는 외부 상태 관리 라이브러리 등)
    // 즉 useState나 useReducer가 아닌 모든 것들
    // 이러한 외부 데이터 소스에 리액트에서 추구하는 동시성 처리가 추가돼 있지 않다면 테어링 현상이 발생할 수 있다
    // 이러한 문제를 해결하기 위한 훅이 useSyncExternalStore다

    import { useSyncExternalStore } from 'react'

    useSyncExternalStore(
        subscribe: (callback) => Unsubscribe
        getSnapshot: () => State
    ) => State

    // 첫 번째 인수는 subscribe로 콜백 함수를 받아 스토어에 등록하는 용도 스토어에 있는 값이 변경되면 이 콜백이 호출 그리고 useSyncExternalStore는
    // 이 훅을 사용하는 컴포넌트를 리렌더링

    // 두 번째 인수는 컴포넌트에 필요한 현재 스토어의 데이터를 반환하는 함수 이 함수는 변경되지 않았다면 매번 함수를 호출할 때마다 동일한 값을 반환해야 한다
    // 스토어에서 값이 변경됐다면 이 값을 이전 값과 Object.is로 비교해 정말로 값이 변경됐다면 컴포넌트를 리렌더링한다

    // 마지막 인수는 옵셔널 값으로 서버 사이드 렌더링 시에 내부 리액트를 하이드레이션하는 도중에만 사용
    // 서버 사이드에서 렌더링되는 훅이라면 이 값을 넘겨줘야 하며 클라이언트의 값과 불일치가 발생할 경우 오류 발생

    // 훅 사용 예제
    // innerWidth는 리액트 외부에 있는 데이터 값이므로 이 값의 변경 여부를 확인해 리렌더링
    import { useSyncExternalStore } from 'react'

    // useSyncExternalStore가 제공하는 callback 함수를 받고 callback 함수는 Window와 UIEvent를 저장하는 코드가 있는듯함
    // 즉 리사이즈가 일어날때마다 callback이 실행되면서 window와 ev를 저장
    function subscribe(callback: (this: Window, ev: UIEvent) => void) {
        window.addEventListener('resize', callback)

        return () => {
            window.removeEventListener('resize', callback)
        }
    }

    export default function App() {
        const windowSize = useSyncExternalStore(
            // resize 이벤트 발생시 해당 콜백 실행
            subscribe,
            // 현재 스토어의 값
            () => window.innerWidth,
            // 서버 사이드에서는 해당 값을 추적할 수 없으므로 0을 제공
            () => 0, //서버 사이드 렌더링 시 제공되는 기본값
        )
    }

    return <>{windowSize}</>

    // 이를 하나의 훅으로 만들어서 다음과 같이 사용 가능
    function subscribe(callback: (this: Window, ev:UIEvent) => void){
        window.addEventListener('resize', callback)

        return () => {
            window.removeEventListener('resize', callback)
        }
    }

    function useWindowWidth() {
        return useSyncExternalStore(
            subscribe,
            () => window.innerWidth,
            () => 0
        )
    }

    export default function App() {
        const windowSize = useWindowWidth()
        return <>{windowSize}</>
    }

    // 이전에도 useSyncExternalStore가 없어도 이와 비슷한 훅을 만들 수 있었다
    function useWindowWidth() {
        const [windowWidth, setWindowWidth] = useState(0)

        useEffect(() => {
            function handleResize() {
                setWindowWidth(window.innerWidth)
            }

            window.addEventListener('resize', handleResize)

            return () => window.removeEventListener('resize', handleResize)
        }, [])

        return windowWidth
    }

    // 예제의 차이를 검증하기 위한 코드 (startTransition을 이용한다고 가정)
    // posts...
    const PostsTab = memo(function PostsTab() {
        const width1 = useWindowWidthWithSyncExternalStore()
        const width2 = useWindowWidth()
        const items = Array.from({ length: 1500 }).map((_, i) => (
            <SlowPost key={i} index={i} />
        ))

        return (
            <>
                <div>useSyncExternalStore {width1}px</div>
                <div>useEffect + useState {width2}px</div>
                <ul className="items">{items}</ul>
            </>
        )
    })

    export default PostsTab

    // useSyncExternalStore를 사용한 컴포넌트 훅은 컴포넌트 렌더링 이후 정확하게 바로 현재의 width를 가져온다
    // 사용하지 않은 쪽은 초깃값인 0을 나타낸다
}

{
    // useInsertionEffect
    // CSS-in-js 라이브러리를 위한 훅
    // CSS의 추가 및 수정은 브라우저에서 렌더링하는 작업 대부분을 다시 계산해 작업해야하는데 이는 리액트 관점으로 본다면 
    // 모든 컴포넌트에 영향을 미칠 수 있는 매우 무거운 작업
    // 따라서 리액트 17과 styled-components에서는 클라이언트 렌더링 시에 이러한 작업이 발생하지 않도록 서버 사이드에서 스타일 코드 삽입
    // 이 작업을 훅으로 처리하는 것은 지금까지 쉽지 않았는데 훅에서 이러한 작업을 할 수 있도록 도와주는 새로운 훅이 바로 useInsertionEffect다
    
    // useInsertionEffect의 기본적인 훅 구조는 useEffect와 동일 
    // 실행 시점이 다른데 useInsertionEffect는 DOM이 실제로 변경되기 전에 동기적으로 실행
    // 이 훅 내부에 스타일을 삽입하는 코드를 넣음으로써 브라우저가 레이아웃을 계산하기 전에 실행될 수 있게끔 해서 좀 더 자연스러운 스타일 삽입이 가능해진다

    // Effect 훅의 실행 순서
    function index() {
        useEffect(() => {
            console.log('useEffect!') //3
        })

        useLayoutEffect(() => {
            console.log('useLayoutEffect!') //2
        })

        useInsertionEffect(() => {
            console.log('useInsertionEffect!') //1
        })
    }

    // useLayoutEffect는 모든 DOM의 변경 작업이 다 끝난 이후에 실행
    // useInsertionEffect는 DOM 변경 작업 이전에 실행
    // 이러한 차이는 브라우저가 다시금 스타일을 입혀서 DOM을 재계산하지 않아도 된다는 점에서 매우 크다고 볼 수 있다
    // useInsertionEffect는 실제 애플리케이션 코드를 작성할 때는 사용될 일이 거의 없으므로 라이브러리를 작성하는 경우가 아니라면 참고만 하고 실제
    // 애플리케이션 코드에는 가급적 사용하지 않는 것이 좋다
}

{
    // react-dom/client
    // 클라이언트에서 리액트 트리를 만들 때 사용되는 API가 변경
    // 리액트 18로 업그레이드할 때 반드시 index.{t|j}jsx에 있는 내용을 변경해야 한다
}

{
    // createRoot
    // 기존의 react-dom에 있던 render 메서드를 대체할 새로운 메서드
    // 리액트 18의 기능을 사용하고 싶다면 createRoot와 render를 함께 사용해야 한다

    // before
    import ReactDOM from 'react-dom'   
    import App from 'App'

    const container = document.getElementById('root')

    ReactDOM.render(<App />, container)

    //after
    import ReactDOM from 'react-dom'
    import App from 'App'

    const container = document.getElementById('root')

    const root = ReactDOM.createRoot(container)
    root.render(<App />)

    // 리액트 18로 업그레이드를 고려하고 있다면 리액트의 루트 컴포넌트가 렌더링되고 있는 곳에서 위와 같이 코드를 변경해야 한다
}

{
    // hydrateRoot
    // 서버 사이드 렌더링 애플리케이션에서 하이드레이션을 하기 위한 새로운 메서드
    // React DOM 서버 API와 함께 사용

    //before
    import ReactDOM from 'react-dom'
    import App from 'App'

    const container = document.getElementById('root')

    ReactDOM.hydrate(<App />, container)

    //after
    import ReactDOM from 'react-dom'
    import App from 'App'

    const container = document.getElementById('root')

    const root = ReactDOM.hydrateRoot(container, <App />)

    // 대부분의 서버 사이드 렌더링은 프레임워크에 의존하고 있을 것이므로 사용하는 쪽에서 수정할 일은 거의 없는 코드다
    // 다만 자체적으로 서버 사이드 렌더링을구현해서 사용하고 있다면 이 부분 역시 수정해야 한다
    // 추가된 두 API는 새로운 옵션인 onRecoverableError를 인수로 받는다 
    // 이 옵션은 리액트가 렌더링 또는 하이드레이션 과정에서 에러가 발생했을 때 실행하는 콜백 함수다 
    // 기본값으로 reportError 또는 console.error를 사용하지만 필요시 원하는 내용 추가
}

{
    // react-dom/server
    // 서버에서도 컴포넌트를 생성하는 API에 변경이 있다
}

{
    // renderToPipeableStream
    // 리액트 컴포넌트를 HTML로 렌더링하는 메서드
    // 스트림을 지원하는 메서드로 HTML을 점진적으로 렌더링하고 클라이언트에서는 중간에 script를 삽입하는 등의 작업을 할 수 있다
    // 이를 통해 서버에서는 Suspense를 사용해 빠르게 렌더링이 필요한 부분을 먼저 렌더링 할 수 있고 값비싼 연산으로 구성된 부분은
    // 이후에 렌더링되게끔 할 수 있다

    // hydrateRoot를 호출하면 서버에서는 HTML을 렌더링하고 클라이언트의 리액트에서는 여기에 이벤트만 추가함으로써 첫 번째 로딩을 매우 빠르게 
    // 수행할 수 있다

    import * as React from 'react'

    //res는 HTTP 응답이다
    function render(url, res){
        let didError = false

        // 서버에서 필요한 데이터를 불러온다
        // 그리고 여기에서 데이터를 불러오는 데 오랜 시간이 걸린다고 가정
        const data = createServerData()
        const stream = renderToPipableStream(
            // 데이터를 context API로 넘긴다
            <DataProvider data={data} />
                <App assets={assets} />
            </DataProvider>,
            {
                // 렌더링 시에 포함시켜야 할 자바스크립트 번들
                bootstrapScripts: [assets['main.js']],
                onSehllReady(){
                    // 에러 발생 시 처리 후가
                    res.statusCode = didError ? 500 : 200
                    res.setHeader('Content-type', 'text/html')
                    stream.pipe(res)
                },
                onError(x){
                    didError = true
                    console.error(x)
                },
            },
        )

        // 렌더링 시작 이후 일정 시간이 흐르면 렌더링에 실패한 것으로 간주하고 취소
        setTimeout(() => stream.abort(), ABORT_DELAY)
    }

    export default function App({assets}) {
        return (
            <Html assets={assets} title="Hello">
                <Suspense fallback={<Spinner />}>
                    <ErrorBoundary FallbackComponent={Error}>
                        <Content />
                    </ErrorBoundary>
                </Suspense>
            </Html>
        );
    }

    function Content() {
        return (
            <Layout>
                <NavBar />
                <article className="post">
                    <section className="comments">
                        <h2>Comments</h2>
                        // 데이터가 불러오기 전에 보여줄 컴포넌트
                        <Suspense fallback={<Spinner />}>
                            // 데이터가 완료된 후에 노출되는 컴포넌트
                            <Comments />
                        </Suspense>
                    </section>
                    <h2>Thanks for reading!</h2>
                </article>
            </Layout>
        );
    }

    // renderToPipeableStream을 쓰면 최초에 브라우저는 아직 불러오지 못한 데이터 부분을 Suspense의 fallback으로 받는다

    <main>
        <article class="post">
            // ...
            <h1>Hello world</h1>
            // ...
            <section class="comments">
                <h2>Comments</h2>
                <template id="B:0"></template>
                // Suspense의 fallback이 온다
                <div
                    class="spinner spinner--active"
                    role="progressbar"
                    aria-busy="true"
                ></div>
            </section>
            <h2>Thanks for reading!</h2>
        </article>
    </main>

    // createServerData의 데이터 로딩이 끝나면 <Comments/>가 데이터를 가지고 렌더링된다

    // 기존 renderToNodeStream의 문제는 무조건 렌더링을 순서대로 해야 하고 그 순서에 의존적이기 때문에 이전 렌더링이 완료되지 않는다면 이후 렌더링도
    // 끝나지 않는다 따라서 만약에 렌더링 중간에 오래 걸리는 작업이 있다면 그 작업 때문에 나머지 렌더링도 덩달아 지연된다는 문제가 있다
    // 18에서 새롭게 추가된 renderToPipeableStream을 활용하면 순서나 오래 걸리는 렌더링에 영향받을 필요 없이 빠르게 렌더링 수행 가능하다

    // 리액트 18에서 제공하는 <Suspense />d와 같은 코드 분할 내지는 지연 렌더링을 서버 사이드에서 완전히 사용하기 위해서는
    // renderToPipeableStream 대신 이 메서드를 사용해야 한다
    // 실제로 renderToPipeableStream을 가지고 서버 사이드 렌더링을 만드는 경우는 거의 없겠지만 사용하고자 하는 프레임워크에서 리액트 18을
    // 사용하고 싶다면 해당 메서드의 지원 여부를 확인해 보는 것이 좋다
}

{
    // renderToReadableStream
    // renderToPipeableStream이 Node.js 환경에서 렌더링을 위해 사용
    // renderToReadableStream은 웹 스트립(web stream)을 기반으로 작동한다
    // 이는 서버 환경이 아닌 클라우드플레어(Cloudflare)나 디노(Deno) 같은 웹 스트림을 사용하는 모던 엣지 런타임 환경에서 사용되는 메서드
    // 실제 웹 애플리케이션 개발 시 해당 메서드를 사용할 일이 거의 없을 것이다
}

{
    // 자동 배치(Automatic Batching)
    // 리액트가 여러 상태 업데이트를 하나의 리렌더링으로 묶어서 성능을 향상시키는 방법
    // 예를 들어 버튼 클릭 한 번에 두 개 이상의 state를 동이세 업데이트 한다고 가정 시 자동 배치에서는 이를 하나의 리렌더링으로 묶어서 수행

    // 예제
    import { profiler, useEffect, useState, useCallback} from 'react'

    const sleep = (ms:number) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    export default function App() {
        const [count, setCount] = useState(0)
        const [flag, setFlag] = useState(false)

        const callback = useCallback(
            (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
                console.group(phase)
                console.table({ id, phase, commitTime })
                console.groupEnd()
            },
            [],
        )

        useEffect(() => {
            console.log('rendered!')
        })

        function handleClick() {
            sleep(3000).then(() => {
                setCount((c) => c + 1)
                setFlag((f) => !f)
            })
        }

        return (
            <Profiler id="React18" onRender={callback}>
                <button onClick={handleClick}>Next</button>
                <h1 style={{ color: flag ? 'blue' : 'black' }}>{count}</h1>
            </Profiler>
        )
    }

    // 리액트 17에서는 두 번의 리렌더링이 일어나지만 18에서는 자동 배치로 리렌더링이 한 번만 일어난다
    // Promise를 사용해 고의로 실행을 지연시키는 sleep 함수를 호출하지 않으면 버전과 상관없이 동일하게 한 번만 렌더링된다
    // 리액트 17이하의 과거 버전의 경우 이벤트 핸들러 내부에서는 이러한 자동 배치 작업이 이뤄지고 있었지만 비동기 이벤트에서는 자동 배치가
    // 이뤄지지 않고 있기 때문이다 
    // 즉 동기, 비동기 일관성이 없고 이를 보완하기 위해 리액트 18버전부터는 루트 컴포넌트를 createRoot를 사용해서 만들면 모든 업데이트가 배치 작업으로 최적화된다

    import React from 'react'
    import ReactDOM from 'react-dom/client'
    import App from './App'

    const rootElement = document.getElementById('root')
    const root = ReactDOM.createRoot(rootElement)

    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    )

    // root를 ReactDOM.createRoot를 활용해 렌더링하도록 하면 자동 배치가 활성화되어 리액트가 동기, 비동기, 이벤트 핸들러 등에 관계 없이 렌더링을 배치로 수행

    // 18버전에서 비활성화 하거나 이러한 작동 방식이 기존 코드에 영향을 미칠 것으로 예상된다면 flushSync를 사용하면 된다
    import { flushSync } from 'react-dom'

    function handleClick() {
        flushSync(() => {
            setCounter((c) => c + 1)
        })

        flushSync(() => {
            setFlag((f) => !f)
        })
    }

    // flushSync는 react가 아닌 react-dom에서 제공
}

{
    // 리액트의 엄격 모드
    // 리액트에서 제공하는 컴포넌트 중 하나 리액트 애플리케이션에서 발생할 수도 있는 잠재적인 버그를 찾는 데 도움이 되는 컴포넌트다
    // 리액트에서 널리 알려져 있는 Fragement나 Suspnece와 마찬가지로 컴포넌트 형태로 선언해서 사용할 수 있다

    import { StrictMode } from 'react'
    import { createRoot } from 'react-dom/client'

    const root = createRoot(document.getElementById('root'))

    root.render(
        <StrictMode>
            <App />
        </StrictMode>,
    )

    // 엄격 모드는 개발자 모드에서만 작동
    // 컴포넌트 형태이므로 이 예제처럼 모든 리액트 애플리케이션 전체에서 작동할 수도 원한다면 특정 컴포넌트 내부에서만 작동하게 할 수도 있다
}

{
    // 더 이상 안전하지 않은 특정 생명주기를 사용하는 컴포넌트에 대한 경고
    // componentWillMount, componentWillReceiveProps, componentWillUpdate는 더 이상 사용할 수 없게 되었다
    // 16.3 버전부터는 UNSAFE_가 붙게 됐고 16 이후에서는 UNSAFE_가 붙지 않은 생명주기 메서드를 사용하면 경고 로그가 기록
    // 17 버전부터는 UNSAFE_가 붙은 세 메서드만 남고 나머지는 삭제

    class UnsafeClassComponent extends Component {
        componentWillMount() {
            console.log('componentWillMount')
        }

        render(){
            return <>안녕하세요?</>
        }
    }

    // 엄격 모드로 실행시 경고 로그 발생
}

{
    // 문자열 ref 사용 금지
    // 과거 리액트에서는 레거시 문자열 ref라 해서 createRef가 없어도 컴포넌트 내부에서 문자열로 ref를 생성하고 
    // 이를 사용해 DOM노드를 참조하는 것이 가능했다
    class UnsafeClassComponent extends Component {
        componentDidMount() {
            // 'refs' is deprecated.
            // <input type="text" />
            console.log(this.refs.myInput)
        }

        // myInput이라는 문자열로 ref에 할당
        // 이를 토대로 refs를 바탕으로 DOM에 접근 가능
        return() {
            return (
                <div>
                    <input type="text" ref="myInput" />
                </div>
            )
        }
    }

    // 엄격 모드에서 경고 로그 출력
    // 문자열 ref의 문제점
    // 문자열로 값을 주는 것은 여러 컴포넌트에 걸쳐 사용될 수 있으므로 충돌의 여지가 있다
    // 단순 문자열로만 존재하기 때문에 실재로 어떤 ref에서 참조되고 있는지 파악하기 어렵다
    // 리액트가 계속해서 현재 렌더링되고 있는 컴포넌트의 ref의 값을 추적해야 하기 때문에 성능 이슈가 있다
}

{
    // findDOMNode에 대한 경고 출력
    // 클래스 컴포넌트 인스턴스에서 실제 DOM 요소에 대한 참조를 가져올 수 있는 메서드
    class UnsafeClassComponent extends Component {
        componentDidMount() {
            const node = ReactDOM.findDOMNode(this)

            if(node){
                ;(node as HTMLDivElement).style.color = 'red'
            }
        }

        render() {
            return <div>UnsafeClassComponent</div>
        }
    }

    // findDOMNode() 메서드를 활용해 클래스 컴포넌트의 요소에 직접 접근해 해당 DOM 요소의 스타일 수정 코드

    // findDOMNode의 문제점
    // 부모가 특정 자식만 별도로 렌더링하는 것이 가능해진다 이는 리액트가 추구하는 트리 추상화 구조를 무너뜨린다
    // 이는 자식 컴포넌트의 렌더링을 위해서는 부모 컴포넌트의 렌더링이 일어나야 한다는 리액트의 추상화를 무너뜨린다
    // findDOMNode는 항상 첫 번째 자식을 반환하는데 이는 Fragment를 사용할 때 어색해진다는 문제점이 있다
    // findDOMNode는 일회성 API라는 특징 때문에 자식 컴포넌트가 특정 시점에서 다른 노드를 렌더링할 경우 이러한 변경 사항을 추적할 수 
    // 없다는 문제점이 있다
    // findDOMNode는 항상 변하지 않는 단일 노드를 반환하는 정적인 컴포넌트에만 정상적으로 작동하는 반쪽짜리 메서드다
}

{
    // 구 Context API 사용 시 발생하는 경고
    // childContextTypes와 getChildContext를 사용하는 구 리액트 COntext API를 사용하면 엄격 모드에서 에러 출력
}

{
    // 예상치 못한 부작용(side-effects) 검사
    // 리액트 엄격 모드 내부에서는 다음 내용을 의도적으로 이중으로 호출
    // 클래스 컴포넌트의 constructor, render, shouldComponentUpdate.getDerivedStateFromProps
    // 클래스 컴포넌트의 setState의 첫 번째 인수
    // 함수 컴포넌트의 body
    // useState, useMemo, useReducer에 전달되는 함수

    export default function App () {
        console.log('component body')

        const [number, setNumber] = useState(() => {
            console.log('initialize state')
            return 0
        })

        const handleClick = useCallback(() => {
            setNumber((prev) => prev + 1)
        }, [])

        const tenTimes = useMemo(() => {
            console.log('* 10!')
            return number * 10
        }, [number])

        return <button onClick={handleClick}>{tenTimes} 클릭</button>
    }

    // 위 코드를 실행하면 로그가 두번씩 찍힌다
    // 함수형 프로그래밍의 원칙에 따라 리액트의 모든 컴포넌트는 항상 순수하다고 가정하기 때문에 
    // 엄격 모드에서는 앞에서 언급한 내용이 실제로 지켜지고 있는지 즉 항상 순수한 결과물을 내고 있는지 개발자에게 확인시켜 주기 위해 두 번 실행
    // state, props, context가 변경되지 않으면 (입력 값이 변경되지 않으면) 항상 동일한 JSX를 (항상 같은 결과물을) 반환해야 한다
}

{
    // 리액트 18에서 추가된 엄격 모드
    // 향후 리액트에서는 컴포넌트가 마운트 해제된 상태에서도 컴포넌트 내부의 상태값을 유지할 수 있는 기능을 제공할 예정이라고 밝혔다
    // 예를 들어 뒤로가기 후 현재 화면으로 돌아왔을 때
    // 이러한 기능 지원을 위해 엄격 모드의 개발 모드에 새로운 기능을 도입했다
    // 컴포넌트가 최초에 마운트될 때 자동으로 모든 컴포넌트를 마운트 해제하고 두 번째 마운트에서 이전 상태를 복원한다

    import { useEffect } from 'react'

    let count = 0
    export default function App () {
        useEffect(() => {
            count += 1
            console.log(`mount App, ${count}`)

            return () => {
                console.log(`unmount app ${count}`)
            }
        })

        return <h1>hello</h1>
    }

    // 리액트 18 실행 시
    // mount App, 1
    // unmount app 1
    // mount App, 2

    // 리액트 17 실행 시
    // mount App, 1

    // 이후의 변경을 위해 StrictMode에서 고의로 useEffect를 두 번 작동시키는 내용을 추가
    // 미래에 있을 리액트 업데이트에 대비하려면 useEffect 호출에도 자유로운 컴포넌트를 작성하는 것이 좋다
}

{
    // Suspense 기능 강화
    // Suspense는 리액트 16.6 버전에서 실험 버전으로 도입된 기능 
    // 컴포넌트를 동적으로 가져올 수 있게 도와주는 기능

    // Sample Component
    export default function SampleComponent() {
        return <>동적으로 가져오는 컴포넌트</>
    }

    // app.tsx
    import { Suspense, lazy } from 'react'

    const DynamicSampleComponent = lazy(() => import('./SampleComponent'))

    export default function App() {
        return (
            <Suspense fallback={<>로딩중</>}>
                <DynamicSampleComponent />
            </Suspense>
        )
    }

    // React.lazy
    // 컴포넌트를 첫 번째 렌더링 시에 불러오지 않고 최초 렌더링 이후에 컴포넌트를 지연시켜 불러오는 역할
    // Suspense는 React.lazy를 통해 지연시켜 불러온 컴포넌트를 렌더링하는 역할

    // Suspense는 두 개의 인수를 받는다
    // fallback props
    // 지연시켜 불러온 컴포넌트를 미처 불러오지 못했을 때 보여주는 fallback
    // children 
    // React.lazy로 선언한 지연 컴포넌트를 받는다

    // 상대적으로 중요하지 않은 컴포넌트를 분할해 초기 렌더링 속도를 향상시키는데 많은 도움을 줬다
    // 그러나 18 이전의 Suspense에는 몇 가지 문제점이 있다
    // 기존의 Suspense는 컴포넌트가 아직 보이기도 전에 useEffect가 실행되는 문제가 존재
    function ProfilePage() {
        // initialResource는 Promise로 데이터를 불러오는 데 어느 정도 시간이 필요함
        const [resource, setResource] = useState(initialResource)

        return (
            <>
                <Suspense
                    fallback={
                        <>
                            <h1>Loading profile...</h1>
                        </>
                    }
                >
                    <Suspense fallback={<h1>Loading posts...</h1>}>
                        <Sibling name="two" />
                        <ProfilerTimeline resource={resource} />
                    </Suspense>
                </Suspense>
            </>
        )
    }

    // 개발자의 의도응 비동기 데이터 로딩이 끝나기 전까지는 <Suspense> 하단의 컴포넌트가 렌더링되지 않게 하는 것이다
    // <Suspense>의 자식으로 존재하는 <Sibling>은 비록 비동기 데이터에 의존하지 않지만 Suspense의 자식으로 존재하므로 반드시 Suspense의 
    // fallback이 종료된 이후에 effect가 실행돼야만 했다
    // 이는 UI 상으로는 문제가 없었지만 실제 useEffect나 useLayoutEffect 등으로 보면 아직 <Suspense>작업이 진행 중임에도 불구하고 <Sibling>
    // 의 effect가 실행되는 버그가 있었다

    // Suspense는 서버에서 사용할 수 없었다

    // components/SampleComponent.tsx
    export default function SampleComponent() {
        return <>동적으로 가져오는 컴포넌트</>
    }

    // pages/index.tsx
    import { Suspense, lazy } from 'react'

    const DynamicSampleComponent = lazy(
        () => import('../components/SampleComponent'),
    )

    export default function Home() {
        return (
            <Suspense fallback={<>로딩중</>}>
                <DynamicSampleComponent />
            </Suspense>
        )
    }

    // 이 코드는 Next.js에서 Suspense를 사용하는 코드다 
    // 실행 시 에러 발생
    // 기존 서버 사이드 렌더링 구조에서 Suspense를 활용하려면 useMount와 같은 훅을 구현해서 반드시 클라이언트에서만 작동하도록 처리해야 했다

    import { Suspense, useEffect, useState, ComponentProps } from 'react'

    function useMounted(){
        const [mounted, setMounted] = useState(false)

        // useEffect는 클라이언트에서만 실행되므로 mounted가 true면
        // 클라이언트에서 실행되는 코드다
        useEffect(() => {
            setMounted(true)
        }, [])

        return mounted
    }

    export default function CustomSuspense(
        props: ComponentProps<typeof Suspense>,
    ){
        const isMounted = useMounted()

        if(isMounted){
            return <Suspense {...props} ></Suspense>
        }

        return <>{props.fallback}</>
    }
    
    // 이제 리액트 18버전에서도 지원된다
    // 변경 내용
    // 마운트되기 직전임에도 effect가 빠르게 실행되는 문제 수정
    // Suspense로 인해 컴포넌트가 보이거나 사라질 때도 effect가 정상적으로 실행
    // Suspense를 서버에서도 사용 가능
    // Suspense내에 스로틀링 추가 화면이 너무 자주 업데이트되어 시각적으로 방해받는 것을 방지하기 위해 리액트는 다음 렌더링을 보여주기 전에 잠시 대기
    // 중첩된 Suspense의 fallback이 있다면 자동으로 스로틀되어 최대한 자연스럽게 보여주기 위해 노력한다

    // Suspense를 사용할 수 있는 시나리오는 제한적인 편이다 
    // React.lazy를 사용해 지연시켜 컴포넌트를 불러오거나 Next.js와 같이 Suspense를 자체적으로 지원하는 프레임워크에서만 Suspense를 사용하는것이 가능
}

{
    // 인터넷 익스플로러 지원 중다네 따른 추가 폴리필 필요
    // 이제 리액트는 리액트를 사용하는 코드에서 다음과 같은 최신 자바스크립트 기능을 사용할 수 있다는 가정하에 배포
    // Promise: 비동기 연산이 종료된 이후에 실패 또는 결곽값을 확인할 수 있는 객체
    // Symbol: 자바스크립트의 새로운 데이터 형식 익명으로 객체 속성을 만들 수 있는 특성을 가진 객체
    // Object.assign: 객체의 열거 가능한 모든 속성을 다른 객체로 붙여 넣는 메서드
}

{
    // 그 밖에
    // 컴포넌트에서 undefined를 반환해도 에러가 발생하지 않는다 undefined 반환은 null 반환과 동일하게 처리
    // 이와 마찬가지로 <Suspense fallback={undeined}>도 null과 동일하게 처리
    // renderToNodeStream이 지원 중단 그 대신 renderToPipeableStream을 사용하는 것이 권장
}

