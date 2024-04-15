{
    // 초기 함수 컴포넌트 = stateless functional component 
    // 단순히 어떠한 요소를 정적으로 렌더링 하는것이 목적

    // 0.14버전의 함수 컴포넌트 소개 코드
    // 별다른 생명주기 메서드나 상태(this.state)가 필요없이 render만 하는 경우에만 제한적으로 사용
    var Aquarium = (props) => {
        var fish = getFish(props.species)
        return <Tank>{fish}</Tank>
    }

    var Aquarium2 = ({species}) => <Tank>{getFish(species)}</Tank>

    // 16.8버전에서 훅이 등장한 이후 함수 컴포넌트에서 상태나 생명주기 메서드 비슷한 작업을 흉내내기가 가능
    // 상대적으로 보일러플레이트가 복잡한 클래스 컴포넌트보다 함수 컴포넌트를 더 많이 사용
}

{
    // 클래스 컴포넌트

    // 구조
    // 클래스 선언
    // 만들고 싶은 컴포넌트를 extends(React.Component, React.PureComponent) 해야 함
    import React from 'react'

    class SampleComponent extends React.Component {
        render(){
            return <h2>Sample Component</h2>
        }
    }
}

{
    // 컴포넌트를 만들 때 쓰이는 props, state, 메서드 정의 예제
    import React from 'react'

    // props 타입 선언
    interface SampleProps{
        required?: boolean
        text: string
    }

    // state 타입 선언
    interface SampleState{
        count: number
        isLimited?: boolean
    }

    //Component에 제네릭으로 props, state를 순서대로 넣는다
    class SampleComponent extends React.Component<SampleProps, SampleState> {
        // constructor에서 props를 넘겨주고 state의 기본값 설정
        private constructor(props: SampleProps){
            super(props)

            this.state = {
                count: 0,
                isLimited: false,
            }
        }

        // render 내부에서 쓰일 함수를 선언
        private handleClick = () => {
            const newValue = this.state.count + 1
            this.setState({count: newValue, isLimited: newValue >= 10})
        }

        // render에서 이 컴포넌트가 렌더링할 내용을 정의
        public render(){
            //props와 state값을 this, 즉 해당 클래스에서 꺼낸다
            const {
                props: {required, text},
                state: {count, isLimited}
            } = this

            return (
                <h2>
                    Sample component
                    <div>{required ? '필수' : '필수아님'}</div>
                    <div>문자: {text}</div>
                    <div>count: {count}</div>
                    <button onClick={this.handleClick} disabled={isLimited}>
                        증가
                    </button>
                </h2>
            )
        }
    }

    // constructor(): 생성자(컴포넌트 초기화 시점 호출) 컴포넌트의 state를 초기화 
    // super()는 상위 컴포넌트 즉 React.Component의 생성자 함수를 먼저 호출해 필요한 상위 컴포넌트에 접근
    // props: 컴포넌트에 특정 속성을 전달하는 용도 
    // 위 예제에서는 props가 {required?: boolean; text: string;} 형태로 선언
    // 해당 컴포넌트를 호출하기 위해선 <SampleComponent text="안녕하세요" /> 와 같은 형식으로 선언
    // state: 컴포넌트 내부 관리 값 항상 객체여야 함 해당 값이 변할때마다 리렌더링 발생
    // 메서드: 렌더링 함수 내부에서 사용 보통 DOM 발생 이벤트와 함께 사용

    // 3가지 방식으로 만든다
    // 1. constructor에서 this 바인딩: 함수로 메서드를 만들면 this가 undefined로 나옴 (생성자가 아닌 일반 함수 호출 시 this = 전역 객체가 바인딩)
    // 생성된 함수에 bind를 활용해 강제로 this 바인딩을 해야함

    // this 바인딩 예제
    import {Component} from 'react'

    // 빈 Props를 선언
    type Props = Record<string, never>

    interface State {
        count: number
    }

    class SampleComponent2 extends Component<Props, State> {
        private constructor(props: Props){
            super(props)

            this.state = {
                count: 1,
            }

            // handleClick의 this를 현재 클래스로 바인딩
            this.handleClick = this.handleClick.bind(this)
        }

        private handleClick(){
            this.setState((prev) => ({count: prev.count + 1}))
        }

        public render(){
            const {
                state: {count},
            } = this

            return (
                <div>
                    <button onClick={this.handleClick}>증가</button>
                    {count}
                </div>
            )
        }
    }

    // 2. 화살표 함수 사용: 실행 시점이 아닌 작성 시점에 this가 상위 스코프로 결정
    // 3. 렌더링 함수 내부에서 함수를 새롭게 만들어 전달하는 방법: 다음과 같이 메서드 내부에서 새롭게 함수를 만들어 전달
    // 해당 방법은 렌더링시 매번 새로운 함수를 생성해서 할당하므로 최적화를 수행하기 매우 어려움 지양필요
    <button onClick={() => this.handleClick()}>증가</button>
    
    // constructor 미사용 state 초기화 코드
    // ES2022에 추가된 클래스 필드 덕분에 가능한 문법
    // 초기화 과정을 거치지 않아도 클래스 내부에 필드를 선언할 수 있게 도와줌
    import {Component} from 'react'

    class SampleComponent3 extends Component {
        state = {
            count: 1,
        }

        render() {
            const {
                state: {count},
            } = this
            
            return <div>{count}</div>
        }
    }
}

{
    // 생명주기 메서드
    // 실행 시점 (크게 3가지 분류)
    // 마운트(mount): 컴포넌트 마운팅(생성) 시점
    // 업데이트(update): 이미 생성된 컴포넌트의 내용 변경
    // 언마운트(unmount): 컴포넌트가 더 이상 존재하지 않는 시점

    // render()
    // 생명주기 메서드, 리액트 클래스 컴포넌트의 유일한 필수 값
    // UI를 렌더링하기 위해 쓰이며 마운트와 업데이트 과정에서 일어남
    // render함수는 항상 순수해야 하며 부수 효과가 없어야 한다
    // 입력값(props, state)가 들어가면 항상 같은 결과물을 반환해야 한다
    // 따라서 render() 내부에서 state를 직접 업데이트 하는 this.setState를 호출해서는 안 된다
    // state를 변경하는 일은 클래스 컴포넌트의 메서드나 다른 생명주기 메서드 내부에서 발생해야 한다
    // 그러므로 항상 최대한 간결하고 깔끔하게 작성하는 것이 좋다

    // componentDidMount()
    // 클래스 컴포넌트가 마운트되고 준비가 됐다면 그 다음 호출
    // 마운트되고 준비되는 즉시 실행
    // this.setState()로 state값 변경 가능 -> 호출 시 state가 변경되고 그 즉시 다시 한번 렌더링 시도 -> 브라우저가 실제 UI를 업데이트 하기 전에 실행되어 사용자는 변경을 눈치챌 수 없음
    // componentDidMount는 성능 문제를 일으킬 수 있다 
    // 일반적으로 state를 다루는 것은 생성자에서 하는것이 좋다
    // this.setState 사용은 생성자에서 할 수 없는 것, API 호출 후 업데이트, DOM에 의존적인 작업(이벤트 리스너 추가 등)등을 하기 위함

    // componentDidUpdate()
    // 컴포넌트 업데이트 이후 실행
    // 일반적으로 state, props의 변화에 따라 DOM을 업데이트하는 등에 쓰임
    // this.setState를 호출할 수 있으나 적절한 조건문으로 감싸지 않으면 계속 호출 -> 성능적인 문제 발생
    componentDidUpdate(prevProps: Props, prevState: State){
        // 만약 이러한 조건문이 없다면 props가 변경되는 매 순간마다 fetchData가 실행
        // 이 조건문 덕분에 props의 userName이 이전과 다른 경우에만 호출
        if(this.props.userName !== prevProps.userName){
            this.fetchData(this.props.userName);
        }
    }

    // componentWillUnmount()
    // 컴포넌트 언마운트 혹은 더 이상 사용되지 않기 직전에 호출
    // 메모리 누수나 불필요한 작동을 막기 위한 클린업 함수 호출
    // this.setState호출 불가
    // 아래처럼 이벤트를 지우거나 API호출을 취소, setInterval, setTimeout으로 생성된 타이머를 지우는 등의 작업을 하는 데 유용
    componentWillUnmount(){
        window.removeEventListener('resize', this.resizeListener)
        clearInterval(this.intervalId)
    }

    //shouldComponentUpdate()
    // state, props의 변경으로 리액트 컴포넌트가 다시 리렌더링되는 것을 막고 싶다면 해당 생명주기 메서드를 사용
    // 컴포넌트에 영향을 받지 않는 변화에 대해 정의할 수 있다
    // state의 변화에 따라 리렌더링되는 것은 굉장히 자연스러운 일이므로 이 메서드를 사용하는 것은 특정한 성능 최적화 상황에서만 고려해야 한다
    shouldComponentUpdate(nextProps: Props, nextState: State){
        // true인 경우 컴포넌트 업데이트 
        return this.props.title !== nextProps.title || this.state.input !== newState.input
    }
}

{
    // 컴포넌트의 두 가지 유형 (Component, PureComponent)의 차이
    // 생명주기를 다루는 차이점이 존재

    // 예제
    import React from 'react'

    interface State{
        count: number
    }

    type Props = Record<string, never>

    export class ReactComponent extends React.Component<Props, State> {
        private renderCounter = 0

        private constructor(props: Props){
            super(props)

            this.state = {
                count: 1,
            }
        }

        private handleClick = () => {
            this.setState({count: 1})
        }

        public render(){
            console.log('ReactComponent', ++this.renderCounter)

            return (
                <h1>
                    ReactComponent: {this.state.count}{''}
                    <button onClick={this.handleClick}>+</button>
                </h1>
            )
        }
    }

    export class ReactPureComponent extends React.PureComponent<Props, State> {
        private renderCounter = 0

        private constructor(props: Props){
            super(props)

            this.state = {
                count: 1,
            }
        }

        private handleClick = () => {
            this.setState({count: 1})
        }

        public render(){
            console.log('ReactPureComponent', ++this.renderCounter)

            return (
                <h1>
                    ReactPureComponent: {this.state.count}{' '}
                    <button onClick={this.handleClick}>+</button>
                </h1>
            )
        }
    }

    export default function CompareComponent(){
        return (
            <>
                <h2>React.Component</h2>
                <ReactCompoent />
                <h2>React.PureComponent</h2>
                <ReactPureComponent />
            </>
        )
    }

    // 버튼을 누르면 count를 1로 다시 세팅
    // Component의 경우 버튼을 누르느 대로 state가 업데이트 되어 렌더링 (비교 수행 x)
    // PureComponent는 state의 값이 업데이트되지 않아 렌더링 x (얕은 비교를 수행해 결과가 다를 때만 렌더링 수행)
    // PureComponent는 객체와 같이 복잡한 구조의 데이터 변경은 감지를 못한ㄴ다
    // PureComponen로만 구성돼 있다면 오히려 성능에 역효과를 미칠 수도 있다
    // 얕은 비교를 수행 시 일치하지 않는 일이 더 잦다면 이러한 비교는 무의미 하기 떄문이다
}

{
    // static getDerivedStateFromProps()
    // 가장 최근에 도입된 생명주기 메서드 중 하나
    // 사라진 componentWillReceiveProps를 대체
    // render()를 호출하기 직전에 호출
    // static으로 선언하여 this에 접근할 수 없다
    // 반환 객체는 해당 객체의 내용이 모두 state로 들어간다 
    // null 반환 시 아무 일도 일어나지 않는다
    // 모든 render() 실행 시에 호출
    static getDerivedStateFromProps(nextProps: Props, prevState: State){
        // 다음에 올 props를 바탕으로 현재의 state를 변경하고 싶을 때 사용할 수 있다
        if(props.name !== state.name){
            //state 변경
            return {
                name: props.name
            }
        }

        // state에 영향을 미치지 않는다
        return null
    }
}

{
    // getSnapShotBeforeUpdate()
    // 최근에 도입된 생명주기 메서드 중 하나
    // componentWillUpdate()를 대체할 수 있는 메서드
    // DOM이 업데이트되기 직전에 호출
    // 반환값은 componentDidUpdate로 전달
    // DOM에 렌더링되기 전에 윈도우 크기를 조절하거나 스크롤 위치를 조정하는 등의 작업 처리에 유용
    getSnapshotBeforeUpdate(prevProps: Props, prevState: State){
        // props로 넘겨받은 배열의 길이가 이전보다 길면 현재 스크롤 높이 값을 반환
        if(prevProps.list.length < this.props.list.length){
            const list = this.listRef.current;

            return list.scrollHeight - list.scrollTop;
        }

        return null;
    }

    // 3번째 인수인 snapshot은 클래스 제네릭의 3번째 인수로 넣어줄 수 있다
    componentDidUpdate(prevProps: Props, prevState: State, snapshot: Snapshot){
        // getSnapshotBeforeUpdate로 넘겨받은 값은 snapshot에서 접근 가능
        // snapshot 값이 있다면 스크롤 위치를 재조정해 기존 아이템이 스크롤에서 밀리지 않도록 도와준다
        if(snapshot !== null){
            const list = this.listRef.current;
            list.scrollTop = list.scrollHeight - snapshot;
        }
    }
}

{
    // getDerivedStateFromError()
    // 에러 상황에서 실행되는 메서드 
    // 아직 리액트 훅으로 구현돼 있지 않기 떄문에 해당 메서드가 필요하다면 클래스 컴포넌트를 사용해야함
    // 자식 컴포넌트에서 에러가 발생했을 때 호출되는 에러 메서드

    // ErrorBoundary.tsx
    import React, {PropsWithChildren} from 'react'

    type Props = PropsWithChildren<{}>
    type State = {hasError: boolean; errorMessage: string}

    export default class ErrorBoundary extends React.Component<Props, State> {
        constructor(props: Props){
            super(props)

            this.state = {
                hasError: false,
                errorMessage: '',
            }
        }

        // static 메서드 
        // error을 인수로 받음 (하위 컴포넌트에서 발생한 에러)
        // 반드시 state값을 반환해야함
        // 하위 컴포넌트에서 에러가 발생했을 경우에 어떻게 자식 리액트 컴포넌트를 렌더링할지 결정하는 용도이기 떄문
        // 렌더링 과정에서 호출되기 때문에 에러에 따른 상태 state를 반환하는것 이외에 부수효과를 발생시키면 안됨
        // console.error 포함
        static getDerivedStateFromError(error: Error) {
            return {
                hasError: true,
                errorMessage: error.toString()
            }
        }

        render(){
            // 에러가 발생했을 경우에 렌더링할 JSX
            if(this.state.hasError){
                return (
                    <div>
                        <h1>에러가 발생했습니다.</h1>
                        <p>{this.state.errorMessage}</p>
                    </div>
                )
            }

            // 일반적인 상황의 JSX
            return this.props.children
        }
    }

    // ...

    //App.tsx
    function App(){
        return (
            <ErrorBoundary>
                <Child />
            </ErrorBoundary>
        )
    }

    function Child(){
        const [error, setError] = useState(false)

        const handleClick = () => {
            setError((prev) => !prev)
        }

        if(error){
            throw new Error('Error has been occurred.')
        }

        return <button onClick={handleClick}>에러 발생</button>
    }
}

{
    // componentDidCatch
    // 자식 컴포넌트에서 에러 발생 시 실행
    // getDerivedStateFromError에서 에러를 잡고 state를 결정한 이후에 실행
    // 첫 번째 인수로 error을 받고 두 번째 인수로 에러가 발생한 컴포넌트의 정보를 가지고 있는 info를 받는다
    import React, {PropsWithChildren} from 'react'

    type Props = PropsWithChildren<{}>
    type State = {hasError: boolean; errorMessage: string}

    export default class ErrorBoundary extends React.Component<Props, State> {
        constructor(props: Props){
            super(props)

            this.state = {
                hasError: false,
                errorMessage: '',
            }
        }

        static getDerivedStateFromError(error: Error) {
            return {
                hasError: true,
                errorMessage: error.toString()
            }
        }

        // componentDidCatch를 추가
        // getDerivedStateFromError에서 하지 못했던 부수 효과를 수행 가능
        // render 단계가 아니라 커밋 단계에서 실행되기 떄문
        // 로깅 등의 용도로 사용 가능
        componentDidCatch(error: Error, info: ErrorInfo){
            console.log(error);
            console.log(info);
        }

        render(){
            // 에러가 발생했을 경우에 렌더링할 JSX
            if(this.state.hasError){
                return (
                    <div>
                        <h1>에러가 발생했습니다.</h1>
                        <p>{this.state.errorMessage}</p>
                    </div>
                )
            }

            // 일반적인 상황의 JSX
            return this.props.children
        }
    }

    // ...

    //App.tsx
    function App(){
        return (
            <ErrorBoundary>
                <Child />
            </ErrorBoundary>
        )
    }

    function Child(){
        const [error, setError] = useState(false)

        const handleClick = () => {
            setError((prev) => !prev)
        }

        if(error){
            throw new Error('Error has been occurred.')
        }

        return <button onClick={handleClick}>에러 발생</button>
    }
}

{
    // 앞의 두 메서드는 ErrorBoundary 즉 에러 경계 컴포넌트를 만들기 위한 목적으로 많이 사용
    // 리액트 전역에서 처리되지 않은 에러를 처리하기 위한 용도
    // ErrorBoundary의 경계 외부에 있는 에러는 잡을 수 없다
    function App(){
        return (
            <ErrorBoundary name="parent">
                // Child에서 발생한 에러는 에기에서 잡힌다
                <ErrorBoundary name="child">
                    <Child />
                </ErrorBoundary>
            </ErrorBoundary>
        )
    }

    // componentDidCatch는 개발 모드에서는 window까지 전파 
    // 프로덕션 모드는 componentDidCatch에 잡히지 않은 에러만 window까지 전파
    useEffect(() => {
        // 개발 모드에서는 모든 에러에 대해 실행
        // 프로덕션에서는 잡히지 않은 에러에 대해서만 실행
        function handleError(){
            console.log('window on error')
        }

        window.addEventListener('error', handleError)

        return () => {
            window.removeEventListener('error', handleError)
        }
    }, [])

    // componentDidCatch의 두 번째 인수에서 이름은 Function.name 또는 컴포넌트의 displayName을 따른다
    // 만약 const Component = memo(() => {...}) 와 같이 컴포넌트명을 추론할 수 없는 경우에는 단서가 부족하게 나온다
    // 추적을 용이하게 하려면 기명 함수 또는 dsiplayName을 쓰는 습관을 들이는 것이 좋다
}

{
    // 클래스 컴포넌트의 한계
    // 데이터 흐름을 추적하기 어렵다: 생명주기의 서로 다른 여러 메서드에서 state의 업데이트가 일어날 수 있으며 코드 작성시
    // 순서가 강제돼 있는 것이 아니기 때문에 사람이 읽기가 매우 어렵다

    // 애플리케이션 내부 로직의 재사용이 어렵다: 컴포넌트간 중복 로직이 있을 경우 고차 컴포넌트로 감싸거나 props로 넘겨주어 재사용할 수 있다
    // 하지만 공통 로직이 많아질수록 고차 컴포넌트 내지는 props가 많아지는 래퍼 지옥에 빠져들 위험성이 커진다
    // extends PureComponent와 같이 상속해서 관리할 수도 있지만 이 역시 상속 클래스의 흐름을 쫓아야 하기 때문에 복잡도가 증가한다

    // 기능이 많아질수록 컴포넌트의 크기가 커진다

    // 클래스는 함수에 비해 상대적으로 어렵다: 대부분의 언어와 다르게 작동하는 this를 비롯한 자바스크립트의 작동 방식은 클래스 컴포넌트를 처음 접하는 사람
    // 자바스크립트를 조금 해본 사람도 모두 혼란에 빠지게 할 수 있다

    // 코드 크기를 최적화하기 어렵다
    import React from 'react'

    interface State {
        count: number
    }

    type Props = Record<string, never>

    export class ReactPureComponent extends React.PureComponent<Props, State> {
        private constructor(props: Props) {
            super(props)

            this.state = {
                count: 1,
            }
        }

        private handleClick = () => {
            console.log('handleClick!') 

            this.setState({count: 1})
        }

        // 미사용
        private handleChange = () => {
            console.log('handleChanged!')
        }

        public render(){
            return (
                <h1>
                    ReactPureComponent: {this.state.count}{' '}
                    <button onClick={this.handleClick}>+</button>
                </h1>
            )
        }
    }

    // 빌드 결과
    // handleChange와 handleClick의 이름이 최소화 되지 않았고 사용하지 않는 메서드인 handleChange도 트리 쉐이킹이 되지 않고 포함
    // 최적화 하기 불리한 조건
    function u(e){
        var n

        return (
            (function (e, n) {
                if(!(e instanceof n))
                    throw new TypeError('Cannot call a class as a function')
            })(this, u),
            ((n = o.call(this, e)).handleClick = function() {
                console.log('handleClick!'),
                    n.setState({
                        count: 1,
                    })
            }),
            (n.handleChange = function () {
                console.log('handleChanged!')
            }),
            (n.state = {
                count: 1,
            }),
            n
        )
    }
    // ...

    // 핫 리로딩에 불리: 핫 리로딩 = 코드에 변경 사항이 발생했을 때 앱을 다시 시작하지 않고서도 해당 변경된 코드만 업데이트해 
    // 변경 사항을 빠르게 적용하는 기법
    
    import {PureComponent, useState} from 'react'

    function FunctionalComponent() {
        const [count, setCount] = useState(0)

        function handleClick(){
            setCount((prev) => prev + 1)
        }

        return (
            <>
                <button onClick={handleClick}>{count} + </button>
            </>
        )
    }

    class ClassComponent extends PureComponent<{}, {count: number}> {
        constructor(props: {}) {
            super(props)

            this.state = {
                count: 0,
            }
        }

        handleClick = () => {
            this.setState((prev) => ({count: prev.count + 1}))
        }

        render() {
            return <button onClick={this.handleClick}>{this.state.count} + </button>
        }
    }

    export default function App(){
        return (
            <>
                <FunctionalComponent />
                <ClassComponent />
            </>
        )
    }

    // 함수 컴포넌트는 핫 리로딩이 일어난 뒤에도 변경된 상태값이 유지
    // 클래스 컴포넌트는 핫 리로딩이 일어나면 기본값을 ㅗ돌아감
    // 클래스 컴포넌트는 최초 렌더링 시에 instance를 생성하고 그 내부에서 state값을 관리
    // render를 반영하려면 해당 인스턴스를 새로 생성하는 방법밖에 없는게 그러면 값은 초기화된다
    // 함수 컴포넌트는 state를 함수가 아닌 클로저에 저장해 두므로 다시 실행해도 state를 잃지 않는다
}

{
    // 함수 컴포넌트 
    // 클래스 컴포넌트와 비교했을 때 확실히 여러모로 간결해졌다
    // this 바인딩을 조심할 필요도 없고 state는 객체가 아닌 각각의 원시값으로 관리되어 훨씬 사용하기가 편해졌다
    // 렌더링하는 코드인 return 에서도 굳이 this를 사용하지 않더라도 props와 state에 접근할 수 있게 도ㅒㅆ다
    // 예제
    import {useState} from 'react'

    type SampleProps = {
        required?: boolean
        text: string
    }

    export function SampleComponent({required, text}: SampleProps) {
        const [count, setCount] = useState<number>(0)
        const [isLimited, setIsLimited] = useState<boolean>(false)

        function handleClick(){
            const newValue = count + 1
            setCount(newValue)
            setIsLimited(newValue >= 10)
        }

        return (
            <h2>
                Sample Component
                <div>{required ? '필수' : '필수 아님'}</div>
                <div>문자: {text}</div>
                <div>count: {count}</div>
                <button onClick={handleClick} disabled={isLimited}>
                    증가
                </button>
            </h2>
        )
    }
}

{
    // 함수 컴포넌트와 클래스 컴포넌트의 차이
    // 클래스 컴포넌트의 생명주기 메서드가 함수 컴포넌트에서는 존재하지 않는다
    // 함수 컴포넌트는 props를 받아 단순히 리액트 요소만 반환하는 함수인 반면 클래스 컴포넌트는 render 메서드가 있는 React.Component를 상속받아 
    // 구현하는 자바스크립트 클래스이기 떄문 
    // 생명주기 메서드는 React.Component에서 오는 것이기 때문에 클래스 컴포넌트가 아닌 이상 생명주기 메서드를 더는 사용할 수 없다
    // 함수 컴포넌트는 useEffect 훅을 사용해 생명주기 메서드인 componentDidMount, componentDidUpdate, componentWillUnmount를 비슷하게 구현 가능
    // 비슷할 뿐이지 똑같지는 않다 useEffect는 컴포넌트의 state를 활용해 동기적으로 부수 효과를 만드는 메커니즘이다

    // 함수 컴포넌트는 렌더링된 값을 고정하고 클래스 컴포넌트는 그렇지 못하다
    import React from 'react'

    interface Props {
        user: string
    }

    // 함수 컴포넌트로 구현한 setTimeout 예제
    export function FunctionalComponent(props: Props){
        const howMessage = () => {
            alert('Hello ' + props.user)
        }

        const handleClick = () => {
            setTimeout(showMessage, 3000)
        }

        return <button onClick={handleClick}>Follow</button>
    }

    // 클래스 컴포넌트로 구현한 setTimeout 예제
    export class ClassComponent extends React.Component<Props, {}> {
        private showMessage = () => {
            alert('Hello ' + this.props.user)
        }

        private handleClick = () => {
            setTimeout(this.showMessage, 3000)
        }

        public render() {
            return <button onClick={this.handleClick}>Follow</button>
        }
    }

    // setTimeout의 3초 사이에 props를 변경하면 
    // ClassComponent의 경우 3초 뒤에 변경된 props를 기준으로 출력
    // FunctionalComponent는 클릭했던 시점의 props 값을 기준으로 출력

    // 클래스 컴포넌트는 props의 값을 항상 this로부터 가져온다
    // 클래스 컴포넌트의 props는 외부에서 변경되지 않는 이상 불변 값이지만 this가 가리키는 객체는 변경 가능한 값이다
    // 따라서 render 메서드를 비롯한 리액트의 생명주기 메서드가 변경된 값을 읽을 수 있다
    
    
}

