{
    // 브라우저가 웹사이트 요청을 받고 렌더링 하는 과정
    // 1. 브라우저가 사용자가 요청한 주소를 방문해 HTML 파일 다운
    // 2. 브라우저의 렌더링 엔진은 HTML을 파싱해 DOM 노드로 구성된 트리를 만든다
    // 3. 2번 과정에서 CSS 파일을 만나면 해당 CSS 파일 다운
    // 4. 브라우저 렌더링 엔진은 CSS도 파싱해 CSS노드로 구성된 트리(CSSOM)를 만든다
    // 5. 브라우저는 2번에서 만든 DOM 노드를 순회하는데 모든 노드를 방문하는게 아닌 사용자 눈에 보이는 노드만 방문
    // 즉 display: none과 같이 사용자 화면에 보이지 않는 요소는 방문해 작업하지 않음 
    // 이는 트리 분석 과정을 조금이라도 빠르게 하기 위함
    // 6. 5번에서 제외된 눈에 보이는 노드를 대상으로 해당 노드에 대한 CSSOM 정보를 찾고 여기서 발견한 CSS 스타일 정보를 이 노드에 적용
    // 이 DOM 노드에 CSS를 적용하는 과정은 크게 두 가지로 나눌 수 있다
    // 레이아웃: 각 노드가 브라우저 화면의 어느 좌표에 정확히 나타나야 하는지 계산하는 과정 이 과정을 거치면 반드시 페인팅 과정도 거침
    // 페인팅: 레이아웃 단계를 거친 노드에 색과 같은 실제 유효한 모습을 그리는 과정   
}

{
    // 렌더링 예제 코드
    #text{
        background-color: red;
        color: white;
    }

    <!DOCTYPE html>
    <html>
        <head>
            <link rel="stylesheet" type="text/css" href="./style.css" />
            <title>Hello React!</title>
        </head>
        <body>
            <div style="width: 100%;">
                <div id="text" style="width: 50%;">Hello world!</div>
            </div>
        </body>
    </html>

    // 1. html 다운 -> 분석
    // 2. 스타일시트가 포함된 link태그를 발견해 css 다운
    // 3. body 태그 하단의 div는 width:100%이므로 뷰포트(브라우저가 사용자에게 노출하는 영역)로 좌우 100%너비로 잡는다
    // 4. 3번 하단의 div는 width: 50%이므로 부모의 50%너비 (전체 영역의 50%)로 잡는다
    // 5. 2번에서 다운로드한 css에 id="text"에 대한 스타일 정보를 결합
    // 6. 위 정보를 토대로 렌더링 수행
}

{
    // 싱글 페이지 애플리케이션은 페이지가 변경(다른 페이지로 가서 처음부터 HTML을 새로 받아 렌더링 과정을 시작)과는 다르게
    // 계속해서 요소의 위치를 재계산하게 된다
    // 싱글 페이지 애플리케이션의 특징 덕분에 깜박임이 없는 자연스러운 웹페이지 탐색을 할 수 있지만 그만큼 DOM을 관리하는 과정에서 
    // 부담해야할 비용 증가

    // 개발자에 관점에서 하나의 인터랙션으로 인해 페이지 내부의 DOM의 여러가지가 변경되고 이 변경 사항을 추적하는 것은 개발자 입장에서는 너무 수고스러움
    // 대부분의 개발자는 인터랙션에 모든 DOM의 변경보다는 결과적으로 만들어지는 DOM결과물 하나만 알고 싶을 것이다
}

{
    // 가상 DOM 
    // 이러한 문제점을 해결하기 위해 탄생한것 
    // 실제 브라우저 DOM이 아닌 리액트가 관리하는 가상의 DOM
    // 웹페이지가 표시해야할 DOM을 일단 메모리에 저장하고 리액트가 실제 변경에 대한 준비가 완료됐을 때 실제 브라우저의 DOM에 반영
    // 여기서 말하는 리액트는 package.json에 있는 react가 아닌 react-dom을 의미)
    // 이렇게 DOM 계산을 브라우저가 아닌 메모리에서 계산하는 과정을 한 번 거치게 되면 실제로는 여러 번 발생했을 렌더링 과정을 최소화 할 수 있다
    // 브라우저와 개발자의 부담이 적어진다
    // 가상 DOM은 기존 DOM 보다 무조건 빠른건 아니다 다만 대부분의 상황에서 왠만한 애플리케이션을 만들 수 있을 정도로 충분히 빠르다
}

{
    // 가상 DOM과 렌더링 최적화를 가능하게 해주는 것이 리액트 파이버(React Fiber)디
    // 리액트 파이버
    // 리액트에서 관리하는 평범한 자바스크립트 객체
    // 파이버는 파이버 재조정자가 관리
    // 가상 DOM과 실제 DOM을 비교해 변경사항 수집
    // 둘 사이에 차이가 있으면 변경에 관련된 정보를 가지고 있는 파이버를 기준으로 화면에 렌더링을 요청 
    // 재조정 = 리액트에서 어떤 부분을 새롭게 렌더링 가상 DOM과 실제 DOM을 비교하는 작업*알고리즘)

    // 목표
    // 리액트 웹 애플리케이션에서 발생하는 애니메이션, 레이아웃, 사용자 인터렉션에 올바른 결과물을 만드는 반응성 문제를 해결
    // 작업을 작은 단위로 분할하고 쪼갠 다음, 우선순위를 매긴다
    // 이러한 작업을 일시 중지하고 나중에 다시 시작
    // 이전에 했던 작업을 다시 재사용하거나 필요하지 않은 경우에는 폐기
    // 이러한 작업이 비동기로 일어난다
    // 파이버는 하나의 작업 단위로 구성돼 있다 
    // 리액트는 이러한 작업 단위를 하나씩 처리하고 finishedWork()라는 작업으로 마무리한다
    // 이 작업을 커밋해 실제 브라우저 DOM에 가시적인 변경 사항을 만들어 낸다
    // 아래 두 단계로 작업
    // 1. 렌더 단계에서 리액트는 사용자에게 노출되지 않는 모든 비동기 작업을 수행 이 단계에서 앞서 언급한 파버의 작업
    // 우선순위를 지정하거나 중지시키거나 버리는 등의 작업 발생
    // 2. 커밋 단계에서 앞서 언급한 것처럼 DOM에 실제 변경 사항을 반영하기 위한 작업, commitWork()가 실행되는데, 이 과정은 앞서와 다르게 동기식으로
    // 일어나고 중단될 수도 없다
}

{
    // 파이버가 실제 리액트 코드에서 어떻게 구현되어 있는지
    function FiberNode(tag, pendingProps, key, mode){
        // Instance
        this.tag = tag
        this.key = key
        this.elementType = null
        this.type = null
        this.stateNode = null

        //fiber
        this.return = null
        this.child = null
        this.sibling = null
        this.index = 0
        this.ref = null
        this.refCleanup = null

        this.pendingProps = pendingProps
        this.memoizedProps = null
        this.updateQueue = null
        this.memoizedState = null
        this.dependencies = null
        
        this.mode = mode

        // Effects
        this.flags = NoFlags
        this.subtreeFlags = NoFlags
        this.deletions = null

        this.lanes = NoLanes
        this.childLanes = NoLanes

        this.alternate = null

        // 이하 프로파일러, __DEV__ 코드는 생략
    }   
}