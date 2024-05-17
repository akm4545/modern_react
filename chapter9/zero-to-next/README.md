2023년 1월 리액트 팀은 create-react-app은 미래에 더 이상 리액트 애플리케이션을 만드는 보일러플레이트 CLI가 아니라
여러 리액트 기반 프레임워크를 제안하는 런처 형태로 변경될 예정이라고 밝혔다 따라서 create-react-app의 대안 (create-next-app과 같은) 
또는 아무것도 없는 상태에서 리액트 프레임워크를 구축하는 방법을 알아야 한다

npm init으로 package.json 생성

Next.js 프로젝트 실행에 필요한 핵심 라이브러리 react, react-dom, next 설치
npm i react react-dom next

devDependencies에 필요한 패키지 설치
(typescript, 리액트 타입 지원에 필요한 @types/react, @types/react-dom, Node.js의 타입을 사용하기 위한 @types/node, ESLint 사용에 필요한
eslint, eslint-config-next)
npm i @types/node @types/react @types/react-dom eslint eslint-config-next typescript --save-dev

타입스크립트 설정을 위한 tsconfig.json 작성
tsconfig.json 파일을 생성하고 최상단에 해당 문구 작성

schemaStore에서 제공해 주는 정보 
해당 JSON 파일이 무엇을 의미하는지 또 어떤 키와 어떤 값이 들어갈 수 있는지 알려주는 도구 
자동 완성이 가능해진다
{
    "$schema": "https://json.schemastore.org/tsconfig.json"
}

이 밖에도 .eslintrc, .prettierrc와 같이 JSON 방식을 ㅗ설정을 작성하는 라이브러리가 schemastore에 해당 내용을 제공하고 있다면 더욱 편리하게 JSON 설정을 작성할 수 있다

tsconfig 옵션
compilerOptions: 타입스크립트를 자바스크립트로 컴파일할 때 사용하는 옵션

    target: 타입스크립트가 변환을 목표로 하는 언어 폴리필은 지원하지 않기 때문에 Promise와 같이 별도로 폴리필이 필요한 경우까지는 도와주지 않는다

    lib: es5 지원을 목표로 하고 Promise, Map 같은 객체들도 폴리필을 붙여서 지원할 환경을 준비해도 여전히 타입스크립트는 Promise나 Map의 존재에 대해서는 모를 것이다 이 경우에 가장 최신 버전을 의미하는 esnext를 추가하면 target은 es5라 할지라도 신규 기능에 대한 API 정보를 확인할 수 있게 되어 에러가 발생하지 않는다 여기서는 dom도 추가됐는데 이는 타입스크립트 환경에서 window.document등 브라우저 위주의 API에 대한 명세를 사용할 수 있게 하기 위해서다

    allowJS: 타입스크립트가 자바스크립트 파일 또한 컴파일할지를 결정. 주로 자바스크립트 프로젝트를 타입스크립트로 전환하는 과정에서 .js와 .ts 파일이 혼재됐을 때 사용하는 옵션

    skipLibCheck: 라이브러리에서 제공하는 d.ts에 대한 검사 여부를 결정. d.ts는 타입스크립트에서 제공하는 타입에 대한 정보를 담고 있는 파일
    (ex. react를 타입스크립트에서 사용하기 위해서 이 라이브러리의 타입 정보를 가지고 있는 것이 d.ts)
    이 옵션은 라이브러리의 d.ts를 검사하지 않는다는 것이다 
    만약 이 옵션이 켜져 있다면 d.ts에 에러가 있다면 에러를 발생시킨다 이 경우 라이브러리의 d.ts까지 검사해서 전체적인 프로젝트의 컴파일 시간이 길어지므로 일반적으로는 꺼놓는 경우가 많다

    strict: 타입스크립트 컴파일러의 엄격 모드를 제어한다 이 모드가 켜지면 다음 옵션도 true로 설정되는 것과 같다

        - alwaysStrict: 모든 자바스크립트 파일에 use strict를 추가

        - strictNullChecks: 엄격한 널 검사를 활성화 이 옵션을 켜면 null과 undefined를 명확하게 구분해 사용할 수 있게 된다 
        예를 들어 
        const ids = [1, 2, 3]

        const found = ids.find((id) => id === 1)
        // strictNullChecks가 true라면 found는 number | undefined 타입이 되고
        // Object가 undefined일 수 있다.
        found + 1
        이 코드는 개발자가 보기에는 무조건 found가 1이기 때문에 오류가 날 수 없는 코드다
        그러나 strictNullChecks를 켜게 되면 Array.prototype.find와 같이 undefined나 null의 가능성이 있는 모든 코드에 대해 undefined, null을 반환한다
        언뜻 보면 굉장히 번거로워 보이지만 이는 이후에 있을 수 있는 런타임 에러를 미연에 방지하는 좋은 옵션이므로 꼭 켜두기를 권장

        - strictBindCallApply: 함수에 대해 사용할 수 있는 call, bind, apply에 대해 정확한 인수를 요구하는 옵션이다 
        function add(a: number, b: number) {
            return a + b
        }

        // strictBindCallApply가 true라면
        // 2개의 인수를 예상했지만 3개의 인수를 넘겨줬다.
        add.call(null, 1, 2, 3)
        이 옵션을 켜두면 call, bind, apply를 사용할 때 정확한 인수를 넘겨주지 않으면 에러가 발생한다 
        자바스크립트에서는 인수의 수가 많아질 경우 이후 인수를 무시해 크게 문제되지 않지만 향후에 발생할 수 있는 런타임 에러를 방지해 주므로 꼭 켜두기를 권장

        - strictFunctionTypes: 함수의 타입에 대한 엄격함을 유지한다
        function add(a: number, b: number){
            return a + b
        }

        type Add = (a: number | string, b: number | string) => number | string

        // strictFunctionTypes가 true 라면
        // 타입 오류: (a: number, b: number) => number 타입은 Add에 할당할 수 없습니다.
        let newAdd: Add = add
        이 옵션도 마찬가지로 특별한 이유가 없다면 켜두는 것을 권장

        - strictPropertyInitialization: 클래스 내부의 프로퍼티에 값을 할당할 때 타입이 올바르지 않다면 에러가 발생

        - noImplicitAny: 타입을 명시하지 않은 변수가 있다면 any를 자동으로 할당하는 기능 이 옵션을 켜두면 타입을 명시하지 않은 변수에 any를 넣지 않고 에러가 발생

        - noImplicaitThis: this를 추론할 수 없는 상황에서 any를 자동으로 할당하는 기능 이 옵션을 켜두면 any를 할당하지 않고 에러가 발생

        - useUnknownInCatchVariables: catch 구문에서 잡은 변수에 대해서는 기본적으로 any를 할당 그러나 4.0부터는 이 옵션을 해당 변수에 unknown을 할당한다 try...catch 구문에서 잡히는 것이 꼭 에러라는 법은 없기 떄문이다 
        try{
            throw 5
        } catch(e) {
            // number
            console.log(typeof e)
        }
        이 옵션을 켜두는 것은 타당한 선택이라고 볼 수 있다 대신 진짜 error를 잡고 싶다면 가드 문을 사용하면 된다
        try{
            throw new Error()
        } catch(e) {
            if(e instanceof Error){
                // Error
                console.log(e)
            }
        }
        strict 모드는 타입을 엄격히 지키는 것을 도와주고 나아가 타입스크립트의 타입 시스템을 이해하는데 많은 도움을 얻을 수 있으므로 자바스크립트를 타입스크립트로 전환하는 과도기 과정과 같이 타입을 엄격하게 강제할 수 없는 상황이 아니라면 켜두는 것을 권장

    forceConsistentCasingInFileNames: 이 옵션을 켜면 파일 이름의 대소문자를 구분하도록 강제 

    noEmit: 컴파일을 하지 않고 타입 체크만 한다. Next.js는 swc가 타입스크립트 파일을 컴파일하므로 해당 옵션을 켜둔다
    이 옵션이 있으면 타입스크립트는 단순히 타입 검사만 하는 역할을 한다 swc는 러스트 기반 컴파일러로 타입스크립트 대비 월등히 빠른 컴파일 속도를 자랑한다

    esModuleInterop: CommonJS 방식으로 보낸 모듈을 ES 모듈 방식의 import로 가져올 수 있게 해준다 과거 자바스크립트에는 여러 가지 방식의 모듈 옵션이 존재했는데 대표적인 것이 CommonJS와 AMD 방식
    현재는 export function ... 스타일의 ES 모듈 방식이 대세로 자리 잡았지만 Node.js만 하더라도 module.exports의 CommonJS방식으로 export 한다 이 옵션을 켜두면 CommonJS 방식으로 내보낸 모듈도 ES 방식으로 import 할 수 있게끔 도와준다

    module: 모듈 시스템을 설정한다 대표적으로 commonjs와 esnext가 있다 commonjs는 require를 사용하고 esnext는 import를 사용한다
    esnext는 import를 사용하므로 import를 사용할 수 있는 환경에서는 esnext를 사용하는 것이좋다

    moduleResolution: 모듈을 해석하는 방식을 설정 node는 node_modules를 기준으로 모듈을 해석하고 classic은 tsconfig.json이 있는 디렉터리를 기준으로 모듈을 해석한다. node는 module이 CommonJS일 때만 사용할 수 있다

    resolveJsonModule: JSON 파일을 import 할 수 있게 해준다 이 옵션을 켜두면 allowJs 옵션도 자동으로 켜진다

    isolatedModules: 타입스크립트 컴파일러는 파일에 import나 export가 없다면 단순 스크립트 파일로 인식해 이러한 파일이 생성되지 않도록 만든다 즉 단순히 다른 모듈 시스템과 연계되지 않고 단독으로 있는 파일의 생성을 막기 위한 옵션

    jsx: .tsx 파일 내부에 있는 JSX를 어떻게 컴파일할지 설정한다
    export const Hello = () => <div>Hello</div>
        - react: 기본값이며 React.createElement로 변환 리액트 16까지 기본적인 변환 방식
        export const Hello = () => React.createElement('h1', null, 'Hello')
        - react-jsx: 리액트 17에서 새롭게 등장한 방식으로 react/jsx-runtime을 사용해 변환 이 방식을 사용하면 React.createElement를 사용하지 않아 import React from 'react'를 컴포넌트 상단에 적지 않아도 된다
        import { jsx as _jsx } from 'react/jsx-runtime'
        export const Hello = () => _jsx('div', { children: 'Hello' })
        - react-jsxdev: react-jsx와 동일하지만 디버깅 정보가 추가된다
        import { jsxDEV as _jsxDEV } from 'react/jsx-dev-runtime'
        const _jsxFileName = 'file://input.jsx'
        export const Hello = () => 
            _jsxDEV(
                'div',
                { children: 'Hello' },
                void 0,
                false,
                { fileName: _jsxFileName, lineNumber: 1, columnNumber: 27 },
                this,
            )
        - preserve: 변환하지 않고 그대로 유지
        export const Hello = () => <div>Hello</div>
        - react-native: 리액트 네이티브에서 사용하는 방식으로 마찬가지로 변환하지 않는다
        export const Hello = () => <div>Hello</div>
    프로젝트 리액트 버전에 따라 react-jsx 또는 react를 적절하게 사용 여기서는 preserve가 사용됐는데 swc가 JSX 또한 변환해 주기 떄문

    incremental: 이 옵션이 활성화되면 타입스크립트는 마지막 컴파일 정보를 .tsbuildinfo 파일 형태로 만들어 디스크에 저장
    이러게 컴파일 정보를 별도 파일로 저장해 두면 이후에 다시 컴파일러가 호출됐을 때 해당 정보를 활용해 가장 비용이 적게 드는 방식으로 컴파일을 수행해 컴파일이 더 빨라지는 효과가 있다

    baseUrl: 모듈을 찾을 때 기준이 되는 디렉터리를 지정 이 설정은 바로 밑에서 소개할 paths와 함께 사용

    paths: 일반적인 모듈을 불러오게 되면 ./나 ../를 활용한 상대 경로를 활용 그러나 이 상대 경로는 파일이 많아지고 구조가 복잡해질수록 ../../ 등이 중첩되면서 읽기 어려워지는데 paths를 활용하면 이러한 경로에 별칭을 지정할 수 있다
    (ex. #hooks의 경우 #hooks/useToggle이라는 경로가 존재하면 이는 baseUrl과 함께 src/hooks/useToggle이라는 경로로 해석된다)
    이 별칭은 보통 #나 $ 같은 특수문자 접두사와 함께 자주 사용 @는 스코프 패키지에 널리 사용되므로 사용을 피하자

include: 타입스크립트 컴파일 대상에서 포함시킬 파일 목록을 의미 여기서는 타입스크립트 파일과 Next.js에서 자동으로 생성하는 next-env.d.ts 파일을 포함시켰다

exclude: 타입스크립트 컴파일 대상에서 제외시킬 파일 목록을 의미 node_modules를 대상에서 제외시켰다


next.config.js 파일 생성
next.config.js에서 사용 가능한 옵션을 확인하고 싶다면 깃허브 저장소를 방문해 확인할 수 있다

next.config.js 옵션
reactStrictMode: 리액트 엄격 모드 활성화
poweredByHeader: 일반적으로 보안 취약점으로 취급되는 X-Powered-By 헤더 제거
eslint.ignoreDuringBuilds: 빌드 시에 ESLint를 무시. 일반적으로 Next.js 빌드 시에 ESLint도 같이 수행 여기서는 true로 설정해 빌드 시에 ESLint를 수행하지 않게 했다 이후에 ESLint는 CI 과정에서 별도로 작동하게 만들어 빌드를 더욱 빠르게 만든다

eslint-config-next는 단순히 코드에 있을 잠재적인 문제만 확인할 뿐 띄어쓰기나 줄바꿈과 같이 코드의 스타일링을 정의해 주지는 않는다
일반적인 ESLint 작업을 수행하기 위해 가장 설치 및 설정이 쉬운 @titicaca/eslint-config-triple을 설치해 사용

설치
npm i @titicaca/eslint-config-triple --save-dev

eslint-config-next와 eslint-config-triple이 함께 작동하려면 별도 설정이 필요하다

Next.js에 스타일 적용 styled-component 사용

npm i styled-components
npm i @types/styled-components --save-dev

swc에 styled-components를 사용한다는 것을 알리기 위해 styledComponents: true를 next.config.js에 추가
추가적으로 pages/_document.tsx의 Head에 styled-components를 사용하기 위한 ServerStyleSheet를 추가한다 (src 생성 -> src/pages 생성)

src 폴더 하위 구조
(Next.js 13 버전 기준)
pages: Next.js에서 예약어로 지정해 두고 사용하는 폴더 이 폴더 하위의 내용은 모두 실제 라우터가 된다
    /: 메인 페이지
    /todos/:id: 상세 페이지
components: 페이지 내부에서 사용하는 컴포넌트를 모아둔 폴더
hooks: 직접 만든 훅을 모아둔 폴더
types: 서버 응답 타입 등 공통으로 사용하는 타입을 모아둔 폴더
utils: 애플리케이션 전역에서 공용으로 사용하는 유틸성 파일을 모아둔 폴더

Next.js 프로젝트 실행, 빌드, 린트와 관련된 명령어를 package.json에 기재

요즘은 대부분의 서비스가 마이크로 프론트엔드를 지향하기 때문에 프로젝트를 구축하는 일도 잦다
매번 똑같은 설정을 매번 반복하는 것은 비효율적이기 때문에 다음과 같은 방법을 고려해 볼 수 있다

1. 보일러플레이트 프로젝트 생성 후 깃허브에서 Template repository 옵션 체크
템플릿으로 저장소를 생성하면 저장소명과 함께 generated from 이라는 메시지로 어떤 템플릿에서 만들어진 저장소인지 확인 가능

2. 나만의 create-***-app을 만드는것 
cli 패키지로 만든다면 create-next-app과 마찬가지로 사용자의 입력을 받아 서로 다른 패키지를 만들 수 있다
이 방법은 조직 내에서 마이크로서비스를 지향하고 있고 앞으로 생성해야 할 프로젝트 또한 많다면 충분히 검토해 볼 만하다
- create-next-app 내부의 코드: create-next-app의 소스코드를 살펴보면 알겠지만 일단 하나의 템플릿을 미리 만들어 둔 다음 여기서에서 CLI로 사용자의 입력을 받아 커스터마이징

- Creating a CLI tool with Node.js: npm을 기반으로 CLI 패키지를 만드는 방법을 상세히 설명하고 있다


CI/CD를 위한 깃허브 액션
깃허브 액션을 위한 개념
러너(runner): 러너란 파일로 작성된 깃허브 액션이 실행되는 서버를 의미 특별히 지정하지 않으면 공용 깃허브 액션 서버를 이용하며 별도의 러너를 구축해 자체적으로 운영할 수도 있다

액션(action): 러너에서 실행되는 하나의 작업 단위 yaml 파일로 작성된 내용을 하나의 액션으로 볼 수 있다

이벤트(event): 깃허브 액션의 실행을 일으키는 이벤트를 의미 개발자의 필요에 따라 한 개 이상의 이벤트를 지정할 수 있다 또한 특정 브랜치를 지정하는 이벤트도 가능 주로 사용되는 이벤트는 다음과 같다
    - pull_request: PR(pull request)과 관련된 이벤트로서 PR이 열리거나 닫히거나 수정되거나 할당되거나 리뷰 요청되는 등의 PR과 관련된 이벤트를 의미

    - issues: 이슈와 관련된 이벤트로서 이슈가 열리거나, 닫히거나, 삭제되거나, 할당되는 등 이슈와 관련된 이벤트를 의미

    - push: 커밋이나 태그가 푸시될 때 발생하는 이벤트를 의미

    - schedule: 저장소에서 발생하는 이벤트와 별개로 특정 시간에 실행되는 이벤트를 의미 여기서 말하는 시간은 cron에서 사용되는 시간을 의미

잡(jobs): 잡이란 하나의 러너에서 실행되는 여러 스탭의 모음을 의미 하나의 액션에서 여러 잡을 생성할 수 있으며 특별히 선언한 게 없다면 내부 가상머신에서 각 잡은 병렬로 실행

스탭(steps): 잡 내부에서 일어나는 하나하나의 작업을 의미 셀 명령어나 다른 액션을 실행할 수도 있다 이 작업은 병렬로 일어나지 않는다

브랜치 보호 규칙
해당 저장소의 Settings -> Code and automation -> Branches로 이동한 다음 Add branch protection rule을 클릭해 브랜치 보호 규칙을 추가
ex. main 브랜치에 대해 Require status checks to pass before merging(머지하기 전에 상태 체크를 필수로 한다), Require branches to be up to date before merging(머지하기 전에 브랜치가 최신 내용인지 확인한다)을 체크해 해당 브랜치가 최신 상태인지 확인하고 머지할 수 있는 기능을 켠다
그리고 마지막으로 꼭 실행돼야 하는 액션의 파일명을 선택하고 저장하면 해당 액션이 성공하기 전까지는 main 브랜치에 대한 머지를 막을 수 있다

즉 기본 브랜치에는 항상 테스트, 빌드와 같은 CI가 성공한 코드만 푸시될 수 있어 코드의 정합성을 확보할 수 있다

깃허브 제공 기본 액션

actions/checkout: 깃허브 저장소를 체크아웃하는 액션. 저장소를 기반으로 작업을 해야 한다면 반드시 필요하다. 일반적으로는 아무런 옵션 없이 사용해 해당 액션을 트리거한 최신 커밋을 불러오지만 ref를 지정해 특정 브랜치나 커밋을 체크아웃할 수도 있다

actions/setup-node: Node.js를 설치하는 액션 Node.js를 사용하는 프로젝트라면 반드시 필요. 설치할 Node.js 버전을 지정할 수도 있다

actions/github-script: GitHub API가 제공하는 기능을 사용할 수 있도록 도와주는 액션 GitHub API를 이용하면 깃허브에서 할 수 있는 대부분의 작업을 수행할 수 있으므로 한 번쯤 API 문서를 보는 것을 추천

actions/stale: 오래된 이슈나 PR을 자동으로 닫거나 더 이상 커뮤니케이션하지 못하도록 닫는다. 저장소가 오래 되어 과거에 생성된 이슈나 풀 리퀘스트가 너무 많을 경우 정리하는데 도움이 된다

actions/dependency-review-action: 의존성 그래프에 대한 변경, 즉 package.json, package-lock.json, pnpm-lock.yaml 등의 내용이 변경됐을 때 실행되는 액션으로 의존성을 분석해 보안 또는 라이선스에 문제가 있다면 이를 알려준다

github/codeql-action: 깃허브의 코드 분석 솔루션인 code-ql을 활용해 저장소 내 코드의 취약점 분석
languages에 javascript만 설정해 두면 자바스크립트와 타입스크립트를 모두 검사하므로 특정 스케쥴에 맞춰서 실행하거나 CI로 활용 가능

calibreapp/image-actions
이미지를 추가해서 관리하는 경우 별도의 CDN을 사용해 이미지를 제공하기도 하지만 매우 중요한 이미지거나 혹은 아직 CDN을 구축하지 못한 경우 등은
이미지를 저장소 내부에 두고 함께 관리하곤 한다

이러한 이미지들은 사용자에게 불편함을 주지 않는 선에서 가장 작은 파일로 관리될 필요가 있는데 이를 위해 이미지를 최적화 하는 액션이 
calibreapp/image-actions다

PR(jpg, jpeg, png 등)을 sharp 패키지를 이용해 거의 무손실로 압축해서 다시 커밋해준다
잘 구성된 프레임워크 (Next.js)는 이미지를 최적화하는 방법을 제공하고 있지만 저장소 자체의 이미지 크기를 줄인다면 풀 할때 부담을 덜 수 있어 유용하다

lirantal/is-website-vulnerable
특정 웹사이트를 방문해 해당 웹사이트에 라이브러리 취약점이 존재하는지 확인하는 깃허브 액션 
Snyk 솔루션 기반 작동 실제로 웹사이트를 방문해서 웹사이트에 노출되고 있는 라이브러리를 분석한 결과를 알려준다는 차이점이 존재
개발자의 컴퓨터에서 설치만 되고 실제 배포에 포함되지 않는 devDependencies나 번들링 과정에서 트리쉐이킹으로 인해 사라진 코드는 취약점으로 
진단되지 않는다 
이 액션은 npm 패키지 실행 도구인 npx로도 실행이 가능하다 따라서 직접 npx를 실행하는 액션을 만들어 사용할 수도 있다

이 액션을 활용해 프론트엔드 프로젝트가 배포된 웹사이트를 주기적으로 스캔해 취약점이 있는지 확인할 수 있다

Lighthouse CI 
구글에서 제공하는 액션 웹 성능 지표인 라이트하우스를 CI 기반으로 실행할 수 있도록 도와주는 도구
이 깃허브 액션을 활용하면 프로젝트의 URL을 방문해 라이트하우스 검사를 실행 
이를 통해 현재 머지 예정인 웹사이트의 성능 지표를 측정할 수 있다

Lighthouse CI 홈페이지를 방문해 Configure를 누른 다음 해당 깃허브 앱이 사용하고자 하는 저장소의 권한을 얻는다


Dependabot
의존성 문제가 있다면 이에 대해 문제를 알려주고 가능하다면 해결할 수 있는 풀 리퀘스트까지 열어준다

package.json 
버전
유의적 버전(semantic versioning)
주.부.수로 이루어져 있다

1. 기존 버전과 호환되지 않게 API가 바뀌면 주 버전을 올린다
2. 기존 버전과 호환되면서 새로운 기능을 추가할 때는 부 버전을 올린다
3. 기존 버전과 호환되면서 버그를 수정한 것이라면 수 버전을 올린다

그 외 중요한 내용
- 특정 버전으로 패키지를 배포하고 나면 그 버전의 내용은 절대 변경하지 말아야 한다 변경사항이 있다면 반드시 새로운 버전으로 배포

- 주 버전0 (0.y.z)은 초기 개발을 위해 쓴다 이 버전은 아무 때나 마음대로 바꿀 수 있다. 이 공개 API는 안정판으로 보지 않는 게 좋다 대표적인 예로 Recoil이 있다 2022년 10월 기준 Recoil의 버전은 0.7.6이다 만약 어느 날 0.8.0으로 버전이 올라갔다면 이는 기능이 추가된 것뿐만 아니라 API스펙이 변경됐을 수도 있다 그러므로 0으로 시작하는 실험 버전 라이브러리는 항상 사용할 때 주의를 기울여야 한다

- 수 버전 Z(x.y.Z | x > 0)는 반드시 그 이전 버전 API와 호환되는 버그 수정의 경우에만 올린다 버그 수정은 잘못된 내부 기능을 고치는 것이라 정의한다
만약 버그 수정이 API 스펙 변경을 동반한다면 반드시 주 버전을 올려야 한다. 만약 주 버전을 올리는 것이 껄끄럽다면 해당 API를 지원 중단(deprecated)으로 처리하고 새로운 API를 만들어 부 버전을 올리는 것이 좋다

npm은 이러한 버전에 대해 나름의 규칙을 정의해뒀다 주로 사용하는 버전 방식은 다음과 같다
- react@16.0.0: 버전 앞에 아무런 특수 기호가 없다면 정확히 해당 버전에 대해서만 의존하고 있다는 뜻이다

- react@^16.0.0: 16.0.0과 호환되는 버전을 의미 호환된다는 뜻은 0보다 높은 부 버전에 대해서는 호환된다는 과정 하에 상위 버전을 설치할 수 있다는 것을 뜻한다 즉 여기서 가능한 버전은 16.0.0부터 17.0.0 미만의 모든 버전이다 단 앞서 언급한 것처럼 주 버전이 0인 경우에는 부 버전이 올라가도 API에 변경이 있을 수 있으므로 수 버전까지만 수용

- react@~16.0.0: 패치 버전에 대해서만 호환되는 버전을 의미한다 즉 여기서 가능한 버전은 16.0.0부터 16.1.0 미만의 모든 버전이다. 기능이 추가되는 수 버전은 사용하지 않는다


