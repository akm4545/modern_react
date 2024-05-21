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

