{
    // 초반은 기초적인 내용이므로 생략

    // 네트워크 탭 고려사항
    // 1. 불필요한 요청 또는 중복요청이 없는지
    // 2. 웹페이지 구성에 필요한 리소스 크기가 너무 크지 않은지
    // 3. 리소스를 불러오는 속도는 적절한지 또는 너무 속도가 오래 걸리는 리소스는 없는지
    // 4. 리소스가 올바른 우선순위로 다운로드되어 페이지를 자연스럽게 만들어가는지
}

{
    // 메모리 탭
    // 애플리케이션 메모리 누수, 속도 저하, 웹페이지 프리징 현상을 확인할 수 있는 유용한 도구
    // 리액트 개발 도구의 프로파일과 비슷하게 프로파일링 작업을 거쳐야한다

    // 프로파일링 유형

    // 힙 스냅샷: 현재 메모리 상황을 사진 찍듯이 촬영 현재 시점의 메모리 상황을 알고 싶을때 활용

    // 타임라인의 할당 계측: 시간의 흐름에 따라 메모리의 변화를 살펴보고 싶다면 타임라인의 할당 계측 사용
    // 로딩이 되는 과정의 메모리 변화 또는 페이지에서 어떠한 상호작용을 했을 때 메모리 변화 과정을 알고 싶을 때 사용
    
    // 할당 샘플링: 메모리 공간을 차지하고 있는 자바스크립트 함수를 볼 수 있다
}

{
    // 자바스크립트 인스턴스 VM 선택
    // 현재 실행중인 자바스크립트 VM 인스턴스를 선택할 수 있다
    // 디버깅 하고 싶은 자바스크립트 VM 환경을 선택한다 
    // 환경별 힙 크기를 볼 수 있는데 실제 해당 페이지가 자바스크립트 힙을 얼마나 점유하고 있는지를 나타낸다
    // 이 크기는 자바스크립트 실행에 따라 실시간으로 바뀐다 
    // 이 크기만큼 사용자의 브라우저에 부담을 주기 때문에 불필요하게 크기가 늘어나지 않는지 눈여겨볼 필요가 있다
}

{
    // 힙 스냅샷
    // 현재 페이지의 메모리 상태를 확인해 볼 수 있는 메모리 프로파일 도구
    // 힙 스냅샷을 촬영하는 시점을 기준으로 메모리 현황 출력
    
    // 힙 스냅샷을 위한 극단적으로 잘못된 코드 예시
    // 천만개의 랜덤한 값을 push
    const DUMMY_LIST = []

    export default function App(){
        function handleClick(){
            Array.from({ length: 10_000_000 }).forEach((_, idx) =>
                DUMMY_LIST.push(Math.random() * idx),
            )
            alert('complete!')
        }

        return <button onClick={handleClick}>BUG</button>
    }

    // 페이지 진입 후 스냅샷 촬영 -> BUG 버튼을 누르고 힙 스냅샷 촬영시 
    // 메모리 차이가 약 100MB정도 난다
    // 클래스 필터 옆에 모든 객체 메뉴를 클릭하고 스냅샷 1에서 스냅샷 2 사이에 할당된 객체를 클릭해 얕은 크기 항목을 
    // 기준으로 내림차순 정렬

    // 두 스냅샷 간의 비교와 정렬 덕분에 어떠한 변수가 메모리를 크게 잡아먹고 있는지 확인 가능하고 
    // 두 스냅샷 간 사이에 일어났던 유저 인터랙션으로 인해 메모리 차이가 발생했다는 것을 명확히 확인 가능
    // 메모리 차지의 데이텨 형태 (배열) 해당 액션이 발생한 함수, 데이터의 값 확인 가능
    
    // 해당 객체를 대상으로 마우스 오른쪽 버튼을 클릭해 전역 변수로 저장을 누르면 해당 변수의 값이 전역변수 (window)에 기록
}

{
    // 얕은 크기 
    // 해당 객체가 보유한 메모리 크기
    // 유지된 크기
    // 해당 객체뿐만 객체가 참조하고 있는 모든 객체들의 크기 (+)

    // 메모리 누수를 찾을 때 얕은 크기는 작으나 유지된 크기가 큰 객체를 찾아야 한다
    // 두 크기의 차이가 큰 객체는 다수의 다른 객체를 참조하고 있다는 뜻이며 해당 객체는 복잡한 참조 관계를 가지고 있다는 뜻이다
    // 이런 객체가 오랜 시간 동안 메모리에 남아있다면 그로 인해 많은 메모리를 점유하고 있을 수 있다
}

{
    // 스냅샷 활용 시 의심 지점을 먼저 추측해 본 뒤에 두 개 이상의 스냅샷을 보는것이 훨씬 쉽다
    // 스냅샷을 활용하면 useMemo나 useCallback과 같은 의존성이 있는 값들이 정말로 렌더링 사이에 그대로 유지되는지 육안으로 확인 가능하다

    // 예제 코드
    function MemoComponent({ num }: { num: number }){
        const callbackHandleClick = useCallback(
            function callbackHandleClick(){
                console.log(num)
            },
            [num],
        )

        const handleClick = () => {
            console.log(num)
        }

        return (
            <>
                <button onClick={callbackHandleClick}>1번</button>
                <button onClick={handleClick}>2번</button>
            </>
        )
    }

    export default function App(){
        //리렌더링 발생 용도
        const [toggle, setToggle] = useState(false)

        function handleToggle() {
            setToggle((prev) => !prev)
        }

        return (
            <>
                <button onClick={handleToggle}>{toggle ? 'ON' : 'OFF'}</button>
                <MemoComponent num={5} />
            </>
        )
    }

    // 페이지 진입 스냅샷 -> 토글 버튼 클릭 후 스냅샷
    // useCallback으로 감싼 callbackHandleClick은 재생성되지 않았기 떄문에 스냅샷 사이에 할당된 객체에서 확인할 수 없다
    // 반면 useCallback으로 감싸지 않은 handleToggle은 이 스냅샷 사이에 재생성되었다
 
    // setToggle((prev) => !prev)는 익명 함수이기 때문에 ()로 표기된다
    // 작성시 간단하지만 디버깅시에는 별 도움이 되지 않는다
    
    // 기명함수로 작성
    function handleToggle(){
        setToggle(function 토글함수(prev){
            return !prev
        })
    }
}

{
    // 타임라인 할당 계측
}