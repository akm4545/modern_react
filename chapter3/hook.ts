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
}