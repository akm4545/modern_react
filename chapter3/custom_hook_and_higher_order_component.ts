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
    // 사용자 인증 정보에 따라서 인증된 사용자에게는 개인화된 컴포넌트를 그렇지 않은 사용자에게는 별도로 정의된 공통 컴포넌트를 보여주는 시나리오
    // 고차 함수의 특징에 따라 개발자가 만든 또 다른 함수를 반환할 수 있다는 점에서 고차 컴포넌트를 사용하면 매우 유용하다
    // 예제
    interface LoginProps{
        loginRequired?: boolean
    }

    function withLoginComponent<T>(Component: ComponentType<T>) {
        return function (props: T & LoginProps) {
            const {loginRequired, ...restProps} = props

            if(loginRequired){
                return <>로그인이 필요합니다.</>
            }

            return <Component {...(restProps as T)} ><Component />
        }
    }
    
    // 원래 구현하고자 하는 컴포넌트를 만들고 withLoginComponent로 감싸기만 하면 끝이다
    // 로그인 여부, 로그인이 안 되면 다른 컴포넌트를 렌더링하는 책임은 모두
    // 고차 컴포넌트인 withLoginComponent에 맡길 수 있어 매우 편리하다

    // 1. withLoginComponent 함수를 실행하기 전에 익명 함수를 실행하여 h3 컴포넌트 반환
    // 2. h3 컴포넌트가 withLoginComponent의 인수로 들어가게 된다
    // 3. props 타입은 ComponentType<h3> 타입과 LoginProps 타입의 유니온 타입 
    const Component = withLoginComponent((props: {value: string}) => {
        return <h3>{props.value}</h3>
    })

    export default function App(){
        // 로그인 관련 정보를 가져온다
        const isLogin = true
        return <Component value="text" loginRequired={isLogin} ><Component />
        // return <Component value="text" />;
    }

    // Component는 일바적인 함수 컴포넌트와 같은 평범한 컴포넌트지만 이 함수 자체를 withLoginComponent라 불리는 고차 컴포넌트로 감싸뒀다
    // withLoginComponent는 함수(함수 컴포넌트)를 인수로 받으며 컴포넌트를 반환하는 고차 컴포넌트다
    // 이 컴포넌트는 props에 loginRequired가 있다면 넘겨받은 함수를 반환하는것이 아니라 "로그인이 필요합니다" 라는 전혀 다른 결과를 반환한다
    // 이러한 인증 처리는 서버나 NGINX와 같이 자바스크립트 이전 단계에서 처리하는 편이 훨씬 효율적이다

    // 이처럼 고차 컴포넌트는 컴포넌트 전체를 감쌀 수 있다는 점에서 사용자 정의 훅보다 더욱 큰 영향력을 컴포넌트에 미칠 수 있다
    // 단순히 값을 반환하는 부수 효과를 실행하는 사용자 정의훅과는 다르게 고차 컴포넌트는 컴포넌트의 결과물에 영향을 미칠 수 있는 다른 공통된 작업을 처리할 수 있다
}

{
    // 고차 컴포넌트 주의점
    // 고차 컴포넌트는 with로 시작하는 이름을 사용해야 한다
    // 리액트 라우터의 withRouter와 같이 리액트 커뮤니티에 널리 퍼진 일종의 관습이라 볼 수 있다
    // with가 접두사로 붙어 있으면 고차 컴포넌트임을 손쉽게 알아채어 개발자 스스로가 컴포넌트 사용에 주의를 기울일 수 있으므로 반드시 with로 시작하는
    // 접두사로 고차 컴포넌트로 만들자

    // 고차 컴포넌트는 부수 효과를 최소화해야 한다
    // 고차 컴포넌트는 반드시 컴포넌트를 인수로 받게 되는데 반드시 컴포넌트의 props를 임의로 수정, 추가, 삭제하는 일은 없어야 한다
    // 앞의 예제의 경우 loginRequired라는 props를 추가했을 뿐 기존의 인수로 받는 props는 건드리지 않았다
    // 만약 기존 컴포넌트에서 사용하는 props를 수정하거나 삭제한다면 고차 컴포넌트를 사용하는 쪽에서 언제 props가 수정될지 모른다는 우려를 가지고 개발해야 하는 불편함이 생긴다
    // 이는 컴포넌트를 이용하는 입장에서 예측하지 못한 상황에서 props가 변경될지도 모른다는 사실을 계속 염두에 둬야 하는 부담감을 주게 된다
    // 만약 컴포넌트에 무언가 추가적인 정보를 제공해 줄 목적이라면 별도로 props로 내려주는 것이 좋다

    // 마지막으로 주의할 점은 여러 개의 고차 컴포넌트로 컴포넌트를 감쌀 경우 복잡성이 커진다는 것이다
    // 고차 컴포넌트가 컴포넌트를 또 다른 컴포넌트로 감싸는 구조로 돼 있다 보니 여러 개의 고차 컴포넌트가 반복적으로 
    // 컴포넌트를 감쌀 경우 복잡성이 매우 커진다
    // 고차 컴포넌트가 증가할수록 개발자는 이것이 어떤 결과를 만들어 낼지 예측하기 어려워진다
    // 따라서 고차 컴포넌트는 최소한으로 사용하는 것이 좋다
    const Component = withHigherOrderComponent1(
        withHigherOrderComponent2(
            withHigherOrderComponent3(
                withHigherOrderComponent4(
                    withHigherOrderComponent5(() => {
                        return <>안녕하세요</>
                    }),
                ),
            ),
        ),
    )
}

{
    // 사용자 정의 훅이 필요한 경우
    // 단순히 useEffect, useState와 같이 리액트에서 제공하는 훅으로만 공통 로직을 격리할 수 있다면 사용자 정의 훅을 사용하는 것이 좋다
    // 사용자 정의 훅은 그 자체로는 렌더링에 영향을 미치지 못하기 때문에 사용이 제한적이므로 반환하는 값을 바탕으로 무엇을 할지는 개발자에게 달려 있다
    // 따라서 컴포넌트 내부에 미치는 영향을 최소화해 개발자가 훅을 원하는 방향으로만 사용할 수 있다는 장점이 있다

    // 예제
    // 사용자 정의 훅을 사용하는 경우
    // useLogin 훅은 단순히 loggedIn에 대한 값만 제공 이에 대한 처리는 컴포넌트를 사용하는 쪽에서 원하는 대로 사용 가능
    // 따라서 부수 효과가 비교적 제한적이라 볼 수 있다
    function HookComponent() {
        const {loggedIn} = useLogin()

        useEffect(() => {
            if(!loggedIn){
                //do something....
            }
        }, [loggedIn])
    }

    // 고차 컴포넌트를 사용하는 경우
    // 번면 withLoginComponent는 고차 컴포넌트가 어떤 일을 하는지 어떤 결과물을 반환할지는 고차 컴포넌트를 직접 보거나 실행하기 전까지는 알 수 없다
    // 대부분의 고차 컴포넌트는 렌더링에 영향을 미치는 로직이 존재하므로 사용자 정의 훅에 비해 예측하기가 어렵다
    // 따라서 단순히 컴포넌트 전반에 걸쳐 동일한 로직으로 값을 제공하거나 특정한 훅의 작동을 취하게 하고 싶다면 사용자 정의 훅을 사용하는것이 좋다
    const HOCComponent = withLoginComponent(() => {
        //do something...
    })
}