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
    
}