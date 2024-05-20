리액트 17 버전부터는 점진적인 업그레이드가 가능해진다
리액트 17에서 리액트 18 버전으로 이동 시 리액트 18에서 제공하는 대부분의 기능을 사용할 수도 있지만 일부 기능에 대해서는 리액트 17에 머물러 있는 것이 가능해진다
즉 전체 애플리케이션 트리는 리액트 17이지만 일부 트리와 컴포넌트에 대해서만 리액트 18을 선택하는 점진적인 버전 업이 가능해진다

이러한 점진적인 업그레이드를 지원하기 위한 리액트의 일부 컴포넌트 변경이 리액트 17 업데이트의 주요 변경 사항 중 하나다
향후 업데이트가 부담된다 하더라도 17버전부터 제공되는 점진적인 업그레이드를 사용하기 위해서라도 17버전 업데이트를 고려해 봄 직하다

한 애플리케이션 내에 여러 버전의 리액트가 존재하는 시나리오 코드
구 리액트 애플리케이션 루트를 만든다
export default function createLegacyRoot(container){
    return {
        // 렌더링
        render(Component, props, context) {
            ReactDOM.render(
                <ThemeContext.Provider value={context.theme}>
                    <Component {...props} />
                </ThemeContext.Provider>
                container
            );
        },

        // 이 컴포넌트의 부모 컴포넌트가 제거될 때 호출될 unmount
        unmount() {
            ReactDOM.unmountComponentAtNode(container);
        },
    };
}

// 모듈을 promise로 불러오는 변수
const rendererModule = {
    status: 'pending',
    promise: null,
    result: null,
};

// 이전 버전인 리액트 16의 루트를 가져오는 코드
// 일반적인 React.lazy를 쓰지 못한 이유는 컴포넌트를 불러오는 작업은 외부
// 리액트 버전에서 렌더링하는 작업은 내부 리액트 버전에서 수행해야 하기 떄문 
export default function lazyLegacyRoot(getLegacyComponent){
    const componentModule = {
        status: 'pending',
        promise: null,
        result: null,
    };

    return function Wrapper(props) {
        // legacy/createLegacyRoot를 promise로 lazy하게 불러온다
        const createLegacyRoot = readModule(rendererModule, () => 
            import('../legacy/createLegacyRoot')
        ).default;

        const Component = readModule(componentModule, getLegacyComponent).default;
        //구 리액트를 렌더링할 위치
        const containerRef = useRef(null);
        //구 리액트의 루트 컴포넌트
        const rootRef = useRef(null);

        const theme = useContext(ThemeContext);
        const context = useMemo(
            () => ({
                theme,
            }),
            [theme]
        );

        useLayoutEffect(() => {
            //루트 컴포넌트가 없다면
            if(!rootRef.current){
                //루트 컴포넌트를 만든다
                rootRef.current = createLagacyRoot(containerRef.current);
            }
            const root = rootRef.current;

            //cleanUp 시에 언마운트
            return () => {
                root.unmount();
            };
        }, [createLegacyRoot]);

        useLayoutEffect(() => {
            if(rootRef.current){
                //루트 컴포넌트가 존재하면 적절한 props와 context로 렌더링
                rootRef.current.render(Component, props, context);
            }
        }, [Component, props, context]);

        //여기에 구 리액트 애플리케이션 코드가 들어간다
        return <div style={{display: 'contents'}} ref={containerRef}>
    };
}

//app.jsx
//리액트 17로 작성된 애플리케이션
export default function App(){
    return <Suspense fallback={<Spinner />}>
        <AboutPage />
    </Suspense>
}

//abount.jsx
//리액트 16 버전의 Greeting Component를 불러온다
const Greeting = lazyLegacyRoot(() => import('../legacy/Greeting'));

function AboutPage(){
    const theme = useContext(ThemeContext);

    return (
        //전체 코드는 리액트 17로 작성되지만
        <>
            <h2>src/modern/AboutPage.js</h2>
            <h3 style={{color: theme}}>
                This component is rendered by the outer React ({React.version})
            </h3>
            <Clock />
            //여기는 리액트 16 코드가 조재한다
            <Greeting />
            //리액트 16 코드 끝
            <br />
        </>
    );
}

리액트 16을 위한 별도의 루트 요소를 만들고 여기에 불러온 리액트 16 모듈 렌더링 
버전의 불일치로 인한 에러도 발생하지 않고 하나의 웹사이트에서 두 개의 리액트가 존재
이 두 개의 리액트 루트는 단 하나만 존재하는 컴포넌트와 훅을 서로 불러와서 사용할 수 있다
즉 리액트 16과 17 버전을 모두 지원하는 컴포넌트나 훅이라면 버전이 다른 두 리액트에서 무리없이 사용 가능하다 
Context도 마찬가지로 ThemeContext의 값을 리액트 16과 17이 모두 동일하게 사용하고 있으며 이 Context가 제공하는 값을 마찬가지로 동일하게 사용할 수 있다