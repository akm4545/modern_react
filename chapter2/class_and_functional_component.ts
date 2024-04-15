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

