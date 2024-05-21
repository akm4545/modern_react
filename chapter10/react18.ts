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
