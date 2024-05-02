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

{
    // createStore로 만들어지 store의 값을 참조하고 이 값의 변화에 따라 렌더링을 유도할 사용자 정의 훅

    // 훅의 인수로 사용할 store를 받음
    export const useStore = <State extends unknown>(store: Store<State>) => {
        // store.get()을 호출해 스토어의 초깃값으로 useState를 만듦
        const [state, setState] = useState<State>(() => store.get())

        // store가 변할때 마다 setState를 실행하는 코드를 subscribe에 등록
        // 클린업 함수로 unsubscribe 함수 반환
        // useEffect의 작동이 끝난 이후에는 해당 함수를 제거해 callback이 계속 쌓이는 현상 방지
        useEffect(() => {
            const unsubscribe = store.subscribe(() => {
                setState(store.get())
            })

            return unsubscribe
        }, [store])

        return [state, store.set] as const
    }
}

{
    // 위의 훅을 사용하는 코드
    const store = createStore({ count: 0 })

    function Counter1() {
        const [state, setState] = useStore(store)

        function handleClick() {
            setState((prev) => ({ count: prev.count + 1 }))
        }

        return (
            <>
                <h3>Counter1: {state.count}</h3>
                <button onClick={handleClick}>+</button>
            </>
        )
    }

    function Counter2() {
        const [state, setState] = useStore(store)

        function handleClick() {
            setState((prev) => ({ count: prev.count + 1 }))
        }

        return (
            <>
                <h3>Counter2: {state.count}</h3>
                <button onClick={handleClick}>+</button>
            </>
        )
    }

    export default function App() {
        return (
            <div className="App">
                <Counter1 />
                <Counter2 />
            </div>
        )
    }

    // 이 훅의 경우 원시값이라면 상관없지만 객체라면 객체에서 일부값이 변경될때
    // store의 값이 바뀌면 무조건 useState를 실행하므로 어떤 값이 바뀌든지 간에 리렌더링이 발생하게 된다
}

{
    // 위의 문제점을 해결한 코드
    // useStore를 기반으로 만들어졌지만 두 번째 인수로 selector라는 함수를 받는다
    // 이 함수는 store의 상태에서 어떤 값을 가져올지 정의하는 함수
    // 이 함수를 활용해 store.get()을 수행
    // useState는 값이 변경되지 않으면 리렌더링을 수행하지 않으므로 store의 값이 변경됐다 하더라도
    // selector(store.get())이 변경되지 않는다면 리렌더링 x
    export const useStoreSelector = <State extends unknown, Value extends unknown> (
        store: Store<State>,
        selector: (state: State) => Value,
    ) => {
        const [state, setState] = useState(() => selector(store.get()))

        useEffect(() => {
            const unsubscribe = store.subscribe(() => {
                const value = selector(store.get())
                setState(value)
            })

            return unsubscribe
        }, [store, selector])

        return state
    }
}

{
    // useStoreSelector 훅 사용 예제
    const store = createStore({ count: 0, text: 'hi' })

    function Counter(){
        const counter = useStoreSelector(
            store,
            // selector로 state의 count를 조회하는 함수 전달
            // 즉 useStoreSelector 훅에서 store.get() 의 결과물이 아래 useCallback 함수의 state로 들어감
            useCallback((state) => state.count, []),
        )

        function handleClick() {
            // 객체 복사
            store.set((prev) => ({ ...prev, count: prev.count + 1 }))
        }

        useEffect(() => {
            console.log('Counter Rendered')
        })

        return (
            <>
                <h3>{counter}</h3>
                <button onClick={handleClick}>+</button>
            </>
        )
    }

    const textSelector = (state: ReturnType<typeof store.get>) => state.text

    function TextEditor() {
        const text = useStoreSelector(store, textSelector)

        useEffect(() => {
            console.log('TextEditor Rendered')
        })

        function handleChange(e: ChangeEvent<HTMLInputElement>) {
            store.set((prev) => ({ ...prev, text: e.target.value }))
        }

        return (
            <>
                <h3>{text}</h3>
                <input value={text} onChange={handleChange} />
            </>
        )
    }

    // selector를 컴포넌트 밖에 선언하거나 아니면 useCallback을 사용해 참조를 고정해야 한다
    // 리렌더링시 함수가 계속 재생성되어 store의 subscribe를 반복정으로 수행하기 떄문
}

{
    // 이러한 방식으로 구현된 훅이 페이스북 팀에서 만든 useSubscription이다
    function NewCounter() {
        const subscription = useMemo(
            () => ({
                // 스토어의 모든 값으로 설정해 뒀지만 selector 예제와 마찬가지로
                // 특정한 값에서만 가져오는 것도 가능하다
                getCurrentValue: () => store.get(),
                subscribe: (callback: () => void) => {
                    const unsubscribe = store.subscribe(callback)
                    return () => unsubscribe()
                },
            }),
            [],
        )

        const value = useSubscription(subscription)

        return <>{JSON.stringify(value)}</>
    }
}

{
    // 타입스크립트로 흉내 낸 useSubscription
    import {useDebugValue, useEffect, useState} from 'react'

    export function useSubscription<Value>({
        getCurrentValue,
        subscribe,
    }: {
        getCurrentValue: () => Value,
        subscribe: (callback: Function) => () => void
    }): Value {
        // 현재값을 가져오는 함수, subscribe, 그리고 현재값을 모두 한꺼번에
        // 객체로 저장해 준다
        const [state, setState] = useState(() => ({
            getCurrentValue,
            subscribe,
            value: getCurrentValue(),
        }))

        // 현재 가져올 값을 따로 변수에 저장해 둔다
        let valueToReturn = state.value

        // useState에 저장돼 있는 최신값을 가져오는 함수 getCurrentValue와
        // 함수의 인수로 받은 getCurrentValue가 다르거나 
        // useState에 저장돼 있는 subscribe와 함수의 인수로 받은 subscribe가 다르면
        if(
            state.getCurrentValue !== getCurrentValue ||
            state.subscribe !== subscribe
        ) {
            // 어디선가 두 함수의 참조가 바뀐 것이므로 이 바뀐 참조를 존중해
            // 반환 예정인 현재값을 함수의 인수의 getter로 다시 실행
            valueToReturn = getCurrentValue()

            // 참조가 변경됐으므로 이 값을 일괄 업데이트한다
            setState({
                getCurrentValue,
                subscribe,
                value: valueToReturn
            })
        }

        // 디버깅을 위해 현재 반환할 값을 리액트 개발자 모드로 기록
        useDebugValue(valueToReturn)

        // useEffect 실행 시 위에서 실행된 if문 덕분에 getCurrentValue와
        // subscribe의 참조를 최신 상태로 유지

        // 이 두 함수를 의존성으로 두고 다음 useEffect 실행
        useEffect(() => {
            // subscribe가 취소됐는지 여부
            let didUnsubscribe = false

            // 값의 업데이트가 일어났는지 확인하는 함수
            const checkForUpdates = () => {
                // 이미 subscribe가 취소됐다면 아무것도 하지 않는다
                if (didUnsubscribe){
                    return
                }

                // 현재 값을 가져온다
                const value = getCurrentValue()

                // useSubscription을 사용하는 컴포넌트의 렌더링을 일으키는 코드
                setState((prevState) => {
                    // 이전과 비교해 단순히 함수의 차이만 존재한다면 이전 값을 반환
                    if(
                        prevState.getCurrentValue !== getCurrentValue ||
                        prevState.subscribe !== subscribe
                    ){
                        return prevState
                    }

                    // 이전 값과 현재 값이 같다면 이전 값을 반환
                    if(prevState.value === value) {
                        return prevState
                    }

                    // 이전 prevState와 현재 값을 합성해 새로운 객체를 만들고 렌더링을 일으킨다
                    return { ...prevState, value}
                })
            }

            // 콜백 목록에 변경 여부를 체크하는 함수를 등록한다
            const unsubscribe = subscribe(checkForUpdates)

            checkForUpdates()

            return () => {
                didUnsubscribe = true
                unsubscribe()
            }
        }, [getCurrentValue, subscribe])

        return valueToReturn
    }
}

{
    // useState 와 Context 동시 사용
    // useStore, useStoreSelector 훅을 활용해 useState로 관리하지 않는 외부 상태값을 읽어오고 리렌더링까지 일으켜서
    // 마치 상태 관리 라이브러리처럼 사용하는 훅에도 한가지 단점이 있다
    // 반드시 하나의 스토어만 가지게 된다
    // 하나의 스토어는 전역 변수처럼 작동하게 되어 동일한 형태의 여러 개의 스토어를 가질 수 없게 된다
}

{
    // createStore를 이용해 동일한 타입으로 스토어를 여러 개 만드는 예제

    // 이 방법은 완벽하지도 않고 매우 번거롭다
    // 필요시 마다 생성해야 하고 훅은 스토어에 의존적인 1:1 관계를 맺고 있으므로 스토어를 만들 때마다 해당 스토어에 
    // 의존적인 useStore와 같은 훅을 동일한 개수로 생성해야 한다
    // 훅을 하나씩 만들었다 하더라도 이 훅이 어느 스토어에서 사용 가능한지 가늠하려면 오직 훅의 이름이나 
    // 스토어의 이름에 의지해야 한다는 어려움이 있다
    const store1 = createStore({ count: 0 })
    const store2 = createStore({ count: 0 })
    const store3 = createStore({ count: 0 })
    // ...
}

{
    // 이 문제를 해결하는 좋은 방법은 Context를 활용하는 것이다
    // Context를 활용해 해당 스토어를 하위 컴포넌트에 주입한다면 컴포넌트에서는 자신이 주입된 스토어에서만 접근할 수 있게 된다
    
    // 예제
    // Context를 생성하면 자동으로 스토어도 함께 생성
    
    // 어떤 Context를 만들지 타입과 함께 정의
    export const CounterStoreContext = createContext<Store<CounterStore>>(
        createStore<CounterStore>({ count: 0, text: 'hello' }),
    )

    // 정의된 Context를 사용하기 위해 CounterStoreProvider를 정의
    export const CounterStoreProvider = ({
        initialState,
        children,
    }: PropsWithChildren<{
        initialState: CounterStore
    }>) => {
        // storeRef를 사용해서 스토어 제공
        // Provider로 넘기는 props가 불필요하게 변경돼서 리렌더링 되는것을 막기 위함
        // useRef를 사용했기 때문에 최초 렌더링에서만 스토어를 만들어서 값을 내려주게 된다
        const storeRef = useRef<Store<CounterStore>>()

        // 스토어를 생성한 적이 없다면 최초에 한 번 생성
        if(!storeRef.current){
            storeRef.current = createStore(initialState)
        }

        return (
            <CounterStoreContext.Provider value={storeRef.current}>
                {children}
            </CounterStore.Provider>
        )
    }
}

{
    // Context에서 내려주는 값을 사용하기 위해서는 useStore나 useStoreSelector 대신에 다른 접근이 필요
    // 기존의 두 훅은 스토어에 직접 접근 방식이지만 이제 Context에서 제공하는 스토어에 접근해야 하기 떄문
    // useContext를 사용해 스토어에 접근할 수 있는 새로운 훅이 필요
    export const useCounterContextSelector = <State extends unknown>(
        selector: (state: CounterStore) => state,
    ) => {
        // 스토어 접근을 위해 useContext 사용
        // 즉 스토어에서 값을 찾는 것이 아니라 Context.Provider에서 제공된 스토어를 찾게 만든다
        const store = useContext(CounterStoreContext)

        // useStoreSelector를 사용해도 동일하다
        // 리액트에서 제공하는 useSubscription 사용 
        const subscription = useSubscription(
            useMemo(
                () => ({
                    getCurrentValue: () => selector(store.get())
                    subscription: store.subscribe,
                }),
                [store, selector],
            ),
        )

        return [subscription, store.set] as const
    }
}

{
    // 새로 만든 훅과 Context를 사용하는 예제
    const ContextCounter = () => {
        const id = useId()

        const [counter, setStore] = useCounterContextSelector(
            useCallback((state: CounterStore) => state.count, []),
        )

        function handleClick() {
            setStore((prev) => ({ ...prev, count: prev.count + 1 }))
        }

        useEffect(() => {
            console.log(`${id} Counter Rendered`)
        })

        return (
            <div>
                {counter} <button onClick={handleClick}>+</button>
            </div>
        )
    }

    const ContextInput = () => {
        const id = useId()
        const [text, setStore] = useCounterContextSelector(
            useCallback((state: CounterStore) => state.text, []),
        )

        function handleChange(e: ChangeEvent<HTMLInputElement>){
            setStore((prev) => ({ ...prev, text: e.target.value }))
        }

        useEffect(() => {
            console.log(`${id} Counter Rendered`)
        })

        return(
            <div>
                <input value={text} onChange={handleChange} />
            </div>
        )
    }

    export default function App() {
        return (
            <>
                // 0
                <ContextCounter />
                //hi
                <ContextInput />
                <CounterStoreProvider initialState={{ count: 10, text: 'hello' }}>
                    // 10
                    <ContextCounter />
                    // hello
                    <ContextInput />
                    <CounterStoreProvider initialState={{ count: 20, text: 'welcome' }}>
                        // 20
                        <ContextCounter />
                        // welcome
                        <ContextInput />
                    </CounterStoreProvider>
                </CounterStoreProvider>
            </>
        )
    }

    // 컴포넌트 트리 최상에 있는 ContextCounter와 ContextInput 은 부모에 CounterStoreProvider 가 존재하지 않아도 각각 초깃값을 가져옴
    // 앞서 CounterStoreContext를 만들 때 초깃값으로 인수를 넘겨줬는데 이 인수는 Provider가 없을 경우 사용하게 된다
    // 즉 Provider가 없는 상황에서는 앞선 스토어 예제와 마찬가지로 전역 생성 스토어를 바라보게 된다

    // 두 번째 ContextCounter와 ContextInput은 count: 10, text: 'hello'로 초기화된 CounterStoreProvider 내부에 있다

    // 세 번째 ContextCounter와 ContextInput은 Provider를 하나 더 가지고 있는데 이 Provider는 count: 20, text: 'welcome'으로 초기화돼있다
    // Context는 가장 가까운 Provider를 참조

    // 이렇게 작성한 코드로 인해 스토어를 사용하는 컴포넌트는 해당 상태가 어느 스토어에서 온 상태인지 신경 쓰지 않아도 된다
    // 단지 해당 스토어를 기반으로 어떤 값을 보여줄지만 고민하면 되므로 좀 더 편리하게 코드를 작성할 수 있다
    // Context와 Provider를 관리하는 부모 컴포넌트의 입장에서는 자신이 자식 컴포넌트에 따라 보여주고 싶은 데이터를 Context로 잘 격리하기만
    // 하면 된다
    // 이처럼 부모, 자식 컴포넌트의 책임과 역할을 이름이 아닌 명시적인 코드로 나눌 수 있어 코드 작성이 한결 용이해진다
}

{
    // 현재 리액트 생태계에는 많은 상태 관리 라이브러리가 있지만 이것들이 작동하는 방식은 다음과 같다
    // useState, useReducer가 가지고 있는 한계, 컴포넌트 내부에서만 사용할 수 있는 지역 상태라는 점을 극복하기 위해
    // 외부 어딘가에 상태를 둔다 이는 컴포넌트 최상단 내지는 상태가 필요한 부모가 될 수도 있고 격리된 자바스크립트 스코프 어딘가일 수도있다
    // 이 외부의 상태 변경을 각자의 방식으로 감지해 컴포넌트의 렌더링을 일으킨다
}

{
    // 상태관리 라이브러리 Recoil, Jotai, Zustand
    // Recoil, Jotai = Context와 Provider 그리고 훅을 기반으로 가능한 작은 상태를 효율적으로 관리하는 데 초점
    // Zustand = 리덕스와 비슷하게 하나의 큰 스토어를 기반으로 상태를 관리하는 라이브러리 해당 스토어의 상태변경 시 구독하고 있는 컴포넌트에 전파해 리렌더링
}

{
    // 페이스북에서 만든 상태 관리 라이브러리 Recoil
    // 리액트에서 훅의 개념으로 상태 관리를 시작한 최초의 라이브러리 중 하나
    // 최소 상태 개념인 Atom을 사용
    // Recoil은 1.0.0이 릴리스 되지 않아 실제 프로덕션에 사용하기에는 안정성, 성능, 사용성 등을 보장할 수 없다
    // 버전 변경으로 인해 호환성이 깨질수도 있다
    // Recoil 0.7.5 버전 기준 설명
}

{
    // RecoilRoot
    // Recoil을 사용하기 위해서는 RecoilRoot를 애플리케이션의 최상단에 선언해 둬야 한다
    export default function App() {
        return <RecoilRoot>some components</RecoilRoot>
    }
}

{
    // RecoilRoot 코드
    // RecoilRoot에서 Recoil에서 생성되는 상태값을 저장하기 위한 스토어를 생성
    function RecoilRoot(props: Props): React.Node {
        const {override, ...PropsExceptOverride} = props

        // useStoreRef로 ancestorStoreRef의 존재를 확인
        // ancestorStoreRef = Recoil에서 생성되는 atom과 같은 상태값을 저장하는 스토어를 의미
        // useStoreRef가 가리키는 것은 AppContext가 가지고 있는 스토어
        const ancestorStoreRef = useStoreRef()

        if(override === false && ancestorStoreRef.current !== defaultStore){
            // If ancestorStoreRef.current !== defaultStore, it mean that this
            // RecoilRoot is not nested within another.
            return props.children
        }

        return <RecoilRoot_INTERNAL {...propsExceptOverride}><RecoilRoot_INTERNAL/>
    }
}

{
    // useStoreRef 코드
    const AppContext = React.createContext<StoreRef>({ current: defaultStore })
    const useStoreRef = (): StoreRef => useContext(AppContext)
}

{
    // 스토어의 기본값을 의미하는 defaultStore 
    function notInAContext() {
        throw err('This component must be used inside a <RecoilRoot> component.')
    }

    // 스토어 아이디를 제외하고 에러로 처리
    // RecoilRoot로 감싸지 않은 컴포넌트에서는 스토어에 접근할 수 없다
    const defaultStore: Store = Object.freeze({
        // 스토어의 아이디 값을 가져오는 함수
        storeID: getNextStoreID(),
        // 스토어의 값을 가져오는 함수
        getState: notInAContext,
        // 값을 수정하는 함수
        replaceState: notInAContext,
        getGraph: notInAContext,
        subscribeToTransactions: notInAContext,
        addTransactionMetadata: notInAContext,
    })
}

{
    // replaceState 코드
    const replaceState = (replacer: (TreeState) => TreeState) => {
        startNextTreeIfNeeded(storeRef.current)

        // Use replacer to get the next state:
        const nextTree = nullthrows(storeStateRef.current.nextTree)
        let replaced

        try{
            stateReplacerIsBeingExecuted = true
            replaced = replacer(nextTree)
        } finally {
            stateReplacerIsBeingExecuted = false
        }

        if(replaced === nextTree){
            return
        }

        // ...생략

        // Save changes to nextTree and schedule a React update:
        storeStateRef.current.nextTree = replaced

        if(reactMode().early){
            // 상태가 변할 때 변경된 상태를 하위 컴포넌트로 전파해 리렌더링을 일으키는 notifyComponent
            notifyComponents(storeRef.current, storeStateRef.current, replaced)
        }
    }
}

{
    // notifyComponents 구조
    // store, 상태를 전파할 storeState를 인수로 받는다
    function notifyComponents(
        store: Store,
        storeState: StoreState,
        treeState: TreeState, 
    ): void {
        // 해당 스토어를 사용하고 있는 하위 의존성 검색
        const dependentNodes = getDownstreamNodes(
            store,
            treeState,
            treeState,dirtyAtoms,
        )

        // 콜백 실행
        for(const key of dependentNodes){
            const comps = storeState.nodeToComponentSubscriptions.get(key)

            if(comps){
                for (const [_subId, [_debugName, callback]] of comps){
                    callback(treeState)
                }
            }
        }
    }   

    // Recoil의 상태값은 RecoilRoot로 생성된 Context의 스토어에 저장
    // 스토어의 상태값에 접근할 수 있는 함수들이 있으며 이 함수를 활용해 상태값에 접근하거나 상태값을 변경
    // 값의 변경이 발생하면 이를 참조하는 하위 컴포넌트에 알림
}

{
    // atom
    // Recoil의 최소 상태 단위
    // atom 구조 선언
    type Statement = {
        name: string,
        amount: number
    }

    const InitialStatements: Array<Statement> = [
        { name: '과자', amount: -500 },
        { name: '용돈', amount: 10000 },
        { name: '네이버페이충전', amount: -5000 },
    ]

    // Atom 선언
    const statementAtom = atom<Array<Statement>>({
        key: 'statements',
        defualt: InitialStatements,
    })

    // atom은 key 값을 필수로 가지며 이 키는 다른 atom과 구별하는 식별자가 되는 필수 값
    // 애플리케이션 내부에서 유일한 값이어야 하기 때문에 atom과 selector를 만들 때 반드시 주의를 기울여야 한다
    // default는 atom의 초깃값을 의미 
}

{
    // atom의 값을 컴포넌트에서 읽어오고 이 값의 변화에 따라 컴포넌트를 리렌더링 하는 훅

    // useRecoilValue
    // atom의 값을 읽어오는 훅
    function Statements() {
        const statements = useRecoilValue(statementsAtom)

        return (
            <>something</>
            // ...
        )
    }

    // useRecoilValue 훅의 구현
    function useRecoilValue<T>(recoilValue: RecoilValue<T>): T {
        if (__DEV__){
            validateRecoilValue(recoilValue, 'useRecoilValue')
        }

        const storeRef = useStoreRef()
        const loadable = useRecoilValueLoadable(recoilValue)
        const handleLoadable(loadable, recoilValue, storeRef)
    }

    // ...
        
    // useRecoilValueLoadable
    // 외부의 값을 구독해 렌더링을 강제로 일으키는 원리로 작동
    function useRecoilValueLoadable_LEGACY<T>(
        recoilValue: RecoilValue<T>,
    ): Loadable<T> {
        const storeRef = useStoreRef()
        const [, forceUpdate] = useState([])
        const componentName = useComponentName()

        // 현재 Recoil이 가지고 있는 상태값을 가지고 있는 함수인 loadable을 반환하는 함수
        // 이 값을 이전값과 비교해 렌더링이 필요한지 확인하기 위해 렌더링을 일으키지 않으면서 값을 
        // 저장할 수 있는 ref에 매번 저장
        const getLoadable = useCallback(() => {
            if(__DEV__){
                recoilComponentGetRecoilValueCount_FOR_TESTING.current++
            }

            const store = storeRef.current
            const storeState = store.getState()
            const treeState = reactMode().early
                ? storeState.nextTree ?? storeState.currentTree
                : storeState.currentTree
            
                return getRecoilValueAsLoadable(store, recoilValue, treeState)
        }, [storeRef, recoilValue])

        const loadable = getLoadable()
        const prevLoadableRef = useRef(loadable)
        useEffect(() => {
            prevLoadableRef.current = loadable
        })

        // useEffect를 통해 recoilValue가 변경됐을 때 forceUpdate를 호출해 렌더링을 강제
        useEffect(() => {
            const store = storeRef.current
            const storeState = store.getState()

            // 현재 recoil의 값을 구독하는 함수
            const subscription = subscribeToRecoilValue(
                store,
                recoilValue,
                (_state) => {
                    if(!gkx('recoil_suppress_rerender_in_callback')){
                        return forceUpdate([])
                    }

                    const newLoadable = getLoadable()
                    // is는 두 객체가 같은지 비교하고 다르면 렌더링 유도
                    if(!prevLoadableRef.current?.is(newLoadable)){
                        forceUpdate(newLoadable)
                    }
                    prevLoadableRef.current = newLoadable
                },
                componentName,
            )

            if(storeState.nextTree){
                store.getState().queuedComponentCallbacks_DEPRECATED.push(() => {
                    prevLoadableRef.current = null
                    forceUpdate([])
                })
            }else{
                if(!gkx('recoil_suppress_rerender_in_callback')){
                    return forceUpdate([])
                }

                const newLoadable = getLoadable()

                // 값을 비교해서 값이 다르면 forceUpdate를 실행
                if(!prevLoadableRef.current?.is(newLoadable)){
                    forceUpdate(newLoadable)
                }

                prevLoadableRef.current = newLoadable
            }

            // 클린업 함수에 subscribe를 해체하는 함수를 반환
            return subscription.release
        }, [componentName, getLoadable, recoilValue, storeRef])

        return loadable
    }
}

{
    // useRecoilState
    // useState와 유사하게 값을 가져오고 값을 변경할 수도 있는 훅

    // useRecoilState
    function useRecoilState<T>{
        recoilState: RecoilState<T>,
    }: [T, SetterOrUpdater<T>]{
        if(__DEV__) {
            validateRecoilValue(recoilState, 'useRecoilState')
        }

        // 현재값을 가져오기 위해 useRecoilValue 사용
        // 상태를 설정하는 훅으로 useSetRecoilState 훅 사용
        return [useRecoilValue(recoilState), useSetRecoilState(recoilState)]
    }
}

{
    // useSetRecoilState 훅 = 내부에서 스토어를 가져온 다음 setRecoilValue 호출해 업데이트
    // useSetRecoilState
    /**
        Returns a function that allows the value of a RecoilState to be updated. but does
        not subscribe the component to changes to that RecoilState.
    */
    function useSetRecoilState<T>(recoilState: RecoilState<T>): SetterOrUpdater<T> {
        if(__DEV__) {
            validateRecoilValue(recoilState, 'useSetRecoilState')
        }

        const storeRef = useStoreRef()

        return useCallback(
            (newValueOrUpdater: ((T) => T | DefaultValue) | T | DefaultValue) => {
                setRecoilValue(storeRef.current, recoilState, newValueOrUpdater)
            },
            [storeRef, recoilState],
        )
    }

    // ...
}

{
    // setRecoilValue 내부에서는 queueOrPerformStateUpdate 함수를 호출해 상태를 업데이트하거나 업데이트가 필요한 내용을
    // 등록하는 것을 확인할 수 있다

    // setRecoilValue
    function setRecoilValue<T>(
        store: Store,
        recoilValue: AbstractRecoilValue<T>,
        valueOrUpdater: T | DefaultValue | ((T) => T | DefaultValue),
    ): void {
        queueOrPerformStateUpdate(store, {
            type: 'set',
            recoilValue,
            valueOrUpdater,
        })
    }
}

{
    // Recoil 요약
    // 애플리케이션 최상단에 <RecoilRoot />를 선언해 하나의 스토어를 만들고 atom이라는 상태 단위를 <RecoilRoot />에서 만든 스토어에 등록
    // atom은 Recoil에서 관리하는 작은 상태 단위 각 값은 key를 바탕으로 구별
    // 컴포넌트는 Recoil에서 제공하는 훅을 통해 atom의 상태 변화를 구독하고 값이 변경되면 forceUpdate 같은 기법을 통해 리렌더링을 실행해 최신 atom값을 가져온다

    // 간단한 사용법
    const counterState = atom({
        key: 'counterState',
        default: 0
    })

    function Counter(){
        const [, setCount] = useRecoilState(counterState)

        function handleButtonClick() {
            setCount((count) => count + 1)
        }

        return (
            <>
                <button onClick={handleButtonClick}>+</button>
            </>
        )
    }

    // atom을 기반으로 또 다른 상태를 만들 수 있다
    // selector = 한 개 이상의 atom 값을 바탕으로 새로운 값을 조립할 수 있는 api
    // useStoreSelector와 유사한 역할 수행
    // 이 외에도 atom에 비동기 작업도 추가 가능 (useRecoilStateLoadable, waitForAll, waitForAny, awaitForAllSettled)
    const isBiggerThen10 = selector({
        key: 'above10State',
        get: ({get}) => {
            return get(counterState) >= 10
        },
    })

    function Count() {
        const count = useRecoilValue(counterState)
        const biggerThan10 = useRecoilValue(isBiggerThen10)

        return (
            <>
                <h3>{count}</h3>
                <p>count is bigger than 10: {JSON.stringify(biggerThan10)}</p>
            </>
        )
    }

    export default function App() {
        return (
            <RecoilRoot>
                <Counter />
                <Count />
            </RecoilRoot>
        )
    }
}

{
    // Recoil은 메타 팀에서 주도적으로 개발하고 있기 때문에 리액트에서 새롭게 만들어진느 기능을 그 어떤 라이브러리보다 잘 지원할것으로 기대
    // selector를 필두로 다양한 비동기 작업을 지원하는 API를 제공 
    // 리덕스와 달리 redux-saga나 redux-thunk등 추가적인 미들웨어를 사용하지 않더라도 비동기 작업을 수월하게 처리할 수 있다
    // Recoil에서도 자체적인 개발 도구를 지원

    // Recoil은 아직 정식 릴리스가 되지 않았으므로 위험부담이 있다
}

{
    // Jotai
    // Recoil의 atom 모델에 영감을 받아 만들어진 상태 관리 라이브러리
    // 상향식(bottom-up) 접근법을 취하고 있다
    // 리덕스와 같이 하나의 큰 상태를 애플리케이션에 내려주는 방식이 아니라 작은 단위의 상태를 위로 전파할 수 있는 구조를 취하고 있다
    // 리액트 Context의 문제점인 불필요한 리렌더링이 발생하는 문제를 해결하고자 설계
    // 개발자들이 메모이제이션이나 최적화를 거치지 않아도 리렌더링이 발생되지 않도록 설계
}

{
    // atom
    // Jotai에도 atom이 존재
    // 최소 단위 상태를 의미 
    // atom 하나만으로도 상태를 만들 수 있고 이에 파생된 상태를 만들 수도 있다

    const counterAtom = atom(0)

    // 이렇게 만든 textAtom 정보
    console.log(counterAtom)
    // ...
    // {
    //     init: 0,
    //     read: (get) => get(config),
    //     write: (get, set, update) =>
    //         set(config, typeof update === 'function' ? update(get(config)) : update)
    // }
}

{
    // Jotai의 atom 코드
    // 구현 자체는 Recoil의 atom과 약간 차이가 있다
    // Jotai는 atom을 생성할 때 별도의 key를 넘겨주지 않아도 된다
    // atom 내부에는 key 변수가 존재하긴 하지만 외부에서 받는 값은 아니며 단순히 toString()을 위한 용도로 한정
    // config는 초깃값을 의미하는 init, 값을 가져오는 read, 값을 설정하는 write만 존재
    // atom에 따로 상태를 저장하고 있진 않다
    export function atom<Value, Update, Result extends void | Promise<void>>(
        read: Value | Read<Value>,
        write?: Write<Update, Result>,
    ) {
        const key = `atom${++keyCount}`
        const config = {
            toString: () => key,
        } as WriteableAtom<Value, Update, Result> & { init?: Value }

        if(typeof read === 'function') {
            config.read = read as Read<Value>
        }else {
            config.init = read
            config.read = (get) => get(config)
            config.write = (get, set, update) =>
                set(config, typeof update === 'function' ? update(get(config)) : update)
        }

        if(write){
            config.write = write
        }

        return config
    } 
}

{
    // useAtomValue
    export function useAtomValue<Value>(
        atom: Atom<Value>
        scope?: Scope,
    ): Awaited<Value> {
        const ScopeContext = getScopeContext(scope)
        const scopeContainer = useContext(ScopeContext)
        const { s: store, v: versionFromProvider } = scopeContainer

        const getAtomValue = (verstion?: VersionObject) => {
            const atomState = store[READ_ATOM](atom, version)
            // ...
        }

        // Pull the atoms's state from the store into React state.
        // useReducer 반환값
        // 첫번째 = store의 버전 
        // 두번쩨 = atom에서 get을 수행했을 때 반환되는 값
        // 세번째 = atom 그 자체를 의미
        const [[version, valueFromReducer, atomFromReducer], rerenderIfChanged] = 
            useReducer<
                Reducer<
                    readonly [VersionObject | undefined, Awaited<Value>, Atom<Value>],
                    VersionObject | undefined
                >,
                VersionObject | undefined
            >(
                (prev, nextVersion) => {
                    const nextValue = getAtomValue(nextVersion)

                    if(Object.is(prev[1], nextValue) && prev[2] === atom){
                        return prev // bail out
                    }

                    return [nextVersion, nextValue, atom]
                },
                versionFromProvider,
                (initialVersion) => {
                    const initialValue = getAtomValue(initialVersion)
                    return [initialVersion, initialValue, atom]
                }
            )
        
        let value = valueFromReducer
        if(atomFromReducer !== atom) {
            rerenderIfChanged(version)
            value = getAtomValue(version)
        }

        useEffect(() => {
            const { v: versionFromProvider } = scopeContainer
            if(versionFromProvider) {
                store[COMMIT_ATOM](atom, versionFromProvider)
            }

            const unsubscribe = store[SUBSCRIBE_ATOM](
                atom,
                rerenderIfChanged,
                versionFromProvider,
            )
            rerenderIfChanged(versionFromProvider)
            return unsubscribe
        }, [store, atom, scopeContainer])

        // ...
        return value
    }

    // Recoil과는 다르게 컴포넌트 루트 레벨에서 Context가 존재하지 않아도 되는데 Context가 없다면 앞선 예제에서처럼 Provider가 없는
    // 형태로 기본 스토어를 루트에 생성하고 이를 활용해 값을 저장하기 때문
    // Jotai에서 export 하는 Provider를 사용한다면 앞선 예제에서 여러 개의 Provider를 관리했던 것처럼 각 Provider 별로 다른 atom 값을 관리 가능

    // atom의 값은 store에 존재한다
    // 객체 그 자체를 키로 활용해 값을 저장
    // 이러한 방식을 위해 WeakMap이라고 하는 자바스크립트에서 객체만을 키로 가질 수 있는 독특한 방식의 Map을 활용해 recoil과는 다르게 
    // 별도의 key를 받지 않아도 스토어에 값을 저장할 수 있다

    // rerenderIfChanged = 리렌더링을 일으킴
    // 조건
    // 넘겨받은 atom이 Reducer를 통해 스토어에 있는 atom과 달라지는 경우
    // subscribe를 수행하고 있다가 어디선가 이 값이 달라지는 경우
    // 이런 로직 때문에 atom의 값이 어디서 변경되더라도 useAtomValue로 값을 사용하는 쪽에서는 언제든 최신 값의 atom을 사용해 렌더링 가능
}

{
    // useAtom
    // useState와 동일한 형태의 배열 반환
    // 첫째 = atom의 현재 값을 나타내느 useAtomValue 훅의 결과를 반환
    // 두번째 = useSetAtom훅 반환 (atom 수정 기능)

    // Jotai의 useAtom 구현
    export function useSetAtom<Value, Update, Result extends void | Promise<void>>(
        atom: WritableAtom<Value, Update, Result>,
        scope?: Scope,
    ): SetAtom<Update, Result> {
        const ScopeContext = getScopeContext(scope)
        const { s: store, w: versionedWrite } = useContext(ScopeContext)
        const setAtom = useCallback(
            (update: Update) => {
                // ...
                // 스토어에서 해당 값을 찾아 직접 값을 업데이트
                // 스토어에서 새로운 값을 작성한 이후에는 해당 값의 변화에 대해 알고 있어야 하는 listener 함수를 
                // 실행해 값의 변화가 있음을 전파하고 사용하는 쪽에서 리렌더링이 수행되게 한다
                const write = (version?: VersionObject) =>
                    store[WRITE_ATOM](atom, update, version)

                return versionedWrite ? versionedWrite(write) : write()
            },
            [store, versionedWrite, atom],
        )

        return setAtom as SetAtom<Update, Result>
    }
}

{
    // Jotai 예제
    // 상태 선언 -> 파생된 상태를 사용하는 예제
    import { atom, useAtom, useAtomValue } from 'jotai'

    // 상태선언 API 
    // 컴포넌트 외부에도 선언 가능
    // 값뿐만 아니라 함수를 인수로 받을 수 있다 (다른 atom의 값으로부터 파생된 atom을 만들 수도 있다)
    const counterState = atom(0)

    function Counter(){
        // 컴포넌트 내부에서 useAtom을 활용해 useState와 비슷하게 사용하거나 useAtomValue를 통해 getter만 가져올 수 있다
        const [, setCount] = useAtom(counterState)

        function handleButtonClick() {
            setCount((count) => count + 1)
        }

        return (
            <>
                <button onClick={handleButtonClick}>+</button>
            </>
        )
    }

    const isBiggerThan10 = atom((get) => get(counterState) > 10)

    function Count(){
        const count = useAtomValue(counterState)
        const biggerThan10 = useAtomValue(isBiggerThan10)

        return (
            <>
                <h3>{count}</h3>
                <p>count is bigger than 10: {JSON:stringify(biggerThan10)}</p>
            </>
        )
    }

    export default function App(){
        return (
            <>
                <Counter />
                <Count />
            </>
        )
    }

    // 이 외에도 localStorage와 연동해 영구적으로 데이터를 저장하거나 Next.js 리액트 네이티브와 연동하는 등 상태와 
    // 관련된 다양한 작업 지원
}

{
    // Recoil의 atom 개념을 도입하면서도 API가 간결
    // Recoil에서는 atom에 따라 key를 필요로 하기 때문에 별도 관리 필요
    // Jotai가 별도의 문자열 키가 없어도 객체의 참조를 통해 값을 관리 (WeakMap)
    // Recoil에서는 atom 파생 값을 만들기 위해 selector가 필요했지만 Jotai는 atom 만으로 가능
    // 타입스크립트로 작성돼 있어 타입을 잘 지원
    // 리액트 18 버전 API 지원 
    // Recoi 대비 여러 가지 장점으로 Recoil의 atom 형태 상태 관리를 선호하지만 아직 정식 버전이 출시되지 않아 사용이 망설여지는 개발자들이 주로 사용
}

{
    // 작고 빠르며 확장에도 유연한 Zustand
    // 리덕스에 영감을 받아 만들어짐 
    // atom의 개념으로 최소 단위의 상태를 관리하는 것이 아니라 하나의 스토어를 중앙 집중형으로 활용해 이 스토어 내부에서 상태 관리
}

{
    // Zustand의 스토어 코드
    const createStoreImpl: CreateStoreImpl = (createState) => {
        type TState = ReturnType<typeof createState>
        type Listener = (state: TState, prevState: TState) => void

        // state 값을 useState 외부에서 관리
        // 스토어의 상태값을 담아두는 곳
        let state: TState

        const listeners: Set<Listener> = new Set()

        // state값을 변경하는 용도
        // partial = state의 일부만 변경하고 싶을 때 사용
        // replace는 state를 완전히 새로운 값으로 변경
        const setState: SetStateInternal<TState> = (partial, replace) => {
            // ...
            const nextState = 
                typeof partial === 'function'
                    ? (partial as (state: TState) => TState)(state)
                    : partial
            
            if(nextState !== state){
                const previousState = state
                state = 
                    replace ?? typeof nextState !== 'object'
                        ? (nextState as TState)
                        : Object.assign({}, state, nextState)
                listeners.forEach((listeners) => listeners(state, previousState))
            }
        }

        // 클로저의 최신 값을 가져오기 위해 함수로 만듦
        const getState: () => TState = () => state

        // listener를 등록
        // listeners = Set 형태로 추가, 삭제, 중복관리가 용이
        // 상태값 변경 시 리렌더링이 필요한 컴포넌트에 전파
        const subscribe: (listener: Listener) => () => void = (listener) => {
            listeners.add(listener)
            // Unsubscribe
            return () => listeners.delete(listener)
        }

        // listeners 초기화
        const destroy: () => void = () => listeners.clear()
        const api = { setState, getState, subscribe, destroy }
        state = (createState as PopArgument<typeof createState>)(
            setState,
            getState,
            api,
        )

        return api as any
    }

    // createStore는 이렇게 만들어진 getState, setState, subscribe, destroy를 반환
}

{
    // 스토어 코드가 있는 파일은 ./src/vanilla.ts 
    // 해당 파일에서 export 하는 유일한 함수 및 변수는 createStore
    // 그 외에는 createStore를 이용하는데 필요한 타입
    // 어떤것도 import 하지 않음
    // 완전히 독립적으로 구성
    // 순수 자바스크립트 환경에서 사용 가능
    type CounterStore = {
        count: number
        increase: (num: number) => void
    }

    // set 인수를 활용해 생성 가능
    // Zustand의 createStore 예제 코드에서처럼 state 생성 시 setState, getState, api를 인수로 넘겨줬기 때문에 가능
    // 두번쨰 인수로 get을 추가해 현재 스토어의 값을 받아올 수도 있다
    const store = createStore<CounterStore>((set) => ({
        count: 0,
        increase: (num: number) => set((state) => ({ count: state.count + num })),
    }))

    //subscribe를 통해 스토어의 값이 변경될 때마다 특정 함수를 실행할 수도 있다
    // 현재값과 이전값 둘 다 확인 가능하므로 특정 값이 변경될때만 실행되게끔 최적화도 가능
    store.subscribe((state, prev) => {
        if(state.count !== prev.count){
            console.log('count has been changed', state.count)
        }
    })

    // 이렇게 생성된 스토어는 getState와 setState를 통해 현재 스토어의 값을 받아오거나 재정의할 수 있다
    store.setState((state) => ({ count: state.count + 1 }))

    store.getState().increase(10)
}