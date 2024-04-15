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

