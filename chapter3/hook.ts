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
    // useCallback은 인수로 넘겨받은 콜백 자체를 기억한다
    // 쉽게 말해 특정 함수를 새로 만들지 않고 다시 재사용한다는 의미이다

    // 예제
    // memo를 사용함에도 전체 자식 컴포넌트가 리렌더링되는 예제
    const ChildComponent = memo(({name, value, onChange}) => {
        // 렌더링이 수행되는지 확인하기 위해 넣었다
        useEffect(() => {
            console.log('rendering!', name)
        })

        return (
            <>
                <h1>
                    {name} {value ? '켜짐' : '꺼짐'}
                </h1>
                <button onClick={onChange}>toggle</button>
            </>
        )
    })

    // memo를 사용했지만 status1의 value를 변경해도 전체 자식 컴포넌트가 리렌더링
    // App의 state 값이 바뀌면서 App 컴포넌트가 리렌더링되고 그때마다 매번 onChange로 넘기는 함수가 재생성되고 있기 때문
    function App(){
        const [status1, setStatus1] = useState(false)
        const [status2, setStatus2] = useState(false)

        const toggle1 = () => {
            setStatus1(!status1)
        }

        const toggle2 = () => {
            setStatus2(!status2)
        }

        return (
            <>
                <ChildComponent name="1" value={status1} onChange={toggle1} />
                <ChildComponent name="2" value={status2} onChange={toggle2} />
            </>
        )
    }
}

{
    // 값의 메모이제이션을 위해 useMemo를 사용했다면 함수의 메모이제이션을 위해 사용하는 것이 useCallback이다
    // 첫 번째 인수 = 함수
    // 두 번째 인수 = 의존성 배열
    // 의존성 배열이 변경도지 않는 한 함수를 재생성하지 않음

    const ChildComponent = memo(({name, value, onChange}) => {
        useEffect(() => {
            console.log('rendering!', name)
        })

        return (
            <>
                <h1>
                    {name} {value ? '켜짐' : '꺼짐'}
                </h1>
                <button onClick={onChange}>toggle</button>
            </>
        )
    })

    function App(){
        const [status1, setStatus1] = useState(false)
        const [status2, setStatus2] = useState(false)

        const toggle1 = useCallback(
            function toggle1() {
                setStatus1(!status1)
            },
            [status1],
        )

        const toggle2 = useCallback(
            function toggle2() {
                setStatus2(!status2)
            },
            [status2],
        )

        return (
            <>
                <ChildComponent name="1" value={status1} onChange={toggle1} />
                <ChildComponent name="2" value={status2} onChange={toggle2} />
            </>
        )
    }
}

{
    // useCallback은 useMemo를 사용해서 구현 가능
    export function usaCallback(callback, args){
        currentHook = 8
        return useMemo(() => callback, args)
    }
}

{
    // useMemo와 useCallback의 차이점은 메모이제이션 대상
    // 다만 useMemo로 useCallback을 구현하는 경우 다음과 같이 코드가 불필요하게 길어지고 혼동을 야기할 수 있다
    import {useState, useCallback, useMemo} from 'react'

    export default function App(){
        const [counter, setCounter] = useState(0)

        // 아래 두 함수의 작동은 동일
        const handleClick1 = useCallback(() => {
            setCounter((prev) => prev + 1)
        }, [])

        const handleClick2 = useMemo(() => {
            return () => setCounter((prev) => prev + 1)
        }, [])

        return (
            <>
                <h1>{counter}</h1>
                <button onClick={handleClick1}>+</button>
                <button onClick={handleClick2}>+</button>
            </>
        )
    }
}

{
    // useRef
    // useRef는 useState와 동일하게 컴포넌트 내부에서 렌더링이 일어나도록 변경 가능한 상태값을 저장
    // 차이점
    // useRef는 변환값인 객체 내부에 있는 current로 값에 접근 또는 변경 가능
    // useRef는 그 값이 변하더라도 렌더링을 발생시키지 않는다

    // 예제
    function RefComponent(){
        const count = useRef(0)

        function handleClick() {
            count.current += 1
        }

        // 버튼을 눌러도 변경된 count 값이 렌더링되지 않는다
        return <button onClick={handleClick}>{count.current}</button>
    }
}

{
    // 렌더링에 영향을 미치지 않는 고정된 값을 관리하기 위해 useRef를 사용하지 않고
    // 그냥 함수 외부에서 값을 선언해서 관리하는면 단점이 있다

    // 컴포넌트가 렌더링되지 않았음에도 value라는 값이 존재한다
    // 이는 메모리에 불필요한 값을 갖게 하는 악영향을 미친다
    // 컴포넌트가 여러 번 생성된다면 각 컴포넌트에서 가리키는 값이 모두 value로 동일하다
    // 컴포넌트가 초기화되는 지점이 다르더라도 하나의 값을 봐야 하는 경우라면 유효할 수 있지만 대부분의 경우에는
    // 컴포넌트 인스턴스 하나당 하나의 값을 필요로 하는 것이 일반적이다
    let value = 0

    function Component(){
        function handleClick() {
            value += 1
        }

        //...
    }
}

{
    // useRef의 가장 일반적인 사용
    // DOM 접근

    function RefComponent(){
        const inputRef = useRef()

        // 이때는 미처 렌더링이 실행되기 전(반환되기 전)이므로 undefined를 반환
        console.log(inputRef.current) //undefined

        useEffect(() => {
            console.log(inputRef.current) // <input type='text'></input>
        }, [inputRef])

        return <input ref={inputRef} type='text' //>
    }

    // useRef의 최초 기본값은 return 문에 정의해 둔 DOM이 아니고 useRef()로 넘겨받은 인수이다
    // uesRef가 선언된 당시에는 아직 컴포넌트 렌더링 전이라 return으로 컴포넌트의 DOM이 반환되기 전이므로 undefined다
}

{
    // useRef 활용 예
    // useState의 이전 값을 저장하는 usePrevious() 같은 훅을 구현할때
    function usePrevious(value){
        const ref = useRef()

        useEffect(() => {
            ref.current = value
        }, [value]) //value가 변경되면 그 값을 ref에 넣어둔다
        
        return ref.current
    }

    function SomeComponent(){
        const [counter, setCounter] = useState(0)
        const previouseCounter = usePrevious(counter)

        function handleClick(){
            setCounter((prev) => prev + 1)
        }

        // 0 (undefined)
        // 1. 0
        // 2. 1
        // 3. 2
        return(
            <button onClick={handleClick}>
                {counter} {previouseCounter}
            </button>
        )
    }
}

{
    // Preact에서의 useRef 구현
    export function useRef(initalValue) {
        currentHook = 5
        return useMemo(() => ({current: initalValue}), [])
    }
}

{
    // useContext
    // Context
    // 전달해야 하는 데이터가 있는 컴포넌트와 전달받아야 하는 컴포넌트의 거리가 멀어질수록 코드는 복잡해진다
    // 해당 기법을 prop 내려주기 (props drilling)라고 한다
    <A props={something}>
        <B props={something}>
            <C props={something}>
                <D props={something}>
            </C>
        </B>
    </A>

    // prop 내려주기는 제공, 사용쪽 모두 불편하다
    // 이런 prop 내려주기를 극복하기 위해 등장한 개념이 콘텍스트다
    // 콘텍스트를 사용하면 이러한 명시적 props 전달 없이도 선언한 하위 컴포넌트 모두에서 자유롭게 원하는 값을 사용할 수 있다
}

{
    // useContext는 Context를 함수 컴포넌트에서 사용할 수 있게 해준다
    // 상위 컴포넌트에서 만들어진 Context를 함수 컴포넌트에서 사용할 수 있도록 만들어진 훅
    // 상위 컴포넌트 어딘가에서 선언된 <Context.Provider />에서 제공한 값을 사용할 수 있다
    // 여러개가 존재한다면 가장 가까운 Provider의 값을 가져온다
    const Context = createContext<{hello: string} | undefined>(undefined)

    function ParentComponent(){
        return (
            <>
                <Context.Provider value={{hello: 'react'}}>
                    <Context.Provider value={{hello: 'javascript'}}>
                        <ChildComponent />
                    </Context.Provider>
                </Context.Provider>
            </>
        )
    }

    function ChildComponent(){
        const value = useContext(Context)

        //react가 아닌 javascript가 반환된다
        return <>{value ? value.hello : ''}</>
    }
}

{
    // useContext 내부에서 해당 콘텍스트가 존재하는 환경인지
    // 즉 콘텍스트가 한 번이라도 초기화되어 값을 내려주고 있는지 확인하는 코드를 작성하는것이 좋다
    // 타입스크립트를 사용하고 있으면 타입 추론에도 유용하다
    const MyContext = createContext<{hello: string} | undefined>(undefined)

    function ContextProvider({
        children,
        text,
    }: PropsWithChildren<{text: string}>){
        return (
            <MyContext.Provider value={{hello: text}}>{children}</MyContext.Provider>
        )
    }

    function useMyContext(){
        const context = useContext(MyContext)

        if(context === undefined){
            throw new Error(
                'useMyContext는 ContextProvider 내부에서만 사용할 수 있습니다.',
            )
        }

        return context
    }

    function ChildComponent() {
        //타입이 명확히 설정돼 있어서 굳이 undefined 체크를 하지 않아도 된다
        // 이 컴포넌트가 Provider 하위에 없다면 에러가 발생할 것이다
        const {hello} = useMyContext()

        return <>{hello}</>
    }

    function ParentComponent(){
        return (
            <>
                <ContextProvider text="react">
                    <ChildComponent />
                </ContextProvider>
            </>
        )
    }
}

{
    // useContext 사용시 주의점
    // 함수 컴포넌트 내부에서 사용 시 항상 컴포넌트 재활용이 어려워진다
    // useContext가 선언돼 있으면 Provider에 의존성을 가지고 있는 셈이 되므로 아무데서나 재활용하기에는 어려운 컴포넌트가 된다
    // useContext를 사용하는 컴포넌트를 최대한 작게 하거나 혹은 재사용되지 않을 만한 컴포넌트에서 사용해야 한다
    // 최상위 루트 컴포넌트에 넣는 방법
    // 콘텍스트가 많아질수록 루트 컴포넌트는 더 많은 콘텍슽로 둘러싸일 것이고 해당 props를 다수의 컴포넌트에서
    // 사용할 수 있게끔 해야 하므로 불피요한 리소스가 낭비된다

    // 일부 개발자들이 콘텍스트와 useContext를 상태 관리를 위한 리액트 API로 오해하고 있는데 상태를 주입해주는 API다
    // 상태 관리 라이브러리가 되기 위해서는
    // 1. 어떠한 상태극 기반으로 다른 상태를 만들어 낼 수 있어야 한다
    // 2. 필요에 따라 이러한 상태 변화를 최적화할 수 있어야 한다
    // 조건이 필요하지만 콘텍스트는 둘 중 어느 것도 하지 못한다
    
    const MyContext = createContext<{hello: string} | undefined>(undefined)

    function ContextProvider({
        children,
        text,
    }: PropsWithChildren<{text: string}>) {
        return (
            <MyContext.Provider value={{hello: text}}>{children}<MyContext.Provider>
        )
    }

    function useMyContext(){
        const context = useContext(MyContext)

        if(context === undefined){
            throw new Error(
                'useMyContext는 ContextProvider 내부에서만 사용할 수 있습니다.',
            )
        }

        return context
    }

    function GrandChildComponent(){
        const {hello} = useMyContext()

        useEffect(() => {
            console.log('렌더링 GrandChildComponent')
        })

        return <h3>{hello}</h3>
    }

    function ChildComponent(){
        useEffect(() => {
            console.log('렌더링 ChildComponent')
        })

        return <GrandChildComponent><GrandChildComponent/>
    }

    // text 변경시 이를 사용하는 text가 변경되는 ParentComponent컴포넌트와 이를 사용하는 GrandChildComponent만 리렌더링 될 것 같지만
    // 전체가 리렌더링 된다 이는 부모가 리렌더링이 일어나면 자식도 리렌더링이 일어나기 때문이다
    // useContext는 상태를 관리하는 마법이 아니라 주입의 기능이라는 것을 기억하고 있어야 한다
    function ParentComponent(){
        const [text, setText] = useState('')

        function handleChange(e: ChangeEvent<HTMLInputElement>) {
            setText(e.target.value)
        }

        useEffect(() => {
            console.log('렌더링 ParentComponent')
        })

        return (
            <>
                <ContextProvider text="react">
                    <input value={text} onChange={handleChange} />
                    <ChildComponent />
                </ContextProvider>
            </>
        )
    }
}

{
    // 해당 예제에서 ChildComponent가 렌더링되지 않게 막으려면 React.memo를 써야 한다
    // useContext로 상태 주입을 최적화했다면 반드시 Provider의 값이 변경될 때 어떤 식으로 렌더링되는지 눈여겨 봐야한다
    // useContext는 주입된 상태를 사용할 수 있을 뿐 그 자체로는 렌더링 최적화에 아무런 도움이 되지 않는다
    const ChildComponent = memo(() => {
        useEffect(() => {
            console.log('렌더링 ChildComponent')
        })

        return <GrandChildComponent />
    })
}

{
    // useReducer
    // useState와 비슷한 형태를 띠지만 좀 더 복잡한 상태값을 미리 정의해 놓은 시나리오에 따라 관리할 수 있다

    // 반환값은 useState와 동일하게 길이가 2인 배열
    // state: 현재 useReducer가 가지고 있는 값을 의미 useStat 반환 첫 번째 요소
    // dispatcher: state를 업데이트 하는 함수 반환 두 번째 요소
    // setState는 단순히 값을 넘겨주지만 여기서는 action을 넘겨준다는 점이 다르다 action은 state를 변경할 수 있는 액션을 의미

    // useState의 인수와 달리 2개에서 3개의 인수를 필요로 한다
    // reducer: useReducer의 기본 action을 정의하는 함수 reducer는 useReducer의 첫 번째 인수로 넘겨주어야 한다
    // initialState: 두 번째 인수로 useReducer의 초깃값
    // init: 초깃값을 지연해서 생성시키고 싶을 때 사용하는 함수 
    // 필수값이 아니며 여기에 인수로 넘겨주는 함수가 존재한다면 게으른 초기화가 일어나며 initialState를 인수로 init함수가 시행

    // 예제
    // useReducer가 사용할 state를 정의
    type State = {
        count: number
    }

    // state의 변화를 발생시킬 action의 타입과 넘겨줄 값(payload)을 정의
    // 꼭 type과 payload라는 네이밍을 지킬 필요도 없으며 굳이 객체일 필요도 없다
    // 다만 이러한 네이밍이 가장 널리 쓰인다
    type Action = {type: 'up' | 'down' | 'reset'; payload?: State}

    // 무거운 연산이 포함된 게으른 초기화 함수
    function init(count: State): State{
        // count: State를 받아서 초깃값을 어떻게 정의할지 연산하면 된다
        return count
    }

    // 초깃값
    const initalState: State = {count: 0}

    // 앞서 선언한 state와 action을 기반으로 state가 어떻게 변경될지 정의
    function reducer(state: State, action:Action): State{
        switch(action.type){
            case 'up':
                return {count: state.count + 1}
            case 'down':
                return {count: state.count - 1 > 0 ? state.count - 1 : 0}
            case 'reset':
                return init(action.payload || {count: 0})
            default:
                throw new Error(`Unexpected action type ${action.type}`)
        }
    }

    export default function App() {
        const [state, dispatcher] = useReducer(reducer, initalState, init)

        function handleUpButtonClick() {
            dispatcher({type: 'up'})
        }

        function handleDownButtonClick() {
            dispatcher({type: 'down'})
        }

        function handleResetButtonClick() {
            dispatcher({type: 'reset', payload: {count: 1}})
        } 

        return (
            <div className="App">
                <h1>{state.count}<h1>
                <button onClick={handleUpButtonClick}>+</button>
                <button onClick={handleDownButtonClick}>-</button>
                <button onClick={handleResetButtonClick}>reset</button>
            </div>
        )
    }

    // 복잡해 보일 수 있지만 목저은 간단하다
    // 복잡한 형태의 state를 사전에 정의된 dispatcher로만 수정할 수 있게 만들어 줌으로써
    // state 값에 대한 접근은 컴포넌트에서만 가능하게 하고 이를 업데이트하는 방법에 대한 상세 정의는 컴포넌트 밖에다 둔 다음
    // state의 업데이트를 미리 정의해둔 dispatcher로만 제한하는 것이다
    // state 값을 변경하는 시나리오를 제한적으로 두고 이에 대한 변경을 빠르게 확인할 수 있게끔 하는 것이 useReducer의 목적이다

    // 일반적으로 단순히 number나 boolean과 같이 간단한 값을 관리하는 것은 useState로 충분하지만
    // state가 가져야 할 값이 복잡하고 이를 수정하는 경우의 수가 많아진다면 state를 관리하는 것이 어려워진다
    // 또한 여러 개의 state를 관리하는 것보다 때로는 성격이 비슷한 여러 개의 state를 묶어 useReducer로 관리하는 편이 더 효율적일 수도 있다
    // useReducer를 사용해 state를 관리하면 state를 사용하는 로직과 이를 관리하는 비즈니스 로직을 분리할 수 있어 state를 관리하기 편해진다

    // 게으른 초기화 함수는 굳이 사용하지 않아도 된다 
    // 다만 게으른 초기화 함수를 넣어줌으로써 useState에 함수를 넣은 것과 같은 동일한 이점을 누릴 수 있고 추가로 state에 대한
    // 초기화가 필요할 때 reducer에서 이를 재사용할 수 있다는 장점도 있다
}

{
    // Preact의 useState 코드 예제
    // useReducer로 구현돼 있다

    /**
     *  @param {import('./index').StateUpdater<any>} [initialState]
     */
    export function useState(initalState){
        currentHook = 1
        return useReducer(invokeOrReturn, initalState)
    }

    // 첫 번째 인수는 값을 업데이트 하는 함수이거나 값 그 자체여야 한다
    function reducer(prevState, newState){
        return typeof newState === 'function' ? newState(prevState) : newState
    }

    // 두 번째 인수는 초깃값이기 때문에 별다른 처리를 할 필요가 없다
    // 세번째 값은 두 번째 값을 기반으로 한 게으른 초기화를 함수다 (실행값 반환)
    function init(initialArg: Initializer){
        return typeof initialArg === 'function' ? initialArg() : initialArg
    }

    // 위 두 함수를 모두 useReducer에서 사용하면 다음과 같이 useState의 작동을 흉내 낼 수 있다
    function useState(initialArg){
        return useReducer(reducer, initialArg, init)
    }
}

{
    // 이와 반대로 useReducer를 useState로 구현할 수도 있다
    const useReducer = (reducer, initialArg, init) => {
        const [state, setState] = useState(
            // 초기화 함수가 있으면 초깃값과 초기화 함수 실행
            // 그렇지 않으면 초깃값을 넣는다
            init ? () => init(initialArg) : initialArg,
        )

        // 값을 업데이트하는 dispatch를 넣어준다
        const dispatch = useCallback(
            (action) => setState((prev) => reducer(prev, action)),
            [reducer]
        )

        //이 값을 메모이제이션 한다
        return useMemo(() => [state, dispatch], [state, dispatch])
    }

    // useReducer나 useState 모두 클로저를 활용해 state를 관리한다 
    // 따라서 필요에 맞게 선택해서 사용하면 된다
}

{
    // useImperativeHandle

    // ref는 useRef에서 반환한 객체 
    // 주로 리액트 컴포넌트의 props인 ref에 넣어 HTMLElement에 접근하는 용도로 사용
    // key와 마찬가지로 ref도 리액트 컴포넌트의 props로 사용할 수 있는 예약어로서 별도로 선언돼 있지 않아도 사용 가능

    // 상위 컴포넌트에서 접근하고 싶은 ref가 있지만 이를 직접 props로 넣어 사용할 수 없다고 가정시 
    function ChildComponent({ref}){
        useEffect(() => {
            // undefined
            console.log(ref)
        }, [ref])

        return <div>안녕</div>
    }

    function ParentComponent(){
        const inputRef = useRef()

        return (
            <>
                <input ref={inputRef} />
                // 리액트에서 ref는 props로 쓸 수 없다는 경고문과 함께 접근 시도시 undefined를 반환
                <ChildComponent ref={inputRef} />
            </>
        )
    }
}

{
    // 문제 해결 코드
    // 예약어 대신 다른 props로 전달
    function ChildComponent({parentRef}) {
        useEffect(() => {
            //{current: undefined}
            //{current: HTMLInputElement}
            console.log(parentRef)
        }, [parentRef])

        return <div>안녕</div>
    }

    function ParentComponent(){
        const inputRef = useRef()

        return (
            <>
                <input ref={inputRef} />
                <ChildComponent parentRef={inputRef} />
            </>
        )
    }

    // forwardRef는 방금 작성한 코드와 동일한 작업을 하는 리액트 API
}

{
    // 단순히 props로 구현 가능하지만 ref를 전달하는데 있어서 일관성을 제공하기 위함
    // 네이밍의 자유가 주어진 props 보다는 forwardRef를 사용하면 더 확실하게 ref를 전달할 것임을 예측할 수 있고 사용 쪽에서도
    // 안정적으로 받아서 사용 가능

    // forwardRef 예제
    // 받고자 하는 컴포넌트를 forwardRef로 감싸고 두 번째 인수로 ref를 전달받는다
    // 부모 컴포넌트에서는 동일하게 props.ref를 통해 ref를 넘겨주면 된다
    const ChildComponent = forwardRef((props, ref) => {
        useEffect(() => {
            // {current: undefined}
            // {current: HTMLElement}
            console.log(ref)
        }, [ref])

        return <div>안녕!</div>
    })

    function ParentComponent(){
        const inputRef = useRef()

        return (
            <>
                <input ref={inputRef} />
                <ChildComponent ref={inputRef} />
            </>
        )
    }
}

{
    // useImperatibeHandle
    // 부모에게서 넘겨받은 ref를 원하는 대로 수정할 수 있는 훅 (원하는 값이나 액션 정의 가능)
    // 예시
    const Input = forwardRef((props, ref) => {
        //useImperativeHandle을 사용하면 ref의 동작을 추가로 정의할 수 있다
        useImperativeHandle(
            ref,
            () => ({
                alert: () => alert(props.value),
            }),
            //useEffect의 deps와 같다
            [props.value],
        )

        return <input ref={ref} {...props} />
    })

    // ref는 {current: <HTMLElement>}와 같은 형태로 HTMLElement만 주입할 수 있는 개체였다
    // 여기서는 전달받은 ref에다 useImperativeHandle 훅을 사용해 추가적인 동작을 정의했다
    // 이로써 부모는 단순히 HTMLElement뿐만 아니라 자식 컴포넌트에서 새롭게 설정한 키와 값에 대해서도 접근할 수 있게 됐다
    function App() {
        //input에 사용할 ref
        const inputRef = useRef()
        //input의 value
        const [text, setText] = useState('')

        function handleClick() {
            //inputRef에 추가한 alert라는 동작을 사용할 수 있다
            inputRef.current.alert()
        }

        function handleChange(e) {
            setText(e.target.value)
        }

        return (
            <>
                <Input ref={inputRef} value={text} onChange={handleChange} />
                <button onClick={handleClick}>Focus</button>
            </>
        )
    }
}

{
    // useLayoutEffect
    // 공식문서 정의
    // 이 함수의 시그니처는 useEffect와 동일하나 모든 DOM의 변경 후에 동기적으로 발생
    // 시그니처가 동일 = 두 훅의 형태나 사용 예제가 동일

    // 사용법 비교
    function App(){
        const [count, setCount] = useState(0)

        useEffect(() => {
            console.log('useEffect', count)
        }, [count])

        useLayoutEffect(() => {
            console.log('useLayoutEffect', count)
        }, [count])

        function handleClick() {
            setCount((prev) => prev + 1)
        }

        return (
            <>
                <h1>{count}</h1>
                <button onClick={handleClick}>+</button>
            </>
        )
    }

    // 모든 DOM의 변경 후에 라는 말에도 DOM 변경이란 렌더링이지 브라우저에 실제로 해당 변경 사항이 반영되는 시점을 의미하지 않음
    // 순서
    // 1. 리액트가 DOM을 업데이트
    // 2. useLayoutEffect를 실행
    // 3. 브라우저에 변경 사항을 반영
    // 4. useEffect를 실행

    // 동기적 실행 = useLayoutEffect의 실행이 종료될 때까지 기다른 다음 화면을 그림
    // 성능상 문제가 발생할 수도 있음

    // useLayoutEffect의 특성상 DOM은 계산됐지만 이것이 화면에 반영되기 전에 하고 싶은 작업이 있을 때와 같이 
    // 반드시 필요할 때만 사용하는 것이 좋다
    // 특정 요소에 따라 DOM 요소를 기반으로 한 애니메이션, 스크롤 위치를 제어하는 등 화면에 반영되기 전에 하고 싶은 작업에
    // useLayoutEffect를 사용한다면 useEffect를 사용했을 때보다 훨씬 더 자연스러운 사용자 경험을 제공할 수 있다
}

{
    // useDebugValue
    // 프로덕션 웹서비스에서 사용하는 훅은 아니다
    // 디버깅하고 싶은 정보를 이 훅에다 사용하면 리액트 개발자 도구에서 볼 수 있다
    
    // 예제
    // 현재 시간을 반환하는 사용자 정의 훅
    function useDate(){
        const date = new Date()
        // useDebugValue로 디버깅 정보를 기록
        useDebugValue(date, (date) => `현재 시간: ${date.toISOString()}`)

        return date
    }

    export default function App(){
        const date = useDate()
        const [counter, setCounter] = useState(0) //렌더링을 발생시키기 위한 변수

        function handleClick() {
            setCounter((prev) => prev + 1)
        }

        return (
            <div className="App">
                <h1>
                    {counter} {date.toISOString()}
                </h1>
                <button onClick={handleClick}>+</button>
            </div>
        )
    }

    // useDebugValue는 사용자 정의 훅 내부의 내용에 대한 정보를 남길 수 있는 훅
    // 두 번째 인수로 포매팅 함수를 전달하면 이에 대한 값이 변경됐을 때만 호출되어 포매팅된 값 노출
    // 오직 다른 훅 내부에서만 실행 가능 
    // 컴포넌트 레벨에서 작동 x
}

{
    // 훅의 규칙 (rules-of-hooks)
    // 이와 관련된 ESLint 규칙인 react-hooks/rules-of-hooks도 존재

    // 공식문서에서 훅의 규칙
    // 1. 최상위에서만 훅을 호출해야 한다 반복문이나 조건문, 중첩된 함수 내에서 훅을 실행할 수 없다
    // 이 규칙을 따라야만 컴포넌트가 렌더링될 때마다 항상 동일한 순서로 훅이 호출되는 것을 보장할 수 있다
    // 2. 훅을 호출할 수 있는 것은 리액트 함수 컴포넌트, 혹은 사용자 정의 훅의 두 가지 경우뿐이다 일반 자바스크립트 함수에서는 훅을 사용할 수 없다

    // useState는 훅에 대한 정보 저장은 리액트 어딘가에 있는 index와 같은 키를 기반으로 구현(실제로는 객체 기반 링크드 리스트에 더 가깝다)
    // 즉 useState나 useEffect는 모두 순서에 아주 큰 영향을 받는다
    
    // 예제
    function Component(){
        const [count, setCount] = useState(0)
        const [required, setRequired] = useState(false)

        useEffect(() => {
            // do something...
        }, [count, required])
    }

    // 이 컴포넌트는 파이버에서 다음과 같이 저장
    {
        memoizedState: 0, // setCount 훅
        baseState: 0,
        queue: { /** ... */},
        baseUpdate: null,
        next: { //setRequired훅
            memoizedState: false,
            baseState: false,
            queue: { /** ... */},
            baseUpdate: null,
            next: { //useEffect훅
                memoizedState: {
                    tag: 192,
                    create: () => {},
                    destroy: undefined,
                    deps: [0, false],
                    next: {/*...*/}
                },
                baseState: null,
                queue: null,
                baseUpdate: null,
            }
        }
    }

    // 리액트 훅은 파이버 객체의 링크드 리스트의 호출 순서에 따라 저장
    // 각 훅이 파이버 객체 내에서 순서에 의존해 state나 effect의 결과에 대한 값을 저장하고 있기 떄문
    // 고정된 순서에 의존함으로써 이전 값에 대한 비교와 실행이 가능
}

{
    // 순서를 보장받을 수 없는 상황
    // 훅의 잘못된 예제

    // setName을 빈 값으로 업데이트 시
    // 첫번째 useEffect의 조건문으로 인해 2번째 훅이 useState가 되어버렸다
    // 즉 링크드 리스트가 깨져버렸다 
    // 이렇게 조건이나 다른 이슈로 인해 훅의 순서가 깨지거나 보장되지 않을 경우 리액트 코드는 에러를 발생시킨다
    function Form(){
        const [name, setName] = useState('Mary')

        if(name !== ''){
            useEffect(function persistForm(){
                localStorage.setItem('formData', name)
            })
        }

        const [surname, setSurname] = useState('Poppins')

        useEffect(function updateTitle(){
            document.title = name + ' ' + surname
        })

        //...
    }

    // 이 상황을 코드로 나타내면 다음과 같다
    // 최초 렌더링
    useState('Mary') // 1. 'Mary' 할당
    useEffect(persistForm) // 2. 1에 있던 state를 기반으로 effect 실행
    useState('Poppins') //3. 'Poppins' 할당
    useEffect(updateTitle) //4. 3에 이는 35를 기반으로 effect 실행

    //두 번째 렌더링
    useState('Mary') //1. state를 읽음(useState의 인수는 첫 번째 렌더링에서 초깃값으로 사용됐으므로 여기에서 인수값은 무시, 저장해 두었던 Mary값 사용)
    // useEffect(persistForm) // 조건문으로 실행 안됨
    useState('Poppins') // 2. 원래는 3이었음 2가 되면서 useState의 값을 읽어오지 못하고 비교도 할 수 없음
    useEffect(updateTitle) //3. 원래는 4였음 updateTitle을 하기 위한 함수를 대체하는데 실패
}