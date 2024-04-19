{
    // 훅은 클래스 컴포넌트에서만 가능했던 state.ref 등 리액트 핵심적인 기능을 함수에서도 가능하게 만들었고
    // 무엇보다 클래스 컴포넌트보다 간결하게 작성할 수 있다
}

{
    // useState
    // 함수 컴포넌트 내부에서 상태를 정의하고 이 상태를 관리할 수 있게 해주는 훅

    // useState의 인수로 사용할 state 초기값 전달 
    // 아무런 값을 넘겨주지 않으면 undefined다 
    // useState 훅의 반환 값은 배열이며 배열의 첫 번쨰 요소로 state 값 자체를 사용할 수 있고 
    // 두 번째 원소인 setState 함수를 사용해 해당 state의 값을 변경할 수 있다
    import {useState} from 'react'

    const [state, setState] = useState(initalState)
}

{
    // useState를 사용하지 않고 함수 내부에서 자체적으로 변수를 사용해 상태값 관리 
    // 아래 코드는 리렌더링을 발생시키기 위한 조건을 전혀 충족하지 못한다
    function Component(){
        let state = 'hello'

        function handleButtonClick(){
            state = 'hi'
        }

        return (
            <>
                <h1>{state}</h1>
                <button onClick={handleButtonClick}>hi</button>
            </>
        )
    }
}

{
    // useState 반환값의 두 번째 원소를 실행해 리액트에서 렌더링이 일어나게끔 변경했다
    // 하지만 변경된 값이 렌더링 되진 않는데 매번 렌더링이 발생될 때마다 함수는 다시 새롭게 실행되고
    // 새롭게 실행되는 함수에서 state는 매번 hello로 초기화 되므로 state를 변경해도 다시 hello 로 초기화
    function Component(){
        const [, triggerRender] = useState()

        let state = 'hello'        

        function handleButtonClick() {
            state = 'hi'
            triggerRender()
        }

        return(
            <>
                <h1>{state}</h1>
                <button onClick={handleButtonClick}>hi</button>
            </>
        )
    }
}

{
    // useState 구조 추측
    function useState(initalValue){
        let internalState = initalValue

        function setState(newValue){
            internalState = newValue
        }

        return [internalState, setState]
    }

    // 그러나 이는 정상작동하지 않음
    // 이미 구조 분해 할당으로 state의 값을 이미 할당해 놓은 상태이기 떄문 
    const [value, setValue] = useState(0)
    setValue(1)
    console.log(value) //0
}

{
    // 구조 개선
    // 이는 useState 훅의 모습과는 많이 동떨어져 있다
    // state를 함수가 아닌 상수로 사용하고 있기 떄문
    // 이를 해결하기 위해 리액트는 클로저 사용
    function useState(initalValue){
        let internalState = initalValue

        function state(){
            return internalState
        }

        function setState(newValue){
            internalState = newValue
        }

        return [state, setState]
    }

    const [value, setValue] = useState(0)
    setValue(1)
    console.log(value()) //1
}

{
    // useState 훅의 작동 방식 흉내
    const MyReact = (function() {
        const global = {}
        let index = 0

        function useState(initalState){
            if(!global.states){
                // 애플리케이션 전체의 states 배열을 초기화
                // 최초 접근이라면 빈 배열로 초기화
                global.states = []
            }

            // states 정보를 초기화해서 현재 상태값이 있는지 확인
            // 없으면 초깃값으로 설정
            const currentState = global.states[index] || initalState
            // states의 값을 위해서 조회한 현재 값으로 업데이트
            global.states[index] = currentState

            // 즉시 실행 함수로 setter를 만든다
            const setState = (function (){
                // 현재 index를 클로저로 가둬놔서 이후에도 계속해서 동일한 index에 
                // 접근할 수 있도록 한다
                let currentIndex = index
                return function (value) {
                    global.states[currentIndex] = value
                    // 컴포넌트 렌더링 실제 컴포넌트 렌더링 코드는 생략
                }
            })()
            // useState를 쓸 때마다 index를 하나씩 추가 해당 index는 setState에서 사용
            // 즉 하나의 state 마다 index가 할당돼 있어 그 index가 배열의 값(global.states)을
            // 가리키고 필요할 때마다 그 값을 가져오게 한다
            index = index + 1

            return [currentState, setState]
        }

        // 실제 useState를 사용하는 컴포넌트
        function Component(){
            const [value, setValue] = useState(0)
            // ...
        }
    })();

    // 작동 자체만 구현했을 뿐 실제 구현체와는 차이가 있다
    // 실제 코드는 useReducer를 이용해 구현 

}

{
    // 게으른 초기화 (lazy initialization)
    // 일반적으로 useState에서 기본값 선언을 위해 인수로 원시값을 넣음
    // 특정한 값을 넘기는 함수를 인수로 넣을 수도 있다
    // 값 대신 함수를 넘기는 것을 게으른 초기화라고 한다

    // 예제
    // 일반적인 useState 사용
    // 바로 값을 집어넣음
    const [count, setCount] = useState(
        Number.parseInt(window.localStorage.getItem(cacheKey)),
    )

    // 게으른 초기화
    // 함수를 실행해 값을 반환한다
    const [count, setCount] = useState(() => 
        Number.parseInt(window.localStorage.getItem(cacheKey)),
    )

    // 게으른 초기화는 useState의 초깃값이 복잡하거나 무거운 연산을 포함하고 있을 때 사용
    // state가 처음 만들어질 때만 사용되고 리렌더링에서는 무시

    // 예제
    import {useState} from 'react'

    export default function App(){
        const [state, setState] = useState(() => {
            console.log('복잡한 연산...') //App 컴포넌트가 처음 구동될 때만 실행, 리렌더링 시에는 실행 x
            return 0
        })

        function handleClick(){
            setState((prev) => prev + 1)
        }

        return (
            <div>
                <h1>{state}</h1>
                <button onClick={handleClick}>+</button>
            </div>
        )
    }

    // 리액트는 렌더링 시 함수 컴포넌트의 함수가 다시 실행 (useState 포함)
    // useState 인수로 함수를 넣으면 이는 최초 렌더링 이후에는 실행되지 않고 최초의 state 값을 넣을 때만 실행
    // Number.parseInt(window.localStorage.getItem(cacheKey)) 와 같은 실행시 어느정도 비용이 드는 값이 있다고 가정 시
    // useState 인수로 사용하면 최초 렌더링과 초깃값이 있어 더 이상 필요 없는 리렌더링 시에도 계속 해당 값에 접근하여 낭비가 발생
    // localStorage나 sessionStorage에 대한 접근 map, filter, find 같은 배열에 대한 접근 혹은 초깃값 계산을 위해
    // 함수 호출이 필요할 때와 같이 무거운 연산을 포함해 실행 비용이 많이 드는 경우 게으른 초기화 사용
}

{
    // useEffect
    // 생명주기를 대체하기 위해 나온 훅이 아님
    // 애플리케이션 내 컴포넌트의 여러 값들을 활용해 동기적으로 부수 효과를 만드는 메커니즘
    // 이 부수 효과가 언제 일어나는지보다 어떤 상태값과 함께 실행되는지 살펴보는것이 중요
}

{
    // useEffect 예제
    // 첫 번째 인수 = 실행할 부수 효과
    // 두 번째 인수 = 의존성 배열 
    // 의존성 배열의 변경될 때마나 첫 번째 인수인 콜백 실행
    function Component(){
        //...
        useEffect(() => {
            //do something
        }, [props, state])
        // ...
    }
}

{
    // 함수 컴포넌트는 매번 함수를 실행해 렌더링 수행
    function Component(){
        const [counter, setCounter] = useState(0)

        function handleClick(){
            setCounter((prev) => prev + 1)
        }

        return (
            <>
                <h1>{counter}</h1>
                <button onClick={handleClick}>+</button>
            </>
        )
    }

    // 버튼을 누르면 useState의 원리에 따라 다음과 같이 작동
    // 즉 함수 컴포넌트는 렌더링 시마다 고유의 state와 props 값을 가지고 있다
    function Component(){
        const counter = 1
        //...

        return (
            <>
                <h1>{counter}</h1>
                <button onClick={handleClick}>+</button>
            </>
        )
    }

    // useEffect 추가
    function Component(){
        const counter = 1

        useEffect(() => {
            console.log(counter) // 1, 2, 3, 4 ...
        })

        //...

        return (
            <>
                <h1>{counter}</h1>
                <button onClick={handleClick}>+</button>
            </>
        )
    }

    // 자바스크립트의 proxy나 데이터 바인딩, 옵저버 같은 특별한 기능을 통해 값의 변화를 관찰하는 것이 아니고 렌더링 할 때마다 의존성에 있는
    // 값을 보면서 이 의존성의 값이 이전과 다른 게 하나라도 있으면 부수 효과를 실행하는 평범한 함수
}

{
    // 클린업 함수
    // useEffect 내에서 반환하는 클린업 함수는 이벤트를 등록하고 지울 때 사용해야 한다고 알려져 있다
    // 예제
    import {useState, useEffect} from 'react'

    export default function App() {
        const [counter, setCounter] = useState(0)

        function handleClick(){
            setCounter((prev) => prev + 1)
        }

        useEffect(() => {
            function addMouseEvent(){
                console.log(counter)
            }

            window.addEventListener('click', addMouseEvent)

            // 클린업 함수
            return () => {
                console.log('클린업 함수 실행!', counter)
                window.removeEventListener('click', addMouseEvent)
            }
        }, [counter])

        return (
            <>
                <h1>{counter}</h1>
                <button onClick={handleClick}>+</button>
            </>
        )
    }

    // 실행 결과
    // 클린업 함수 실행! 0
    // 1
    // 클린업 함수 실행! 1
    // 2
    // 클린업 함수 실행! 2
    // 3
    // 클린업 함수 실행! 2
    // 4
    
    // 클린업 함수는 이전 state를 참조해 실행된다
    // 클린업 함수는 새로운 값과 함께 렌더링된 뒤에 실행
    // 새로운 값을 기반으로 렌더링 뒤에 실행되지만 이 변경된 값을 읽는 것이 아니라 함수가 정의됐을 당시에 선언됐던 이전 값을 보고 실행
}

{
    // 이러한 사실을 코드로 직관적으로 표현
    // 렌더링이 수행될 때마다 counter가 어떤 값을 선언돼 있는지 보여준다
    
    // 최초 실행
    useEffect(() => {
        function addMouseEvent(){
            console.log(1)
        }

        window.addEventListener('click', addMouseEvent)

        //클린업 함수
        //다음 렌더링이 끝난 뒤에 실행
        return () => {
            console.log('클린업 함수 실행!', 1)
            window.removeEventListener('click', addMouseEvent)
        }
    }, [counter])
    //
    //...

    // 이후 실행
    useEffect(() => {
        function addMouseEvent(){
            console.log(2)
        }

        window.addEventListener('click', addMouseEvent)

        // 클린업 함수
        return () => {
            console.log('클린업 함수 실행!', 2)
            window.removeEventListener('click', addMouseEvent)
        }
    }, [counter])

    // 함수 컴포넌트의 useEffect는 그 콜백이 실행될 때마다 이전의 클린업 함수가 존재한다면 그 클린업 함수를
    // 실행한 뒤에 콜백을 실행한다
    // 따라서 이벤트를 추가하기 전에 이전에 등록했던 이벤트 핸들러를 삭제하는 코드를 클린업 함수에 추가하는 것이다
    // 이렇게 함으로써 특정 이벤트의 핸들러가 무한히 추가되는 것을 방지할 수 있다
    // 생명주기 언마운트 개념과는 차이가 있고 리렌더링됐을 때 의존성 변화가 있었을 당시 이전의 값을 기준으로 실행되는
    // 말 그대로 이전 상태를 청소해 주는 개념
}

{
    // 의존성 배열
    // 빈 배열을 둔다면 리액트가 해당 useEffect는 비교할 의존서이 없다고 판단해 최초 렌더링 직후에 실행된 다움부터는
    // 실행되지 않는다
    // 아무 값도 넘겨주지 않는다면 의존성을 비교할 필요 없이 렌더링시 실행이 필요하다고 판단해 매번 실행된다
    // 이는 보통 컴포넌트가 렌더링됐는지 확인하기 위한 방법으로 사용
    useEffect(() => {
        console.log('컴포넌트 렌더링됨')
    })

    // 의존성 배열이 없는 useEffect 사용과 그냥 useEffect 없이 사용의 차이점
    //1
    function Component(){
        console.log('렌더링됨')
    }

    //2 
    function Component(){
        useEffect(() => {
            console.log('렌더링됨')
        })
    }

    // 차이점
    // 1. 서버 사이드 렌더링 관점에서 useEffect는 클라이언트 사이드에서 실행을 보장
    // useEffect 내부에서는 window 객체의 접근에 의존하는 코드 사용 가능
    // 2. useEffect는 컴포넌트 렌더링의 부수 효과 즉 컴포넌트의 렌더링이 완료된 이후에 실행
    // 반면 1번 코드는 컴포넌트가 렌더링되는 도중에 발생
    // 따라서 2번 코드와 달리 서버 사이드 렌더링의 경우에 서버에서도 실행
    // 해당 작업은 함수 컴포넌트의 반환을 지연시키는 행위이다 즉 무거운 작업일 경우 렌더링을 방해하므로 성능에 악영향을 미칠 수 있다
}

{
    // useEffect 구현
    // 리액트 코드를 직접 구현할 수는 없다 대략적인 모습을 다음과 같이 상상해 볼 수 있다
    const MyReact = (function () {
        const global = {}
        let index = 0

        function useEffect(callback, dependencies){
            const hooks = global.hooks

            // 이전 훅 정보가 있는지 확인
            let previouseDependencies = hooks[index]

            // 변경됐는지 확인
            // 이전 값이 있다면 얕은 비교로 변경 체크
            // 이전 값이 없다면 최초 실행이므로 변경이 일어난 것으로 간주해 실행을 유도
            let isDependenciesChanged = previouseDependencies
                ? dependencies.some(
                    (value, idx) => !Object.is(value, previouseDependencies[idx]),
                )
                : true

            // 변경이 일어났다면 첫 번째 인수인 콜백 함수 실행
            if(isDependenciesChanged){
                callback()

                // 다음 훅이 일어날 때를 대비하기 위해 index 추가
                index++

                // 현재 의존성을 훅에 다시 저장
                hooks[index] = dependencies
            }

            return {useEffect}
        }
    })()
}

{
    // useEffect 주의점
    // eslint-disable-line react-hooks/exhaustive-deps 주석은 최대한 자제하라
    // eslint-disable-line, react-hooks/exhaustive-deps 주석을 사용해서 ESLink의 react-hooks/exhaustive-deps 룰에서
    // 발생하는 경고를 무시하는것을 볼 수 있다
    // 이 ESLinkt룰은 useEffect 인수 내부에서 사용하는 값 중 의존성 배열에 포함돼 있지 않은 값이 있을 때 경고를 발생시킨다
    useEffect(() => {
        console.log(props)
    }, []) // 경고

    // 대부분의 경우 의도치 못한 버그를 만들 가능성이 높은 코드
    // 해당 코드를 대부분 컴포넌트 마운트 시점에만 무언가를 하고 싶다라는 의도로 작성하곤 한다
    // 그러나 이는 클래스 컴포넌트의 componentDidMount에 기반한 접근법으로 가급적이면 사용해선 안된다
    // 컴포넌트의 state, props와 같은 어떤 값의 변경과 useEffect의 부수 효과가 별개로 작동하게 된다
    // useEffect 내부의 콜백 함수의 ㅅㄹ행과 내부에서 사용한 값의 실제 변경 사이에 연결 고리가 끊어진다

    // 정말로 의존성으로 []가 필요하다면 최초에 함수 컴포넌트가 마운트 시점에만 콜백 함수 실행이 필요한기 생각해봐야 한다
    // 만약 그렇다라면 useEffect 내 부수 효과가 실행될 위치가 잘못됐을 가능성이 크다

    // 아래 코드는 log가 최초로 props로 넘어와 컴포넌트가 최초로 렌더링된 시점에만 실행
    // 당장은 문제가 없을지라도 log가 아무리 변해도 부수 효과는 실행되지 않는다
    // useEffect의 흐름과 컴포넌트의 props.log 흐름이 맞지 않게 된다
    function Component({log} : {log: string}){
        useEffect(() => {
            logging(log) //eslint-disable-line react-hooks/exhaustive-deps
        }, [])
    }

    // 앞의 logging 이라는 작업은 log를 props로 전달하는 부모 컴포넌트에서 실행되는 것이 옳을지도 모른다
    // 부모 컴포넌트에서 Component가 렌더링되는 시점을 결정하고 이에 맞게 log값을 넘겨준다면 useEffect의 해당 주석을 제거해도
    // 위 예제 코드와 동일한 결과를 만들 수 있고 Component의 부수 효과 흐름을 거스르지 않을 수 있다

    // 빈 배열이 아닐때도 만약 특정 값을 사용하지만 해당 값의 변경 시점을 피할 목적이라면 메모이제이션을 적절히 활용해
    // 해당 값의 변화를 막거나 적당한 실행 위치를 다시 한번 고민해보는 것이 좋다
}

{
    // useEffect의 첫 번째 인수에 함수명을 부여하라
    // useEffect를 사용하는 많은 코드에서 첫 번째 인수로 익명 함수를 넘겨준다 
    // 이는 리액트 공식 문서도 마찬가지다
    useEffect(() => {
        logging(user.id)
    }, [user.id])

    // 하지만 useEffect의 코드가 복잡하고 많아질수록 무슨 일을 하는 useEffect 코드인지 파악하기 어려워진다
    // 이때 익명함수를 적절한 이름을 사용한 기명 함수로 바꾸는 것이 좋다
    // 함수명 부여가 어색해 보일 수 있다지만 useEffect의 목적을 명확히 하고 그 책임을 최소한으로 좁힌다는 점에서 굉장히 유용하다
    useEffect(
        function logActiveUser(){
            loggin(user.id)
        },
        [user.id],
    )
}

{
    // 거대한 useEffect를 만들지 마라
    // 부수 효과의 크기가 커질수록 애플리케이션 성능에 악영향을 미친다
    // useEffect가 컴포넌트 렌더링 이후에 실행되기 떄문에 렌더링 작업에는 영향을 적게 미칠 수 있지만
    // 여전히 자바스크립트 실행 성능에 영향을 미친다
    // 가능한 한 간결하고 가볍게 유지하는 것이 좋다
    // 부득이하게 큰 useEffect를 만들어야 한다면 적은 의존성 배열을 사용하는 여러 개의 useEffect로 분리하는 것이 좋다
    // 만약 의존성 배열이 너무 거대하고 관리하기 어려운 수준까지 이른다면 정확이 이 useEffect가 언제 발생하는지 알 수 없게 된다
    // 불가피하게 여러 변수가 들어가야 하는 상황이라면 최대한 useCallback과 useMemo등으로 사전에 정제한 내용들만 useEffect에 담아두는 것이 좋다
    // 이렇게 하면 언제 useEffect가 실행되는지 좀 더 명확하게 알 수 있다
}

{
    // 불필요한 외부 함수를 만들지 마라
    // useEffect의 크기가 작은 것과 같은 맥락에서 useEffect가 실행하는 콜백 또한 불필요하게 존재해서는 안된다
    // 이 컴포넌트는 props를 받아서 그 정보를 바탕으로 API 호출을 하는 useEffect를 가지고 있다
    // 그러나 useEffect 밖에서 함수를 선언하다 보니 불필요한 코드가 많아지고 가독성이 떨어졌다
    function Component({id}: {id: string}){
        const [info, setInfo] = useState<number | null>(null)
        const controllerRef = useRef<AbortController | null>(null)
        const fetchInformation = useCallback(async (fetchId: string) => {
            controllerRef.current?.abort()
            controllerRef.current = new AbortController()

            const result = await fetchInfo(fetchId, {signal: controllerRef.signal})
            setInfo(await result.json())
        }, [])

        useEffect(() => {
            fetchInformation(id)

            return () => controllerRef.current?.abort()
        }, [id, fetchInformation])

        return <div>렌더링</div>
    }

    // useEffect 외부 함수를 내부로 가져왔더니 훨씬 간결해졌다
    // 불필요한 의존성 배열도 줄일 수 있었고 무한루프에 빠지기 위해 넣었던 코인 useCallback도 삭제할 수 있었다
    // useEffect 내부에 사용할 부수 효과라면 내부에서 사용해서 정의해서 사용하는 편이 훨씬 도움이 된다
    function Component({id}: {id: string}){
        const [info, setInfo] = useState<number | null>(null)

        useEffect(() => {
            const controller = new AbortController();

            (async () => {
                const result = await fetchInfo(id, {signal: controller.signal})
                setInfo(await result.json())
            })()

            return () => controller.abort()
        }, [id])

        return <div>렌더링</div>
    }
}

{
    // useEffect 콜백 함수로 비동기 함수가 사용 가능하다면 비동기 함수의 응답 속도에 따라 결과가 이상하게 나타날 수 있다
    // 극적인 예로 이전 state 기반의 응답이 10초가 걸렸고 바뀐 state 기반의 응답이 1초 뒤에 왔다면 이전 state 기반으로 결과가
    // 나와버리는 불상사가 생길 수 있다
    // 이러한 문제를 useEffect의 경쟁 상태(race condition)이라고 한다
    // useEffect 내부에서 비동기 함수를 선언해 실행하거나 즉시 실행 비동기 함수를 만들어서 사용하는 것은 가능하다
    useEffect(() => {
        let shouldIgnore = false

        async function fetchData(){
            const response = await fetch('http://some.data.com')
            const result = await response.json()

            if(!shouldIgnore){
                setData(result)
            }
        }

        fetchData()

        return () => {
            // shouldIgnore를 이용해 useState의 두 번째 인수를 실행을 막는 것뿐만 아니라
            // AbortController를 활용해 직전 요청 자체를 취소하는 것도 좋은 방법이 될 수 있다
            shouldIgnore = true
        }
    }, [])

    // 다만 비동기 함수가 내부에 존재하게 되면 useEffect 내부에서 비동기 함수가 생성되고 실행되는 것을 반복하므로 클린업 함수에서 
    // 이전 비동기 함수에 대한 처리를 추가하는 것이 좋다
    // fetch의 경우 abortController 등으로 이전 요청을 취소하는 것이 좋다
}

{
    // useMemo
    // 비용이 큰 연산에 대한 결과를 저장(메모이제이션)해 두고 이 저장된 값을 반환하는 훅
    // 리액트 최적화를 떠올릴 때 가장 먼저 언급되는 훅

    import {useMemo} from 'react'

    const memoizedValue = useMemo(() => expensiveComputation(a, b), [a, b])

    // 첫 번째 인수 = 어떠한 값을 반환하는 생성 함수
    // 두 번째 인수 = 해당 함수가 의존하는 값의 배열 

    // useMemo는 렌더링 발생 시 의존성 배열의 값이 변경되지 않으면 함수를 재실행하지 않고 이전값 반환
    // 의존성 배열의 값이 변경됐다면 첫 번째 인수의 함수를 실행한 후 반환하고 기억

    // 컴포넌트도 useMemo 가능
    function ExpensiveComponent({value}){
        useEffect(() => {
            console.log('rendering!')
        })

        return <span>{value + 1000}</span>
    }

    function App() {
        const [value, setValue] = useState(0)
        const [, triggerRendering] = useState(false)

        //컴포넌트의 props를 기준으로 컴포넌트 자체를 메모이제이션했다
        const MemoizedComponent = useMemo(
            () => <ExpensiveComponent value={value} />,
            [value]
        )

        function handleChange(e){
            setValue(Number(e.target.value))
        }

        function handleClick(){
            triggerRendering((prev) => !prev)
        }

        return (
            <>
                <input value={value} onChange={handleChange} />
                // 클릭하여도 렌더링 발생 x value가 변해야 렌더링
                <button onClick={handleClick}>렌더링 발생!</button>
                {MemoizedComponent}
            </>
        )
    }

    // useMemo가 컴포넌트도 감쌀 수 있지만 React.memo를 쓰는 것이 더 현명하다
}

{
    // useCallback
}