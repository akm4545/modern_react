{
    // 리액트에서는 재사용할 수 있는 로직을 관리할 수 있는 두 가지 방법이 있다
    // 사용자 훅과 고차 컴포넌트다
}

{
    // 사용자 정의 훅
    // 서로 다른 컴포넌트 내부에서 같은 로직을 공유하고자 할 때 주로 사용
    // 고차 컴포넌트는 굳이 리액트가 아니더라도 사용할 수 있는 기법
    // 사용자 정의 훅은 리액트에서만 사용할 수 있는 방식
    // 훅을 기반으로 개발자가 필요한 훅을 만드는 기법
    // 사용자 정의 훅의 규칙 중 하나는 이름이 반드시 use로 시작하는 함수를 만들어야 한다 (리액트 훅이라는 것을 바로 인식)

    // HTTP 요청을 하는 fetch를 기반으로 한 사용자 정의 훅을 만든 예제
    import {useEffect, useState} from 'react'

    //HTTP 요청을 하는 사용자 정의 훅
    function useFetch<T>(
        url: string,
        {method, body}: {method: string; body?: XMLHttpRequestBodyInit},
    ) {
        // 응답 결과
        const [result, setResult] = useState<T | undefined>()
        // 요청 중 여부
        const [isLoading, setIsLoading] = useState<boolean>(false)
        // 2xx 3xx로 정상 응답인지 여부
        const [ok, setOk] = useState<boolean | undefined>()
        // HTTP status
        const [status, setStatus] = useState<number | undefined>()

        useEffect(() => {
            const abortController = new AbortController();

            (async () => {
                setIsLoading(true)

                const response = await fetch(url, {
                    method,
                    body,
                    signal: abortController.signal,
                })

                setOk(response.ok)
                setStatus(response.status)

                if(response.ok){
                    const apiResult = await response.json()
                    setResult(apiResult)
                }

                setIsLoading(false)
            })()

            return () => {
                abortController.abort()
            }
        }, [url, method, body])

        return {ok, result, isLoading, status}
    }

    interface Todo {
        userId: number
        id: number
        title: string
        completed: boolean
    }

    export default function App() {
        //사용자 지정 훅 사용
        cosnt {isLoading, result, status, ok} = useFetch<Array<Todo>>(
            'https://jsonplaceholder.typicode.com/todos',
            {
                method: 'GET',
            },
        )

        useEffect(() => {
            if (!isLoading){
                console.log('fetchResult >>', status)
            }
        }, [status, isLoading])

        return (
            <div>
                {ok
                    ? (result || []).map(({userId, title}, index) => (
                        <div key={index}>
                            <p>{userId}</p>
                            <p>{title}</p>
                        </div>
                    ))
                : null}
            </div>
        )
    }

    // 훅으로 분리하지 않았다면 fetch로 API를 호출하는 모든 컴포넌트 내에서 공통적으로 관리되지 않는 최소 4개의 state를 
    // 선언해서 각각 구현했어야 한다
    // useReducer로 최적화해도 마찬가지로 useEffect도 필요하기 때문에 이 두 가지 훅을 fetch가 필요한 곳마다 중복해서 사용해야 한다

    // 사용자 정의 훅은 내부에 useState와 useEffect 등을 가지고 자신만의 원하는 훅을 만드는 기법으로 내부에서 훅을 사용하고 있기
    // 때문에 당연히 이름에 use를 붙어야 한다
    // react-hooks/rules-of-hooks의 도움을 받기 위해서는 use로 시작하는 이름을 가져야 한다 그렇지 않으면 에러가 발생한다
    
    // 이름을 useFetch에서 fetch로 변경
    function fetch<T>(
        url: string,
        {method, body}: {method: string; body?: XMLHttpRequestBodyInit},
    ){
        // 에러 발생
        const [result, setResult] = useState<T | undefined>()
        //...
    }

    // 이러한 사용자 정의 훅은 리액트 커뮤니티에서 다양하게 찾아볼 수 있다
    // use-Hooks, react-use, ahooks 등의 저장소가 있다
}

{
    // 고차 컴포넌트(HOC, Higher Order Component)
    // 컴포넌트 자체의 로직을 재사용하기 위한 방법
    // 고차 함수의 일종으로 자바스크립트의 일급 객체, 함수의 특징을 이용
    // 다양한 최적화나 중복 로직 관리 ex) React.memo
}

{
    // React.memo
    
    // 렌더링 조건 중 부모 컴포넌트 리렌더링 시 자식 컴포넌트의 props 변경 여부와 관계없이 리렌더링 됨
    // 예제 ParentComponent의 handleChange로 인하여 리렌더링 되면 ChildComponent도 리렌더링
    const ChildComponent = ({value} : {value: string}) => {
        useEffect(() => {
            console.log('렌더링!')
        })

        return <>안녕하세요! {value}</>
    }

    function ParentComponent(){
        const [state, setState] = useState(1)

        function handleChange(e: ChangeEvent<HTMLInputElement>){
            setState(Number(e.target.value))
        }

        return (
            <>
                <input type="number" value={state} onChange={handleChange} />
                <ChildComponent value="hello" />
            </>
        )
    }
}

{
    // 이를 방지하기 위해 만들어진 리액트의 고차 컴포넌트가 React.memo
    // props를 비교하여 같다면 렌더링 생략 이전에 기억해 둔 컴포넌트 반환
    // 해당 코드는 ChildComponent 리렌더링 x
    // 클래스 컴포넌트의 PureComponent와 매우 유사
    const ChildComponent = memo(({value} : {value: string}) => {
        useEffect(() => {
            console.log('렌더링!')
        })

        return <>안녕하세요! {value}</>
    })

    function ParentComponent(){
        const [state, setState] = useState(1)

        function handleChange(e: ChangeEvent<HTMLElement>){
            setState(Number(e.target.vale))
        }

        return (
            <>
                <input type="number" value={state} onChange={handleChange} />
                <ChildComponent value="hello" />
            </>
        )
    }
}

{
    // React.memo는 컴포넌도 값이라는 관점에서 본 것
    // useMemo를 사용해도 동일하게 메모이제이션 가능
    // JSX 함수 방식이 아닌 {}을 사용한 할당식을 사용한다는 차이점 존재
    // 코드 작성과 리뷰의 입장에서 혼선을 빚을 수 있으므로 목적과 용도가 뚜렷한 memo를 사용하는 편이 좋다
    function ParentComponent() {
        const [state, setState] = useState(1)

        function handleChange(e: ChangeEvent<HTMLInputElement>){
            setState(number(e.target.value))
        }

        const MemoizedChildComponent = useMemo(() => {
            return <ChildComponent value="hello" />
        }, [])

        return (
            <>
                <input type="number" value={state} onChange={handleChange} />
                {MemoizedChildComponent}
            </>
        )
    }
}

{
    // 고차 함수 만들기
    // 리액트 함수 컴포넌트도 결국 함수이기 때문에 함수를 기반으로 고차 함수를 만드는 것을 먼저 이해해야 한다
    // 고차 함수 = 함수를 인수로 받거나 결과로 반환하는 함수 

    // 가장 대표적인 고차 함수로는 Array.prototype.map
    const list = [1, 2, 3]
    // (item) => item * 2 즉 함수를 인수로 받는다
    const doubledList = list.map((item) => item * 2)

    // 리액트 코드 
    // 즉시 실행 함수로 setter를 만든다
    // 함수를 결과로 반환하는 조건을 만족하므로 고차 함수라 할 수 있다
    const setState = (function () {
        // 현재 index를 클로저로 가둬둬서 이후에도 계속해서 동일한 index에 
        // 접근할 수 있도록 한다
        let currentIndex = index

        return function (value) {
            global.states[currentIndex] = value
            // 컴포넌트를 렌더링한다 실제로 컴포넌트를 렌더링하는 코드는 생략
        }
    })()

    // 두 값을 더하는 함수를 고차 함수로 구현
    function add(a){
        return function(b) {
            return a + b
        }
    }

    const result = add(1) //여기서 result는 앞서 반환한 함수를 가리킨다
    const result2 = result(2) //비로소 a와 b를 더한 3이 반환된다

    // 이처럼 고차 함수를 활용하면 함수를 인수로 받거나 새로운 함수를 반환해 완전히 새로운 결과를 만들어 낼 수 있다
    // 자연스럽게 리액트의 함수 컴포넌트도 함수이므로 고차 함수를 사용하면 다양한 작업을 할 수 있다
}

{
    // 고차 함수를 활용한 리액트 고차 컴포넌트 만들기
}