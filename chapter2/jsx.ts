{
    // JSX
    // XML과 유사한 내장형 구문
    // 리액트에 종속적이지 않은 독자적인 문법
    // 자바스크립트 엔진이나 브라우저에 의해서 실행되거나 표현되도록 만들어진 구문은 아님

    // JSX를 포함한 코드를 실행했을 때 발생하는 에러
    // error
    // 트랜스파일러를 거쳐야 자바스크립트 런타임이 이해할 수 있는 자바스크립트 코드로 변환된다
    const Component = (
        <div className="hello">
            <input type="text" value="hello" />
        </div>       
    )

    // JSX 설계 목적
    // 다양한 트랜스파일러에서 다양한 속성을 가진 트리 구조를 토큰화해 ECMAscript로 변환하는데 초점
    // 즉 JSX를 트랜스파일하는 과정을 거쳐 자바스크립트가 이해할 수 있는 코드로 변경하는 것이 목표
    // HTML, XML 외에도 다른 구문으로 확장될 수 있게끔 고려돼 있으며 최대한 구문을 간결하고 친숙하게 작성할 수 있도록 설계
    // XML과 비슷하게 보이는 것은 단순히 자바스크립트 개발자로 하여금 친숙함을 느낄 수 있도록 하는것
}

{
    // JSX는 기본적으로 JSXElement, JSXAttributes, JSXChildren, JSXStrings라는 4가지 컴포넌트 기반으로 구성
}

{
    // JSXElement
    // HTML 요소와 비슷한 역할을 한다
    // JSXElement가 되기 위해서 만족해야 하는 조건
    // JSXOpeningElement: 일반적으로 볼 수 있는 요소 JSXOpeningElement로 시작했다면 JSXClosingElement가 동일한 요소로 같은 단계에서 선언돼 있어야 올바른 JSX문법
    // ex: <JSXElement JSXAttributes(optional)>
    // JSXClosingElement: JSXOpeningElement가 종료됐음을 알리는 요소 JSXOpeningElement와 쌍으로 사용돼야 한다
    // ex: </JSXElement>
    // JSXSelfClosingElement: 요소가 시작되고 스스로 종료되는 형태 <script />와 같은 모습을 띠고 있다 이는 내부적으로 자식을 포함할 수 없는 형태를 의미한다
    // ex: <JSXElement JSXAttributes(optional) />
    // JSXFragment: 아무런 요소가 없는 형태 JSXSelfClosingElement 형태를 띨 수는 없다 </>는 불가능 단 <></>는 가능
    // ex: <>JSXClidren(optional)</>
}

{
    // 리액트는 HTML 구문 이외에 사용자가 컴포넌트를 만들어 사용할 때에는 반드시 대문자로 시작하는 컴포넌트를 만들어야 사용 가능
    // HTML 태그명과 사용자가 만든 컴포넌트 태그명을 구분 짓기 위해서

    //function hello(text) {
    //    return <div>hello {text}</div>
    //}

    //export function App(){
        // 아래 코드는 HTML 태그로 인식되어 정상실행 x
    //  return <hello text="안녕하세요" />
    //  }
}

{
    // JSXElementName
    // JSXElement의 요소 이름으로 쓸 수 있는 것을 의미   

    // 이름으로 사용 가능한 것들
    // JSXIdentifier: JSX내부에서 사용할 수 있는 식별자를 의미 
    // 이는 자바스크립트 식별자 규칙과 동일
    // 즉 <$></$> <_></_>도 가능하지만 자바스크립트와 마찬가지로 숫자로 시작하거나 $와 _외에 다른 특수문자로 시작할 수 없다
    function Valid1(){
        return <$></$>
    }

    function Valid2(){
        return <_></_>
    }

    //불가능
    function Invalid1(){
        return <1></1>
    }
}

{
    // JSXNamespacedName: JSXIdenti
}