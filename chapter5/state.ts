{
    // 상태 
    // 어떠한 의미를 가진 값이며 애플리케이션의 시나이로에 따라 지속적으로 변경될 수 있는 값을 의미

    // 상태의 대표적 예
    // UI: 기본적으로 웹 애플리케이션에서 상태라 함은 상호작용이 가능한 모든 요소의 현재 값을 의미
    // 다크/라이트 모드, 라디오를 비롯한 각종 input, 알림창의 노출 여부 등 많은 종류의 상태가 존재

    // URL: 브라우저에서 관리되고 있는 상태값
    // https://www.airbnb.co.kr/rooms/34113796?adults=2와 같은 주소가 있다고 가정할때
    // 이 주소에는 roomId=34113796과 adults=2라고 하는 상태가 존재하며 이 상태는 사용자의 라우팅에 따라 변경

    // 폼(form): 로딩 중인지(loading), 현재 제출됐는지(submit), 접근이 불가능한지(disabled), 값이 유효한지(validation) 등 모두 상태로 관리

    // 서버에서 가져온 값: 클라이언트에서 서버로 요청을 통해 가져온 값 대표적으로 API 요청
}

{
    // 리액트에서도 여러 값의 상태 관리에 대한 필요성 존재
    // 애플리케이션 개발에 모든 것을 제공하는 프레임워크를 지향하는 Angular와 다르게 리액트는 단순히 사용자 인터페이스를 만들기 위한 라이브러리였다
}

{
    // Flux 패턴
    // Context API (엄밀히 따지면 상태관리가 아닌 주입) useContext, 리덕스가 나오기 전까지는 유명한 상태 관리 라이브러리가 없었다
    // 전역 상태 관리의 어려움 

    // 웹 애플리케이션이 비대해지고 상태(데이터)도 많아짐에 따라 추적하고 이해하기 매우 어려운 상황이 됨
    // 페이스북 팀은 이러한 문제의 원인을 양방향 데이터 바인등으로 봤다
    // 뷰(HTML)가 모델(자바스크립트)을 변경 가능 / 반대의 경우도 변경 가능
    // 코드 작성 입장에서는 간단하지만 코드의 양이 많아지고 변경 시나리오가 복잡해질수록 관리하기 어려움
    // 이러한 양방향을 단방향 데이터 흐름으로 변경하는 것을 제안했는데 이것이 Flux 패턴의 시작
    // Action -> Dispatcher -> Model -> View

    // 액션(action): 어떠한 작업을 처리할 액션과 그 액션 발생 시 함께 포함시킬 데이터를 의미 액션 타입과 데이터를 각각
    // 정의해 이를 디스패처로 보냄

    // 디스패처(dispatcher): 액션을 스토어에 보내는 역할 콜백 함수 형태로 앞서 액션이 정의한 타입과 데이터를 모두 스토어에 보냄

    // 스토어(store): 실제 상태에 따른 값과 상태를 변경할 수 있는 메서드를 가지고 있다 액션의 타입에 따라 어떻게 이를 변경할지가 정의

    // 뷰(view): 리액트 컴포넌트에 해당하는 부분 스토어에서 만들어진 데이터를 가져와 화면을 렌더링하는 역할
    // 뷰에서도 사용자의 입력이나 행위에 따라 상태를 업데이트하고자 할 수 있을 것이다
    // 이 경우 흐름도는 다음과 같다

    //                  <-  Action(Dispatcher로) <-
    // Action -> Dispatcher -> Store -> View

    // 예제
    type StoreState = {
        count: number
    }

    // Action 정의
    type Action = { type: 'add'; payload: number }

    // 스토어 역할 (값이 어떻게 변경되는지 정의)
    function reducer(prevState: StoreState, action: Action){
        const { type: ActionType } = action

        if(ActionType === 'add'){
            return {
                count: prevState.count + action.payload
            }
        }

        throw new Error(`Unexpected Action [${ActionType}]`)
    }

    export default function App(){
        // 스토어 역할 (현재 상태)
        const [state, dispatcher] = useReducer(reducer, { count: 0 })

        function handleClick() {
            // dispatcher (액션 실행 -> 스토어로 전송)
            dispatcher({ type: 'add', payload: 1})
        }

        // 뷰 
        return (
            <div>
                <h1>{state.count}</h1>
                <button onClick={handleClick}>+</button>
            </div>
        )
    }

    // 사용자의 입력에 따라 데이터를 갱신하고 화면을 어떻게 업데이트해야 하는지도 코드로 작성해야 하므로
    // 코드의 양이 많아지고 개발자도 수고스로워진다
    // 그러나 데이터의 흐름은 모두 액션이라는 단방향으로 줄어들므로 데이터의 흐름을 추적하기 쉽고 코드를 이해하기가 한결 수월해진다
    // 리액트는 대표적 단방향 데이터 바인딩을 기반으로 한 라이브러리이므로 이런 Flux 패턴과 궁합이 잘 맞았다
}

{
    // 리덕스(Redux)
    // Flux 구조를 구현하기 위해 만들어진 라이브러리 중 하나
    // Elm 아키텍처를 도입

    // Elm 
    // 웹페이지를 선언적으로 작성하기 위한 언어

    // Elm을 이용해 HTML을 작성한 예제
    // model, update, view 세 가지가 Elm 아키텍처의 핵심이다
    // 모델(model): 애플리케이션의 상태를 의미 여기서는 Model을 의미하며 초깃값으로는 0이 주어졌다
    // 뷰(view): 모델을 표현하는 HTML을 말한다. 여기서는 Model을 인수로 받아서 HTML을 표현한다
    // 업데이트(update): 모델을 수정하는 방식을 말한다 Increment, Decremnet를 선언해 각각의 방식이 어떻게 모델을 수정하는지 나타냈다
    module Main exposing (..)

    import Browser
    import Html exposing (Html, button, div, text)
    import Html.Events exposing (onClick)

    -- MAIN
    main =
        Browser.sandbox { init = init, update = update, view = view }

    -- MODEL
    type alias Model = Int

    init : Model
    init = 
        0

    -- UPDATE
    type Msg
        = Increment
        | Decrement
    
    update : Msg -> Model -> Model
    update msg model =
        case msg of
            Increment ->
                model + 1
            
            Decrement ->
                model - 1
    
    -- VIEW

    view : Model -> Html Msg
    view model = 
        div []
            [ button [ onClick Decrement ] [ text "-" ]]
            , div [] [ text (String.fromInt model) ]
            , button [ onClick Increment ] [ text "+" ]
            ]
    <div>
        <button>-</button>
        <div>2</div>
        <button>+</button>
    </div>

    // Elm은 Flux와 마찬가지로 뎅터 흐름을 세 가지로 분류하고 단방향으로 강제해 웹 애플리케이션의 상태를 안정적으로 관리하고자 노력했다
    // 리덕스는 Elm 아키텍처의 영향을 받아 작성됐다

    // 리덕스는 하나의 상태 객체를 스토어에 저장 
    // 객체 업데이트 작업을 디스패치해 업데이트 수행
    // 이러한 작업을 reducer 함수로 발생 완전히 새로운 복사본을 반환한 다음 애플리케이션에 이 새롭게 만들어진 상태를 전파

    // 하나의 글로벌 상태 객체를 통해 이 상태를 하위 컴포넌트에 전파할 수 있기 때문에 props를 깊이 전파해야 하는 prop 내려주기 문제를 해결
    // 스토어가 필요한 컴포넌트라면 단지 connect만 쓰면 스토어 접근 가능

    // 리덕스는 단순히 하나의 상태를 바꾸고 싶어도 해야 할 일이 너무 많았다
    // 액션 타입을 선언하고 이 액션을 수행할 creator, 함수를 만들어야 한다
    // 그리고 dispatcher와 selector도 필요하고 새로운 상태가 기존의 리듀서 내부에서 어떤 식으로 변경돼야 할지, 혹은 새로 만들어야 할지도
    // 새로 정의해야 했다
}

{   
    // prop 내려주기를 방지하기위한 상태 주입
    // 리액트 16.3 버전 이전에 존재했던 context와 getChildContext() 예제
    // 문제점
    // 1. 상위 컴포넌트가 렌더링되면 getChildContext도 호출됨과 동시에 shouldComponentUpdate가 항상 true를 반환해 불필요하게 렌더링이 일어남
    // 2. getChildContext를 사용하기 위해서는 context를 인수로 받아야 하는데 이 때문에 컴포넌트와 결합도가 높아짐
    class MyComponent extends React.Component {
        static childContextTypes = {
            name: PropTypes.string,
            age: PropTypes.number
        }

        getChildContext(){
            return {
                name: 'foo',
                age: 30,
            }
        }

        render() {
            return <ChildComponent />
        }
    }

    function ChildComponent(props, context){
        return (
            <div>
                <p>Name: {context.name}</p>
                <p>Age: {context.age}</p>
            </div>
        )
    }

    ChildComponent.contextTypes = {
        name: PropTypes.string,
        age: PropTypes.number,
    }
}

{
    // 이런 단점을 해결하기 위해 16.3 버전에서 새로운 context 출시
    // Context API 예제

    // 부모 컴포넌트 MyApp에 상태 선언
    // 이를 Context로 주입 (Context.Provider)
    // 자식 컴포넌트에서 사용 (Context.Consumer)
    type Counter = {
        count: number
    }

    const CounterContext = createContext<Counter | undefined>(undefined)

    class CounterComponent extends Component{
        render(){
            return (
                <CounterContext.Consumer>
                    {(state) => <p>{state?.count}</p>}
                </CounterContext.Consumer>
            )
        }
    }

    class DummyParent extends Component {
        render() {
            return (
                <>
                    <CounterComponent />
                </>
            )
        }
    }

    export default class MyApp extends Component<{}, Counter> {
        state = { count: 0 }

        componentDidMount(){
            this.setState({ count: 1 })
        }

        handleClick = () => {
            this.setState((state) => ({ count: state.count + 1 }))
        }

        render() {
            return (
                <CounterContext.Provider value={thi.state}>
                    <button onClick={this.handleClick}>+</button>
                    <DummyParent />
                </CounterContext.Provider>
            )
        }
    }
}

{
    // 훅 / React Query / SWR
    
    // 훅의 등장으로 state를 매우 손쉽게 재사용 가능해짐
    // useCounter는 단순히 count state와 이를 1씩 올려주는 함수로 구성
    // 내부적으로 관리하고 있는 state(count)도 있으며 이를 필요한 곳에서 재사용 가능 (return {count, increase})
    function useCounter() {
        const [count, setCount] = useState(0)

        function increase() {
            setCount((prev) => prev + 1)
        }

        return {count, increase}
    }

    // 이러한 훅과 state의 등장으로 새로운 상태 관리 React Query와 SWR이 등장
    // 두 라이브러리 모두 외부에서 데이터를 불러오는 fetch를 관리하는데 특화된 라이브러리
    // API에 대한 생태르 관리하고 있기 떄문에 HTTP 요청에 특화된 상태 관리 라이브러리
}

{
    // SWR 응용 코드
    import React from 'react'
    import useSWR from 'swr'

    const fetcher = (url) => fetch(url).then((res) => res.json())

    export default function App() {
        const { data, error } = useSWR(
            'https://api.github.com/repos/vercel/swr',
            fetcher,
        )

        if(error) return 'An error has occurred.'
        if(!data) return 'Loading...'

        return (
            <div>
                <p>{JSON.stringify(data)}</p>
            </div>
        )
    }
}