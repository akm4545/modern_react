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