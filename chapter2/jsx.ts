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
    // JSXNamespacedName: JSXIdentifier: JSXIdentifier
    // :을 통해 서로 다른 식별자를 이어주는것도 하나의 식별자로 취급 
    // 두 개 이상은 올바른 식별자로 취급하지 않음
    function valid(){
        return <foo:bar></foo:bar>
    }

    //불가능
    function invalid(){
        return <foo:bar:baz></foo:bar:baz>
    }
}

{
    // JSXmemberExpression: JSXIdentifier.JSXIdentifier
    // .을 통해 서도 다른 식별자를 이어 하나의 식별자로 취급
    // 여러개도 가능
    // JSXNamespacedName과 이어서 사용은 불가능
    function valid1(){
        return <foo.bar></foo.bar>
    }

    function valid2(){
        return <foo.bar.baz></foo.bar.baz>
    }

    //불가능
    function invalid(){
        return <foo:bar.baz></foo:bar.baz>
    }
}

{
    // JSXAttributes
    // JSXElement에 부여할 수 있는 속성

    // JSXSpreadAttributes: 자바스크립트 전개 연산자와 동일
    // {...AssignmentExpresstion}: AssignmentExpresstion = 단순 자바 객체만이 아니라 조건문 표현식, 화살표 함수 등 모든 표현식이 존재할 수 있다
}

{
    // JSXAttribute: 속성을 나타내는 키와 값으로 짝을 이루어서 표현 
    // 키는 JSXAttributeName, 값은 JSXAttributeValue로 불림
    // 속성의 키값(JSXAttributeName) JSXElementName에서 언급했던 JSXIdentifier와 JSXNamespacedName이 가능 (:)
    function valid1(){
        return <foo.bar foo:bar="baz"></foo.bar>
    }
}

{
    // JSXAttributeValue : 속성의 키에 할당할 수 있는 값
    // 다음을 만족해야 함
    // 큰따옴표로 구성된 문자열
    // 작은따옴표로 구성된 문자열
    // {AssignmentExpression}: 자바스크립트에서 값을 할당할 때 쓰는 표현식
    // JSXElement: 값으로 다른 JSX 요소
    function Child({attribute}){
        return <div>{attribute}</div>
    }

    // 일반적으로 <Child attribute={<div>hello</div>} /> 로 기입
    // 문법적 오류가 아닌 prettier의 규칙 (읽기 쉽게 하기 위해)
    export default function App(){
        return (
            <div>
                <Child attribute=<div>hello</div> />
            </div>
        )
    }

    // JSXFragment: 값으로 별도 속성을 갖지 않는 형태의 JSX요소 (<></>)
}

{
    // JSXChildren
    // JSXElement의 자식 값 (JSX는 트리 구조이므로 부모 자식 관계가 가능)
}

{
    // JSXChild: JSXChildren 기본 단위
    // JSXChildren은 JSXChildren를 0개 이상 가질 수 있다
    // JSXText: {, <, >,}을 제외한 문자열 이는 다른 JSX문법과 혼동을 줄 수 있기 때문에 이 문자를 표현하고 싶다면 문자열로 표현
    function valid(){
        return <>{'{} <>'}</>
    } 
    // JSXElement: 값으로 다른 JSX 요소가 들어갈 수 있다
    // JSXFragment: 값으로 빈 JSX 요소인 <></>가 들어갈 수 있다
    // {JSXChildExpression (optional)}: JSXChildExpression = AssignmentExpression을 의미
    // 다음 코드도 올바른 JSX표현식으로 볼 수 있다
    // foo 문자 출력
    export default function App(){
        return <>{(() => 'foo')()}</>
    }
}

{
    // JSXStrings
    // HTML에서 사용 가능한 문자열은 모두 JSXStrings에서도 가능
    // HTML의 내용을 쉽게 JSX로 가져올 수 있도록 의도적인 설계
    // 이스케이프 문자를 제약 없이 사용 가능
    <button>\<button>

    // error
    let escape1 = "\"

    //ok
    let escape2 = "\\"
}

{
    // JSX 예제

    // 하나의 요소로 구성된 가장 단순한 형태
    const ComponentA = <A>안녕하세요.</A>

    // 자식이 없이 SelfClosingTag로 닫혀 있는 형태
    const ComponentB = <A />

    // 옵션을 {}와 전개연산자로 넣는 형태
    const ComponentC = <A {...{required: true}} />

    // 속성만 넣는 형태
    const ComponentD = <A required />

    // 속성과 속성값을 넣는 형태
    const ComponentE = <A required={false} />

    const ComponentF = (
        <A>
            // 문자열은 큰, 작은따옴표 모두 가능
            <B text="리액트" />
        </A>
    )

    const ComponentG = (
        <A>
            // 옵션의 값으로 JSXElement를 넣는 것 또한 올바른 문법
            <B optionalChildren={<>안녕하세요.</>} />
        </A>
    )

    const ComponentH = (
        <A>
            // 여러개의 자식도 포함 가능
            안녕하세요
            <B text="리액트" />
        </A>
    )
}

{
    // 이 외에 리액트 내에서는 유효하지 않거나 사용되는 경우가 거의 없는 문법도 JSX 문법 자체로는 유효
    function ComponentA(){
        return <A.B></A.B>
    }

    function ComponentB(){
        return <A.B.C></A.B.C>
    }

    function ComponentC(){
        return <A:B:C></A:B:C>
    }

    function ComponentD() {
        return <$></$>
    }

    function ComponentE(){
        return <_></_>
    }
}

{
    // JSX -> 자바스크립트 구문 변화 = @babel/plugin-transform-react-jsx 플러그인

    // 예제
    const ComponentA = <A required={true}>Hello World</A>

    const ComponentB = <>Hello World</>

    const ComponentC = (
        <div>
            <span>hello world</span>
        </div>
    )

    // 변환 결과
    'use strict'

    var ComponentA = React.createElement(
        A,
        {
            required: true,
        },
        'Hello World',
    )

    var ComponentB = React.createElement(React.Fragment, null, 'Hello World')

    var ComponentC = React.createElement(
        'div',
        null,
        React.createElement('span', null, 'hello world')
    )

    // 리액트 17, 바벨 7.9.0 이후 버전에서 추가된 자동 런타임으로 트랜스파일
    'use strict'

    var _jsxRuntime = require('custom-jsx-library/jsx-runtime')

    var ComponentA = (0, _jsxRuntime.jsx)(A, {
        required: true,
        children: 'Hello World',
    })

    var ComponentB = (0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
        children: 'Hello World',
    })

    var ComponentC = (0, _jsxRuntime.jsx)('div', {
        children: (0, _jsxRuntime.jsx)('span', {
            children: 'hello world',
        }),
    })
}

{
    // @babel/plugin-transform-react-jsx 설정
    import * as Babel from '@babel/standalone'

    Babel.registerPlugin(
        '@babel/plugin-transform-react-jsx',
        require('@babel/plugin-transform-react-jsx')
    )

    const BABEL_CONFIG = {
        presets: [],
        plugins: [
            [
                '@babel/plugin-transform-react-jsx',
                {
                    throwIfNamespace: false,
                    reuntime: 'automatic',
                    importSource: 'custom-jsx-library',
                },
            ],
        ],
    }

    const SOURCE_CODE = `const ComponentA = <A>안녕하세요.</A>`

    //code 변수에 트랜스파일된 결과가 담긴다
    const {code} = Bable.transform(SOURCE_CODE, BABEL_CONFIG)

    // 두 결과물의 공통점
    // JSXElement를 첫 번째 인수로 선언해 요소 정의
    // 옵셔널인 JSXChildren, JSXAttributes, JSXStrings는 이후 인수로 넘겨주어 처리

    // JSXElement 렌더링 시 굳이 요소 전체를 감싸지 않아도 처리 가능
    // JSXElement만 다르고 JSXAttributes, JSXChildren이 완전히 동일한 상활에서 중복 코드를 최소화 할 수 있다
    // 예제
    import {createElement, PropsWithChildren} from 'react'

    // props 여부에 따라 chidren 요소만 달라지는 경우
    // 굳이 번거롭게 전체 내용을 삼항을 처리할 필요가 없다
    // 이 경우 불필요한 코드 중복이 일어난다

    // isHeading, children 변수를 받아 PropsWithChildren타입의 컴포넌트를 리턴
    function TextOrHeading({
        isHeading,
        children,
    }: PropsWithChildren<{isHeading: boolean}>){
        return isHeading ? (
            <h1 className="text">{children}</h1>
        ) : (
            <span className="text">{children></span>
        )
    }

    // JSX가 변환되는 특성을 활용하여 간결하게 처리
    // JSX 반환값이 결국 React.createElement이므로 이린 식으로 리팩터링 가능
    import {createElement} from 'react'

    function TextOrHeading2({
        isHeading,
        children
    }: PropsWithChildren<{isHeading: boolean}>) {
        return createElement(
            isHeading ? 'hi' : 'span',
            {className: 'text'},
            children
        )
    }
}

{
    // JSX 구문 중 리액트에서 사용하지 않는 것
    // JSXNamespaceName
    // JSXMemeberExpression
}