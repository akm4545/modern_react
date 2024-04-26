{
    // 비교적 오랜 기간 리액트의 상태 관리는 리덕스에 의존
    // 과거 리액트 코드는 리액트와 리덕스가 함께 설치돼 있는 것을 흔히 볼 수 있음
    // 마치 하나의 프레임워크 내지는 업계 표준(de facto)로 여기기도 함
    // 현재는 새로운 Context API, useReducer, useState의 드장으로 컴포넌트에 걸쳐서 재사용하거나 혹은 컴포넌트 내부에 걸쳐서
    // 상태를 관리할 수 있는 방법들이 점차 등장
    // 다른 라이브러리를 선택하는 경우도 많아지고 있다
}

{
    // 가장 기본적인 방법: useState와 useReducer
    // useState의 등장으로 리액트에서는 여러 컴포넌트에 걸쳐 손쉽게 동일한 인터페이스의 상태를 생성하고 관리할 수 있게 됨

    // useCounter 훅 예제
    // 외부 숫자 혹은 0을 초깃값으로 상태 관리
    // inc 함수로 1씩 증가시킬 수 있게 구현
    // 상태값인 counter와 inc 함수를 객체로 반환
    function useCounter(initCount: number = 0){
        const [counter, setCounter] = useState(initCount)

        function inc(){
            setCounter((prev) => prev + 1)
        }

        return { counter, inc }
    }

    // useCounter를 사용하는 함수 컴포넌트는 이 훅을 사용해 각자의 counter 변수를 관리 
    // 중복 로직 없이 숫자를 1씩 증가시키는 기능을 손쉽게 사용 가능
    // useCounter 훅이 없다면 각각의 컴포넌트에서 직접 useCounter 기능을 구련해야함
    // 상태가 복잡하거나 변경할 수 있느 시나리오가 다양해지면 훅으로 코드를 격리해 제공할 수 있다는 장점이 더욱 크게 드러남
    // 리액트 훅을 기반으로 만든 사용자 정의 훅은 함수 컴포넌트라면 어디서든 손쉽게 재사용 가능
    function Counter1() {
        const { counter, inc } = useCounter()

        return (
            <>
                <h3>Counter1: {counter}</h3>
                <button onClick={inc}>+</button>
            </>
        )
    }

    function Counter2() {
        const { counter, inc } = useCounter()

        return (
            <>
                <h3>Counter2: {counter}</h3>
                <button onClick={inc}>+</button>
            </>
        )
    }
}

{
    // useState와 비슷한 훅인 useReducer또한 지역 상태를 관리할 수 있는 훅
    // useState와 useReducer가 상태 관리의 모든 필요성과 문제를 해결해 주지는 않는다
    // 두 훅을 기반으로 하는 사용자 지정 훅은 사용할때마다 컴포넌트별로 초기화되므로 
    // 컴포넌트에 따라 서로 다른 상태를 가질 수밖에 없다
    // 컴포넌틉ㄹ로 상태의 파편화를 만들어 버린다
    // 이렇게 기본적인 useState를 기반으로 한 상태를 지역 상태(local state)라고 하며 이 지역 상태는 해당 컴포넌트 내에서만 유효하다는 한계가 있다
}

{
    // useCounter에서 제공하는 counter를 올리는 함수는 지금처럼 동일하게 사용
    // 두 컴포넌트가 동일한 counter 상태를 바라보게 하기 예제

    // 상태를 컴포넌트 밖으로 한 단계 끌어올리는 방법
    function Counter1({ counter, inc }: { counter: number; inc: () => void }){
        return (
            <>
                <h3>Counter1: {counter}</h3>
                <button onClick={inc}>+</button>
            </>
        )
    }

    function Counter2({ counter, inc }: { counter: number; inc: () => void }){
        return (
            <>
                <h3>Counter2: {counter}</h3>
                <button onClick={inc}>+</button>
            </>
        )
    }

    // 지역 상태인 useCounter를 부모 컴포넌트로 한 단계 끌어올린 다음 
    // 하위 컴포넌트에서 참조해 재사용하게끔 만듦
    // props 형태로 필요한 컴포넌트에 제공해야 한다는 단점이 생김
    function Parent() {
        const { counter, inc } = useCounter()

        return (
            <>
                <Counter1 counter={counter} inc={inc} />
                <Counter2 counter={counter} inc={inc} />
            </>
        )
    }

    // useState와 useReducer, 사용자 지정 훅을 활용한 지역 상태 관리는 지역 상태라는 한계 때문에 여러 컴포넌트에 걸쳐 
    // 공유하기 위해서는 컴포넌트 트리를 재설계하는 등의 수고로움이 필요하다
}

{
    // 지역 상태의 한계를 벗어나기: useState의 상태를 바깥으로 분리하기

    // useState가 리액트 클로저가 아닌 어딘가에서 해당 값을 업데이트 하고 해당 객체의 값을 공유해서 사용
    // 예제

    // counter.ts
    export type State = { counter: number }

    //상태를 아예 컴포넌트 밖에 선언 각 컴포넌트가 이 상태를 바라보게 할 것이다
    let state: State = {
        counter: 0,
    }

    //getter
    export function get(): State {
        return state
    }

    // useState와 동일하게 구현하기 위해 게으른 초기화 함수나 값을 받을 수 있게 했다
    type Initializer<T> = T extends any ? T | ((prev: T) => T) : never

    // setter 
    export function set<T>(nextState: Initializer<T>){
        state = typeof nextState === 'function' ? nextState(state) : nextState
    }

    // Counter 
    function Counter() {
        const state = get()

        function handleClick() {
            set((prev: State) => ({ counter: prev.counter + 1 }))
        }

        return (
            <>
                <h3>{state.counter}</h3>
                <button onClick={handleClick}>+</button>
            </>
        )
    }

    // 언뜻 보면 작동할 것 같지만 리액트 환경에서 작동하지 않는다
    // 코드에 문제는 없지만 컴포넌트의 리렌더링이 발생하지 않는다
    // 위 코드에는 리렌더링을 일으키는 장치가 어디에도 존재하지 않는다
}

{
    // useState의 인수로 컴포넌트 밖에서 선언한 state를 넘겨주는 방식으로 코드 변경
    function Counter1() {
        const [count, setCount] = useState(state)

        function handleClick() {
            // 외부에서 선언한 set 함수 내부에서 다음 상태값을 연산한 다음
            // 그 값을 로컬 상태값에도 넣었다
            set((prev: State) => {
                const newState = { counter: prev.counter + 1 }

                //setCount가 호출되면서 컴포넌트 리렌더링을 야기한다
                setCount(newState)
                return newState
            })
        }

        return (
            <>
                <h3>{count.counter}</3>
                <button onClick={handleClick}>+</button>
            </>
        )
    }

    function Counter2() {
        const [count, setCount] = useState(state)

        // 위 컴포넌트와 동일한 작동을 추가
        function handleClick(){
            set((prev: State) => {
                const newState = { counter: prev.counter + 1 }
                setCount(newState)
                return newState
            })
        }

        return (
            <>
                <h3>{count.counter}</h3>
                <button onClick={handleClick}>+</button>
            </>
        )
    }

    // useState의 두 번째 인수로 업데이트 하는 것은 해당 지역 상태에만 영향을 미치기 때문에 여기서는 외부의 상태값 또한 업데이트 하도록 수정
    // useState의 두 번째 인수도 실행한다면 리액트 컴포넌트는 렌더링될 것이고 계속해서 외부의 값을 안정적으로 참조 가능

    // 해당 방법은 비효율적이고 문제도 존재
    // 외부에 상태가 있음에도 불구하고 함수 컴포넌트의 렌더링을 위해 함수의 내부에 동일한 상태를 관리하는 useState가 존재하는 구조
    // 이는 상태를 중복해서 괸리하므로 비효율적인 방식

    // 버튼을 누르면 원하는 값을 안정적으로 렌더링하지만 같은 상태를 바라봐야 하는 반대쪽 컴포넌트에서는 렌더링 되지 않는다
    // 상태를 공유하지만 동시에 렌더링되지 않는다

    // useState로 컴포넌트의 리렌더링을 실행해 최신값을 가져오는 방법은 어디까지나 해당 컴포넌트 자체에서만 유효한 전략
    // 반대쪽의 다른 컴포넌트에서는 여전히 상태의 변화에 따른 리렌더링을 일으킬 무언가가 없기 때문에 클릭 이벤트가 발생하지 않는
    // 다른 쪽은 여전히 렌더링이 되지 않는다
}

{
    // 함수 외부의 상태를 참조하고 이를 통해 렌더링까지 자연스럽게 일어나는 조건
    // 1. window나 global에 있어야 할 필요는 없지만 컴포넌트 외부 어딘가에 상태를 두고 여러 컴포넌트가 같이 쓸 수 있어야 한다
    // 2. 이 외부에 있는 상태를 사용하는 컴포넌트는 상태의 변화를 알아챌 수 있어야 하고 상태가 변화될 때마다 리렌더링이 일어나서 
    // 컴포넌트를 최신 상태값 기준으로 렌더링해야 한다. 이 상태 감지는 상태를 변경시키는 컴포넌트뿐만 아니라 상태를 참조하는 모든 컴포넌트에서
    // 동일하게 작동해야 한다
    // 3. 상태가 원시값이 아닌 객체인 경우에 그 객체에 내가 감지하지 않는 값이 변한다 하더라도 리렌더링이 발생해서는 안된다
    // 예를 들어 {a: 1, b: 2}라는 상태가 있으며 어느 컴포넌트에서 a를 2로 업데이트했다면 이러한 객체값의 변화가 단순히 b 값을 참조하는
    // 컴포넌트에서는 리렌더링을 일으켜서는 안된다
}

{
    // 위의 조건을 만족하는 코드 
    // 상태는 객체, 값 모두 허용이므로 범용적인 이름인 store로 정의 
    // 2번의 조건을 만족하기 위해서는 store의 값이 변경될 때마다 변경됐음을 알리는 callback 함수 실행
    // callback을 등록할 수 있는 subscribe 함수 필요

    // store의 뼈대 
    type Initializer<T> = T extends any ? T | ((prev: T) => T) : never

    type Store<State> = {
        // 항상 최신값을 가져와야 하므로 함수
        // 변수 대신 함수로 만들어두면 항상 새롭게 값을 가져오기 위해 시도
        get: () => State
        // useState와 동일하게 값 또는 함수를 받을 수 있도록
        set: (action: Initializer<State>) => State
        // store의 변경을 감지하고 싶은 컴포넌트들이 자신의 callback 함수를 등록해 두는곳
        // store는 값이 변경될 때마다 자신에게 등록된 모든 callback을 실행하게 할 것이다
        // 이 스토어를 참조하는 컴포넌트는 subscribe에 컴포넌트 자기 자신을 렌더링하는 코드를 추가해서 컴포넌트가 리렌더링을
        // 실행할 수 있게 만들것이다
        subscribe: (callback: () => void) => () => void
    }
}

{
    // Store<State> 함수 실 작성
    export const createStore = <State extends unknown> (
        initialState: Initializer<State>,
    ): Store<State> => {
        // useState와 마찬가지로 초깃값을 게으른 초기화를 위한 함수 또한
        // 그냥 값을 받을 수 있도록 한다
        // state의 값은 스토어 내부에서 보관해야 하므로 변수로 선언한다
        let state = typeof initialState !== 'function' ? initialState : initialState()

        // callbacks는 자료형에 관계없이 유일한 값을 저장할 수 있는 Set을 사용한다
        const callbacks = new Set<() => void>()

        // 언제든 get이 호출되면 최신값을 가져올 수 있도록 함수로 만든다
        const get = () => state

        const set = (nextState: State | ((prev: State) => State)) => {
            // 인수가 함수라면 함수를 실행해 새로운 값을 받고
            // 아니라면 새로운 값을 그대로 사용
            state =
                typeof nextState === 'function'
                    ? (nextState as (prev: State) => State)(state)
                    : nextState

            // 값의 설정이 발생하면 콜백 목록을 순회하면서 모든 콜백을 실행한다
            callbacks.forEach((callback) => callback())

            return state
        }

        // subscribe는 콜백을 인수로 받는다
        const subscribe = (callback: () => void) => {
            // 받은 함수를 콜백 목록에 추가한다
            callbacks.add(callback)

            // 클린업 실행 시 이를 삭제해서 반복적으로 추가되는 것을 막는다
            return () => {
                callbacks.delete(callback)
            }
        }

        return { get, set, subscribe }
    }
}
