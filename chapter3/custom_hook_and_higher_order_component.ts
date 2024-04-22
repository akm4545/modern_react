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
}