{
    // 브라우저 렌더링 != 리액트 렌더링
    // 리액트 렌더링
    // 리액트 애플리케이션 트리 안에 있는 모든 컴포넌트들이 현재 자신들이 가지고 있는 props와 state의 값을 
    // 기반으로 어떻게 UI를 구성하고 이를 바탕으로 어떤 DOM 결과를 브라우저에게 제공할 것인지 계산하는 일련의 과정
}

{
    // 리액트 렌더링 발생 시점
    // 1. 최초 렌더링
    // 2. 리렌더링
    // 2-1: 클래스 컴포넌트의 setState가 실행
    // 2-2: 클래스 컴포넌트의 forceUpdate가 실행
    // render가 state나 props가 아닌 다른 값에 의존하고 있어 리렌더링을 자동으로 실행할 수 없는 경우 forceUpdate로 리렌더링 실행
    // forceUpdate는 shouldComponentUpdate는 무시한다 (하위 컴포넌트에도 적용)
    // render 내부에서 forceUpdate실행 시 무한루프
    // 2-3: 함수 컴포넌트의 useState의 두 번째 배열 요소인 setter가 실행
    // 2-4: 함수 컴포넌트의 useReducer의 두 번째 배열 요소인 dispatch가 실행
    // 2-5: 컴포넌트의 key props가 변경

    // key 예제
    const arr = [1, 2, 3]

    export default function App(){
        return (
            <ul>
                // 키가 없으면 경고 출력
                {arr.map((index) => (
                    <li key={index}>{index}</li>
                ))}
            </ul>
        )
    }

    // key값은 리렌더링이 발생하는 동안 형제 요소들 사이에서 동일한 요소를 식별하는 값
    // 리액트 파이버 트리 구조에서 형제 컴포넌트를 구별하기 위해 각자 sibling이라는 속성값이 존재
    // 리렌더링 발생 시 current 트리와 workInProgress트리 사이에 변경을 구별하기 위해 사용하는 값이 key
    // key가 없다면 단순히 파이버 내부의 sibling 인덱스만을 기준으로 판단


    // Child에는 key가 없어 경고문 발생
    // setState 호출로 부모 컴포넌트인 List의 리렌더링이 발생해도 memo로 인해 Child는 리렌더링 x
    // <Child key={index} />와 동일하게 작동
    // 반대로 <Child key={Math.random()} />과 같이 임의의 key 값을 넣는다면
    // 리렌더링이 발생 시 sibling 컴포넌트를 명확히 구분할 수 없으므로 memo로 선언되어도 매번 리렌더링 발생
    // 이러한 특성을 활용해 강제로 리렌더링을 일으키는 것이 가능
    // props의 변경은 자식 컴포넌트에서도 변경이 필요하므로 리렌더링 발생
    // 부모 컴포넌트가 리렌더링된가면 자식 컴포넌트도 무조건 리렌더링 발생
    const Child = memo(() => {
        return <li>hello</li>
    })

    function List({arr}: {arr: number[]}) {
        const [state, setState] = useState(0)

        function handleButtonClick(){
            setState((prev) => prev + 1)
        }

        return (
            <>
                <button onClick={handleButtonClick}>{state}+</button>

                <ul>
                    {arr.map((_, index) => (
                        <Child />
                    ))}
                </ul>
            </>
        )
    }
}

{
    // 단순 변수는 변경이 일어나도 리렌더링이 되지 않는다
    let index = 0

    export default function App(){
        function handleButtonClick() {
            index += 1
        }

        return (
            <>
                <button onClick={handleButtonClick}>+</button>
                // 버튼을 눌러도 0
                {index}
            </>
        )
    }
}

{
    // MobX와 Redux는 라이브러리 어디에선가 각자의 방법으로 상태를 관리해 주지만 이 상태 관리가 리액트의 리렌더링으로 이어지지는 않는다
    // 각각 mobx-react, react-redux가 앞선 라이브러리로부터 변경된 상태를 바탕으로 위에서 언급한 방법 중 하나를 사용해 리렌더링 발생
    // Recoil처럼 별도의 리액트 패키지가 없어도 상태 관리가 되는 라이브러리의 경우에는 내부에서 useState등을 통해 리렌더링 발생
}

{
    // 렌더링 프로세스
    // 컴포넌트 루트에서부터 아래로 내려가며 업데이트가 필요한 컴포넌트를 찾음
    // 클래스 컴포넌트는 render 함수를 실행 함수 컴포넌트는 FunctionComponent() 그 자체를 호출한 뒤에 결과물 저장
    // 렌더링 결과물은 JSX문법으로 구성돼 있고 자바스크립트로 컴파일 되면서 React.createElement()를 호출하는 구문으로 변경
    // 예제
    function Hello(){
        return (
            <TestComponent a={35} b="yceffort">
                안녕하세요
            </TestComponent>
        )
    }

    // 변환
    function Hello(){
        return React.createElement(
            TestComponent,
            {a: 35, b: 'yceffort'},
            '안녕하세요',
        )
    }

    // 결과물
    {type: TestComponent, props: {a: 35, b: "yceffort", children: "안녕하세요"}}

    // 해당 결과물로 모든 변경사항을 수집 (재조정)
}

{
    // 렌더 단계
    // 컴포넌트를 렌더링하고 변경 사항을 계산하는 모든 작업
    // 크게 type, props, key 비교

    // 커밋 단계
    // 렌더 단계의 변경 사항을 실제 DOM에 적용해 사용자에게 보여주는 과정
    // 모든 DOM노드 및 인스턴스를 가리키도록 리액트 내부의 참조 업데이트
    // 생명주기 메서드 호출

    // 렌더링 != 커밋
    // 아무 변경사항이 감지되지 않는다면 커밋 단계 생략
    // 렌더링은 꼭 가시적인 변경이 없어도 발생 가능

    // 동시성 렌더링 
    // 리액트 18 버전에서 나옴
    // 렌더 단계가 비동기로 작동 우선순위를 낮추거나 중단, 재시작, 포기가 가능
    // 브라우저의 동기 작업을 차단하지 않고 백그라운드에서 새로운 리액트 트리를 준비할 수도 있어 사용자는 더 나은 경험을 누릴 수 있다
}

{
    // 리액트 컴포넌트 트리의 렌더링 과정 예제
    import {useState} from 'react'

    export default function A(){
        return (
            <div className="App">
                <h1>Hello React!</h1>
                <B />
            </div>
        )
    }

    function B(){
        const [counter, setCounter] = useState(0)

        function handleButtonClick() {
            setCounter((previous) => previous + 1)
        }

        return (
            <>
                <label>
                    <C number={counter}>
                </label>
                <button onClick={handleButtonClick}>+</button>
            </>
        )
    }

    function C({number}){
        return (
            <div>
                {number} <D />
            </div>
        )
    }

    function D() {
        return <>리액트 재밌다!</>
    }

    // 사용자가 B 컴포넌트의 버튼을 누른다면
    // 1. B 컴포넌트의 setState가 호출
    // 2. B 컴포넌트의 리렌더링 작업이 렌더링 큐에 들어감
    // 3. 리액트는 트리 최상단에서부터 렌더링 경로 검사
    // 4. A 컴포넌트는 리렌더링이 필요한 컴포넌트로 표시돼 있지 않으므로 별다른 작업을 하지 않음
    // 5. 하위 컴포넌트인 B 컴포넌트는 업데이트가 필요하다고 체크돼 있으므로 B 리렌더링
    // 6. 5번 과정에서 B는 C를 반환
    // 7. C는 props인 number가 업데이트 그러므로 업데이트가 필요한 컴포넌트로 체크돼 있고 업데이트 진행
    // 8. 7번 과정에서 C는 D를 반환
    // 9. D도 업데이트가 필요한 컴포넌트로 체그되지 않았다 그러나 C가 렌더링됐으므로 자식인 D도 렌더링

    // 컴포넌트 렌더링 최적화가 되어있지 않으면 하위 모든 컴포넌트에 영향을 미친다
    // 부모가 변경됐다면 props변화와 상관없이 자식은 무조건 리렌더링 된다

    // memo로 래핑하여 렌더 단계에서 컴포넌트 비교를 거쳤지만 memo로 선언한 덕분에 props가 변경되지 않으면 렌더링이 생략되므로 커밋 단계도 생략
    const D = memo(() => {
        return <>리액트 재밌다!</>
    })
}