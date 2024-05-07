{
    // 크롬 기준 브라우저에 리액트 개발 도구를 브라우저 확장 도구로 설치
    // https://bit.ly/45YgChB
    // 추가 후 리액트 로고가 회색으로 표시된다면 리액트 개발 도구가 정상적으로 접근할 수 없는 페이지거나 리액트로 개발되지 않은 페이지
    // 설치 후 왼쪽 탭 상단의 ...을 클릭 확장 프로그램 -> 확장 프로그램 관리로 들어감
    // 세부정보에서 시크릿모드 허용, 파일 URL에 대한 엑세스 허용을 허용
}

{
    // Components 탭에서 리액트 애플리케이션의 컴포넌트 트리 확인 가능
    // 구조뿐 아니라 props와 내부 hooks등 다양한 정보 확인 가능
}

{
    // Components 왼쪽 영역은 리액트 페이지의 컴포넌트 트리
    // 기명 함수로 선언 시 컴포넌트명이 나오고 익명 함수로 선언돼 있다면 Anonymous라는 이름으로 컴포넌트를 보여준다   

    // App.tsx
    // ...
    import AnonymousDefaultComponent from './Component3'

    function Component1 () {
        return <>Component1</>
    }

    const Component2 = () => {
        return <>Component2</>
    }

    const MemoizedComponent = memo(() => <>MemoizedComponent</>)

    const withSampleHOC = (Component: ComponentType) => {
        return function() {
            return <Component />
        }
    }

    const HOCCOmponent = withSampleHOC(() => <>HOCCOmponent</>)

    export default function App() {
        return (
            <div className="App">
                <Component1 />
                <Component2 />
                <AnonymousDefaultComponent />
                <MemoizedComponent />
                <HOCCOmponent />
            </div>
        )
    }

    // Component3.tsx
    export default () => {
        return <>Component3</>
    }

    // 함수 선언식과 함수 표현식으로 생성한 컴포넌트는 모두 정상적으로 함수명 표시
    // 이외의 컴포넌트는 다음과 같은 문제를 확인 가능

    // 익명 함수를 default로 export 한 AnonymousDefaultComponent의 경우 AnonymousDefaultComponent는 코드 내부에서 사용되는 이름일 뿐
    // 실제로 default export로 내보낸 함수의 명칭은 추론 불가 따라서 _default로 표기

    // memo를 사용해 익명 함수로 만든 컴포넌트를 감싼 경우 함수명을 명확히 추론하지 못해 Anonymous로 표시 
    // 추가로 memo 라벨을 통해 memo로 감싸진 컴포넌트임을 알 수 있다

    // 고차 컴포넌트인 withSampleHOC로 감싼 HOCComponent의 경우 두 가지 모두 Anonymous로 선언 
    // 이 또한 고차 컴포넌트의 명칭을 제대로 추론하지 못했기 떄문
}

{
    // 16.9 버전 이후부터는 이러한 문제가 일부 해결
    // 일부 명칭을 추론할 수 없는 Anonymous가 _c3, _c5등으로 개선
    // 그럼에도 컴포넌트를 특정하기 어렵다
    // 이런 문제를 해결하기 위한 기명함수로 변경 코드

    // ...
    const MemoizedComponent = memo(function MemoizedComponent() {
        return <>MemoizedComponent</>
    })

    const withSampleHOC = (Component: ComponentType) => {
        return function withSampleHOC(){
            return <Component />
        }
    }

    const HOCComponent = withSampleHOC(function HOCComponent(){
        return <>HOCComponent</>
    })

    // 함수를 기명함수로 선언하면 개발 도구에서 확인하는데 많은 도움을 주고 훅 등 다양한 곳에서 동일하게 적용되므로 디버깅에 많은 도움이 된다
}

{
    // 기명함수로 바꾸기 어렵다면 함수에 displayName 속성을 추가하는 방법도 있다
    const MemoizedComponent = memo(function() {
        return <>MemoizedComponent</>
    })

    MemoizedComponent.displayName = '메모 컴포넌트입니다.'
}

{
    // 익명 함수로 선언하기 곤란한 경우 혹은 함수명과는 별도의 명칭을 부여해 명시적으로 확인이 필요한 경우에 displayName을 사용하면 좋다
    // 고차 컴포넌트의 경우 이러한 기법을 유용하게 사용할 수 있다
    // 고차 컴포넌트는 일반적으로 고차, 일반 컴포넌트의 조합으로 구성되므로 displayName을 잘 설정하면 디버깅에 도움이 된다
    function withHigherOrderComponent(WrappedComponent) {
        class WithHigherOrderComponent extends React.Component {
            //...
        }

        WithHigherOrderComponent.displayName = `WithHigherOrderComponent(${getDisplayName(
            WrappedComponent,
        )})`

        return WithHigherOrderComponent
    }

    function getDisplayName(WrappedComponent){
        return WrappedComponent.displayName || WrappedComponent.name || 'Component'
    }

    // 리액트 빌드 트리를 확인하는 경우 terser등의 합축 도구 등이 컴포넌트명을 단순하게 난수화하기 떄문에 확인하기가 어려워진다
    // Component.displayName의 경우에도 빌드 도구가 사용하지 않는 코드로 인식해 삭제할 가능성도 있다
    // 그러므로 displayName과 함수명은 개발 모드에서만 제한적으로 참고하는 것이 좋다
}

{
    // Components 오른쪽 영역은 해당 컴포넌트의 자세한 정보를 보여주는 영역
}

{
    // 컴포넌트 명 key="키값"
    // Anonymous key="kidsValueProp"
    // 을 클릭하면 오른쪽 화면에 
    // kidsValueProp Anonymous가 출력
    // 경고 표시는 해당 애플리케이션이 strict mode로 렌더링되지 않았다는것을 의미
}

{
    // 컴포넌트 오른쪽 상단의 3개 아이콘

    // 눈
    // 해당 컴포넌트가 HTML의 어디에서 렌더링됐는지 확인 가능
    // 누르는 즉시 크롬 개발 도구의 메뉴 중 하나인 요소 탭으로 즉시 이동 해당 컴포넌트가 렌더링한 HTML 요소가 선택되는것을 볼 수 있다

    // 벌레
    // 클릭하는 순간 콘솔 탭에 해당 컴포넌트의 정보가 console.log를 실행해 기록
    // 개발 도구 화면에서 보기에는 복잡한 정보를 확인하거나 해당 정보를 복사하는 등의 용도로 확인하고 싶다면 클릭 후 콘솔 탭 확인
    // 해당 컴포넌트가 받는 props, 컴포넌트 내부에서 사용하는 hooks, 컴포넌트의 HTML 요소인 nodes가 기록

    // 소스코드
    // 해당 컴포넌트의 소스코드를 보여준다
}

{
    // 오른쪽 props
    // 해당 컴포넌트가 받은 props 확인 가능 
    // 단순 원시값뿐만 아니라 함수도 포함
    // 오른쪽 클릭 -> Copy value to clipboard = 클립보드 복사
    // 오른쪽 클릭 -> Store as global variable = window.$r에 복사
    
    // Store as global variable을 선택하고 콘솔로 이동하면 해당 변수에 대한 정보가 담겨 있는 것을 볼 수 있다

    // 값이 함수인 props를 누르면 Go to definition이 나타나는데 이를 클릭하면 해당 함수가 선언된 코드로 이동
    // 값을 더블클릭시 수정 가능
}

{
    // 오른쪽 hooks 
    // use는 생략해서 나온다 (useState -> State)

    // 개발자 모드에서 볼 수 있는 훅 목록
    // State: useState
    // Reducer: useReducer
    // Context: useContext
    // Memo: useMemo
    // Callback: useCallback
    // Ref: useRef
    // id: useId
    // LayoutEffect: useLayoutEffect
    // Effect: useEffect
    // 리액트 제공 훅이 아닌 경우 사용자 정의 훅도 use를 생략하고 보여줌 (useCounter -> Counter)
}

{
    // 훅도 익명 함수 대신 기명 함수로 넘겨주면 해당 훅을 실행할 때 실행되는 함수의 이름을 확인 가능
    // 익명함수는 f () {} 정도로만 확인할 수 있다
    
    //before
    useEffect(() => {
        console.log('useEffect')
    })

    // after
    // Effect: f effectOnlyMount() {}
    useEffect(function effectOnlyMount(){
        console.log('useEffect')
    })

    // useEffect에는 익명 함수를 인수로 넘겨주기 때문에 여러 개 선언돼 있다면 어떤 훅인지 구별하기 어렵다
    // hooks도 props와 마찬가지로 값을 더블클릭해 원하는 값으로 수정 가능
}

{
    // 오른쪽 rendered by
    // 컴포넌트를 렌더링한 주체가 누구인지 확인 가능
    // 프로덕션 모드에서는 react-dom의 버전만 확인 가능 
    // 개발 모드에서는 렌더링한 부모 컴포넌트까지 확인 가능
    // 컴포넌트 트리 뿐만 아니라 해당 컴포넌트에 대한 자세한 정보를 확인할 수 있다
}

{
    // 프로파일러
    // 컴포넌트 메뉴 = 정적인 현재 리액트 컴포넌트 트리의 내용을 디버깅
    // 프로파일러 메뉴 = 리액트가 렌더링하는 과정에서 발생하는 상황을 확인하기 위한 도구

    // 리액트 애플리케이션 렌더링 과정에서 어떤 컴포넌트가 렌더링됐는지, 몇 차례나 렌더링이 일어났는지, 어떤 작업에서 오래 걸렸는지 등
    // 이 과정은 렌더링 과정에 개입해 디버깅 내용을 기록해야 하기 때문에 프로덕션 빌드로 실행되는 리액트 애플리케이션에서는 사용할 수 없다
}

{
    // 프로파일러 사용 예제 코드
    import {ChangeEvent, useEffect, useState} from 'react'

    export default function App(){
        const [text, setText] = useState('')
        const [number, setNumber] = useState(0)
        const [list, setList] = useState([
            { name: 'apple', amount: 5000 },
            { name: 'orange', amount: 1000 },
            { name: 'watermelon', amount: 1500 },
            { name: 'pineapple', amount: 500 },
        ])

        useEffect(() => {
            setTimeout(() => {
                console.log('surprise!')
                setText('1000')
            }, 3000)
        })

        function handleTextChange(e: ChangeEvent<HTMLInputElement>) {
            setText(e.target.value)
        }

        function handleSubmit() {
            setList((prev) => [...prev, { name: text, amount: number }])
        }

        function handleNumberChange(e: ChangeEvent<HTMLInputElement>) {
            setNumber(e.target.valueAsNumber)
        }

        return (
            <div>
                <input type="text" value={text} onChange={handleTextChange} />
                <button onClick={handleSubmit}>추가</button>

                <input type="number" value={number} onChange={handleNumberChange} />

                <ul>
                    {list.map((value, key) => (
                        <li key={key}>
                            {value.name} {value.amount}원
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

{
    // 프로파일러 설정
    // 프로파일러 메뉴로 진입 후 톱니 모양 설정 버튼으로 진행

    // General탭의 Highlight updates when components render: 컴포넌트가 렌더링될 때마다 해당 컴포넌트에 하이라이트 표시 
    // 매우 유용한 기능이므로 꼭 켜두는 것이 좋다

    // Debugging 탭의 Hide logs during second render in Strict Mode: 리액트 애플리케이션이 엄격 모드에서 실행되는 경우 
    // 원활한 디버깅을 위해 useEffect 등이 두 번씩 작동하는 의도적인 작동이 숨겨져 있다
    // 이로 인해 useEffect 안에 넣은 console.log가 두 번씩 찍히기도 하는데 이를 막고 싶다면 해당 버튼을 활성화
    // 프로덕션 모드에서는 해당 옵션과 관계없이 정상적으로 한 번씩 출력

    // Profiler 탭의 Record why each component rendered while profiling: 프로파일링 도중 무엇 때문에 컴포넌트가 렌더링됐는지 기록
    // 애플리케이션 속도가 조금 느려질 수는 있지만 디버깅에 도움이 되는 옵션이므로 켜두는 것이 좋다
}

{
    // 프로파일링 메뉴
    // 톱니바귀가 있던 바에서 왼쪽 맨 앞에 o 아이콘부터
    
    // 첫 번째 버튼은 Start Profiling(프로파일링 시작) 버튼으로 이 버튼을 누르면 프로파일링이 시작된다
    // 클릭시 적색 동그라미로 변하며 다시 누르면 프로파일링이 중단되고 결과가 나타난다

    // 두 번째 버튼은 Reload and Start profiling(새로고침 후 프로파일링 시작)은 첫 번째 버튼과 유사하지만 웹페이지가
    // 새로고침되면서 이와 동시에 프로파일링이 시작된다

    // 세 번째 버튼은 Stop Profiling(프로파일링 종료)버튼으로 프로파일링된 현재 내용을 모두 지우는 버튼이다

    // 네 번째, 다섯 번째 버튼은 각각 Load Profile(프로파일 불러오기), Save Profile(프로파일 저장하기)버튼으로 프로파일링
    // 결과를 저장하고 불러오는 버튼이다
    // 결과를 저장 시 사용자의 브라우저에 해당 프로파일링 정보가 담긴 JSON 파일이 다운로드되며 다시 불러올 수도 있다
    // 단순히 저장하고 불러오는 용도로 사용된다
}

{
    // 불꽃모양 아이콘은 Flamegraph 탭이다
    // 렌더 커밋별로 어떠한 작업이 일어났는지 나타낸다
    // 너비가 넓을수록 컴포넌트 렌더링에 오래 걸렸다는 의미이다
    // 마우스 커서를 가져다 대면 해당 컴포넌트의 렌더링과 관련된 정보를 확인할 수 있다
    // 오른쪽에는 해당 커밋과 관련된 추가적인 정보를 확인할 수 있다
    // 렌더링되지 않은 컴포넌트에 대한 정보도 확인 가능
    // 렌더링되지 않은 컴포넌트는 회색으로 표시되며 Did not render라는 메세지가 표시된다
    // 이를 활용하여 개발자가 의도한 대로 메모이제이션이 작동하는지, 특정 상태 변화에 따라서 렌더링이 의도한 대로 제한적으로 발생하고
    // 있는지 확인하는 데 많은 도움을 얻을 수 있다
    // Flamegraph의 오른쪽에 있는 화살표를 누르거나 세로 막대 그래프를 클릭하면 각 렌더 커밋별로 리액트 트리에서 
    // 발생한 렌더링 정보를 확인할 수 있다 
    // 여기서는 렌더링이 발생한 횟수도 확인할 수 있어 의도란 횟수만큼 렌더링이 발생했는지도 알 수 있다
}

{
    // Ranked
    // 해당 커밋에서 렌더링하는데 오래 걸린 컴포넌트를 순서대로 나열한 그래프
    // Flamegraph와의 차이점은 모든 컴포넌트를 보여주는 것이 아니라 단순히 렌더링이 발생한 컴포넌트만 보여준다
}

{
    
}