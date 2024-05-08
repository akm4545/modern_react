{
    // 정적 코드 분석 = 코드의 실행과는 별개로 코드 그 자체만으로 코드 스멜(잠재적으로 버그를 야기할 수 있는 코드)
    // 을 찾아내어 문제의 소지가 있는 코드를 사전에 수정하는것을 의미

    // 자바스크립트에서 가장 많이 사용되는 정적 코드 분석 도구 = ESLint
}

{
    // ESLint 코드 분석 과정
    // 1. 자바스크립트 코드를 문자열로 읽는다
    // 2. 자바스크립트 코드를 분석할 수 있는 파서(parser)로 코드를 구조화한다
    // 3. 2번에서 구조화한 트리를 AST(Abstract Syntax Tree)라 하며 이 구조화된 트리를 기준으로 각종 규칙과 대조
    // 4. 규칙과 대조했을 때 이를 위반한 코드를 알리거나(report) 수정한다(fix)

    // 자바스크립트를 분석하는 파서에는 여러 가지가 있는데 ESLint는 기본값으로 espree를 사용한다

    // 예제 코드
    function hello(str) {}

    // 이 코드를 espree로 분석 시
    {
        "type": "Program",
        "start": 0,
        "end": 22,
        "range": [0, 22],
        "body": [
            {
                "type": "FunctionDeclaration",
                "start": 0,
                "end": 22,
                "range": [0, 22]
                "id": {
                    "type": "Identifier",
                    "start": 9,
                    "end": 14,
                    "range": [9, 14]
                    "name": "hello"
                },
                "exoression": false,
                "generator": false,
                "async": false,
                "params": [
                    {
                        "type": "Identifier",
                        "start": 15,
                        "end": 18,
                        "range": [15, 18],
                        "name": "str",
                    }
                ],
                "body": {
                    "type": "BlockStatement",
                    "start": 20,
                    "end": 22,
                    "range": [20, 22],
                    "body": []
                }
            }
        ],
        "sourceType": "module"
    }

    // 단순 변수인지, 함수인지 등만 판단하는 것이 아니라 코드의 정확한 위치와 같은 세세한 정보도 포함
    // 이러한 정보가 있어야 ESLint나 Prettier같은 도구가 코드의 줄바꿈, 들여쓰기 등을 파악

    // 타입스크립트의 경우도 마찬가지로 @typescript-eslint/typescript-estree라고 하는 espree기반 파서가 있으며
    // 이를 통해 타입스크립트 코드를 분석해 구조화한다
}

{
    // ESLint가 espree로 코드를 분석한 결과를 바탕으로 어떤 코드가 잘못된 코드이며 어떻게 수정해야 할지도 정해야 한다
    // 이를 ESLint 규칙(rules)라고 하며 특정한 규칙의 모음을 plugins라고 한다

    // 코드에서 debugger의 사용을 금지하고 싶을때

    // debugger를 espree로 분석 결과
    // body의 type이 DebuggerStatement를 반환
    {
        "type": "Program",
        "body": [
            {
                "type": "DebuggerStatement",
                "range": [0, 8]
            }
        ],
        "sourceType": "module",
        "range": [0, 8]
    }

    // ESLint를 이용하여 사용을 금지하는 규칙 
    // 위의 파싱 결과를 토대로 debugger 사용을 제한하는 규칙인 no-debugger
    module.exports = {
        // 해당 규칙과 관련된 메타 정보
        meta: {
            type: 'problem',
            // 문서화에 필요한 정보
            docs: {
                description: 'Disallow the use of `debugger`',
                recommended: true,
                url: 'https://eslint.org/docs/rules/no-debugger',
            },
            // eslint --fix로 수정했을 때 수정 가능한지 여부
            fixable: null,
            schema: [],
            // 규칙을 어겼을때 반환하는 경고 문구
            messages: {
                unexpected: "Unexpected 'debugger' statement.",
            },
        },
        // 실제로 코드에서 문제점을 확인하는 곳
        // create에 있는 함수는 AST 트리를 실제로 순회해 여기서 선언한 특정 조건을 만족하는 코드를 찾고
        // 이러한 작업을 코드 전체에서 반복
        // 여기서는 DebuggerStatement를 만나면 해당 노드를 리포트해 debugger를 사용했다는 것을 알려준다
        create(context){
            return {
                DebuggerStatement(node){
                    context.report({
                        node,
                        messageId: 'unexpected',
                    })
                }
            }
        }
    }

    // ESLint가 제공하는 몇 가지 규칙은 공식 홈페이지에서 찾아볼 수 있다
}

{
    // eslint-plugin 접두사 플러그인
    // 앞서 언급한 규칙을 모아놓은 패키지
    // 예를들어 eslint-plugin-import 패키지는 import와 관련된 다양한 규칙을 제공
    // eslint-plugin-react = react와 관련된 규칙을 모아놓음
}

{
    // eslint-config
    // eslint-plugin 세트로 제공하는 패키지
    // 예를들어 어떤 조직에 여러 자바스크립트 저장소가 있고 이 저장소는 모두 리액트 기반의 비슷한 개발 환경으로 구성돼 있으며
    // 이 개발 환경에 맞는 ESLint 규칙과 정의를 일괄적용하고 싶다면
    // 여기에 필요한 eslint-plugin을 묶어 여러 프로젝트에 걸쳐 동일하게 사용할 수 있게 한다
    
    // 대부분의 경우 이미 존쟇는 eslint-config를 설치해 적용하는게 일반적
}

{
    // eslint-plugin, eslint-config는 네이밍 규칙으로 해당 접두사를 준수해야 하며 반드시 한 단어로 구성해야 한다
    // eslint-plugin-naver O
    // eslint-plugin-naver-financials X
    
    // 특정 스코프가 앞에 붙는 것까지는 가능
    // @titicaca/eslint-config-triple O
    // @titicaca/eslint-config-triple-rules X
}

{
    // eslint-config-airbnb
    // 리액트 기반 프로젝트에서 eslint-config를 선택한다고 했을 때 가장 먼저 손에 꼽는 eslint-config
    // 자바스크립트 프로젝트에 적용할 ESLint 중에서는 가장 합리적인 선택이 될 수 있다
    // 에어비엔비 개발자뿐만 아니라 500여 명의 수많은 개발자가 유지보수하고 있는 단연 가장 유명한 eslint-config 

    // 제공하는 규칙
    // 자바스크립트: https://github.com/airbnb/javascript#types
    // 리액트: https://github.com/airbnb/javascript/tree/master/react

    // 설치 가이드: https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb#eslint-config-aribnb-1
}

{
    // @titicaca/triple-config-kit
    // 한국 커뮤니티에서 운영되는 eslint-config 중 유지보수가 활발한 편에 속하며 많이 쓰이는 eslint-config 중 하나 
    // 스타트업 개발사인 트리플(현 인터파크트리플)에서 개발하고 있으며 현재도 꾸준히 업데이트되고 있다
    // 대부분의 eslint-config가 eslint-config-airbnb를 기반으로 약간의 룰을 수정해 배도되고 있는 것과 다르게 해당 
    // 패키지는 자체적으로 정의한 규칙을 기반으로 운영
    // 대부분의 유용하고 자바스크립트 개발자 사이에서 널리 알려진 규칙은 모두 제공하기 때문에 사용에 큰 지장은 없음

    // 외부로 제공하는 규칙에 대한 데스트 코드가 존재
    // 개발자가 규칙을 수정하거나 추가할 때 기대하는 바대로 eslint-config-triple에서 규칙이 추가됐는지 확인 가능
    // CI/CD 환경, 카나리 배포 등 일반적인 npm 라이브러리 구축 및 관리를 위한 시스템이 잘 구축돼 있다
    // 별도의 frontend규칙도 제공하고 있어 Node.js 환경 또는 리액트 환경에 맞는 규칙을 적용할 수 있다는 장점도 있다

    // ESLint 뿐만 아니라 Prettier와 Stylelint를 각각 별도의 룰인 @titicaca/prettier-config-triple, @titicaca/stylelint-config-triple로 모노레포를
    // 만들어 관리하고 있어 필요에 따라 설치해서 사용 가능
}

{
    // eslint-config-next
    // Next.js 프레임워크를 사용하고 있는 프로젝트에서 사용할 수 있는 eslint-config
    // 자바스크립트 코드를 정적으로 분석할 뿐만 아니라 페이지나 컴포넌트에서 반환하는 JSX 구문 및 _app, _document에서 작성돼 있는 HTML
    // 코드 또한 정적 분석 대상으로 분류해 제공
    // 단순 자바스크립트 코드에 대한 향상뿐만 아니라 전체적인 Next.js 기반 웹 서비스의 성능 향상에 도움이 될 수 있다
    // 핵심 웹 지표라고 하는 웹 서비스 성능에 영향을 미칠 수 있는 요소들을 분석해 제공하는 기능도 포함
    // Next.js로 작성된 코드라면 반드시 설치 권장

    // 제공하는 규칙: https://nextjs.org/docs/basic-features/eslint#eslint-plugin
    // 설치 가이드: https://nextjs.org/docs/basic-features/eslint
}

{
    // ESLint 규칙 만들기

    // 이미 존재하는 규칙을 커스터마이징해서 적용하기
    // import React를 제거하기 위한 ESLint 규칙 만들기
    
    // 리액트 17 버전부터는 새로운 JSX 런타임 덕분에 import React 구문이 필요가 없어짐
    // 이에 따라 해당 구문을 삭제 시 아주 약간이나마 번들러의 크기를 줄일 수 있다

    // import React가 있는 코드
    // Component
    // 다음과 같은 컴포넌트가 100개 있다고 가정
    import React from 'react'

    export function Component(){
        return <div>hello world!</div>
    }

    // App
    import React from 'react'
    import Component1 from './Components/1'
    import Component2 from './Components/2'
    // ...
    import Component100 from './Components/100'

    function App(){
        return (
            <div className="App">
                <Component1 />
                <Component2 />
                // ...
                <Component100 />
            </div>
        )
    }

    export default App

    // import React가 없는 코드
    // Component
    // 다음과 같은 컴포넌트가 100개 있다고 가정
    import React from 'react'

    export function Component(){
        return <div>hello world!</div>
    }

    // App
    import React from 'react'
    import Component1 from './Components/1'
    import Component2 from './Components/2'
    // ...
    import Component100 from './Components/100'

    function App(){
        return (
            <div className="App">
                <Component1 />
                <Component2 />
                // ...
                <Component100 />
            </div>
        )
    }

    export default App

    // 두 코드를 빌드하면 웹팩에서 제공하는 트리쉐이킹으로 사실 import React 구문이 제거된다
    // 하지만 트리쉐이킹 시간을 줄일 수 있기 때문에 여전히 import React 구문 삭제는 유용하다
}

{
    // no-restricted-imports = 어떠한 모듈을 import 하는 것을 금지하기 위해 만들어진 규칙
    // 추가적인 인수를 제공하면 import 할 수 있는 모듈 제한 가능

    // no-restricted-imports를 활용하여 import React 금지
    // .eslintrc.js 파일
    // default export만 금지 그래야 import React만 올바르게 필터링 가능
    // 이 exports를 제대로 하지 않는다면 모든 "import {} from 'react'"에 에러가 있다는 잘못된 ESLint 리포트가 만들어질 것이다
    module.exports = {
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    // paths에 금지시킬 모듈을 추가한다
                    paths: [
                        {
                            // 모듈명
                            name: 'react',
                            // 모듈 이름
                            importNames: ['default'],
                            // 경고 메시지
                            message:
                                "import React from 'react'는 react 17부터 더 이상 필요하지 않습니다. 필요한 것만 react로부터 import해서 사용해 주세요.",
                        },
                    ],
                },
            ],
        },
    }
}

{
    // 트리쉐이킹이 되지 않는 lodash 라이브러리 import 방지
    module.exports = {
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    name: 'lodash',
                    message:
                        'lodash는 CommonJS로 작성돼 있어 트리쉐이킹이 되지 않아 번들 사이즈를 크게 합니다. lodash/* 형식으로 import 해주세요.'
                }
            ]
        }
    }
}