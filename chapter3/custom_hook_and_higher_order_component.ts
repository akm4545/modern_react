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
    // 
}