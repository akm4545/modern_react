// react-hooks-testing-library
// 사용자 정의 훅 테스트 라이브러리

// useEffectDebugger 훅 
// 컴포넌트명과 props를 인수로 받아 해당 컴포넌트가 어떤 props의 변경으로 인해 리렌더링됐는지 확인해 주는 일종의 디버거

// 훅의 구현 기능
// 1. 최초 컴포넌트 렌더링 시에는 호출하지 않는다
// 2. 이전 props를 useRef에 저장해 두고 새로운 props를 넘겨받을 때마다 이전 props와 비교해 무엇이 렌더링을 
// 발생시켰는지 확인
// 3. 이전 props와 신규 props의 비교는 리액트의 원리와 동일하게 Object.is를 활용해 얕은 비교 수행
// 4. process.env.NODE_ENV === 'production'인 경우에는 로깅하지 않음 이는 웹팩을 빌드 도구로 사용할 경우 일반적으로
// 트리쉐이킹이 이뤄지는 일종의 최적화 기법
// 많은 번들러에서 process.env.NODE_ENV === 'production'인 경우에는 해당 코드가 빌드 결과물에 포함되지 않는다

import { useEffect, useRef, DependencyList } from "react";

export type Props = Record<string, unknown>

export const CONSOLE_PREFIX = '[useEffectDebugger]'

// props가 변경되지 않았지만 부모 컴포넌트가 리렌더링되는 경우에는 useEffectDebugger로 확인할 수 없다
export default function useEffectDebugger(
    componentName: string,
    props?: Props,
) {
    const prevProps = useRef<Props | undefined>()

    useEffect(() => {
        if(process.env.NODE_ENV === 'production'){
            return
        }

        const prevPropsCurrent = prevProps.current

        if(prevPropsCurrent !== undefined){
            const allKeys = Object.keys({...prevProps.current, ...props})

            const changedProps: Props = allKeys.reduce<Props>((result, key) => {
                const prevValue = prevPropsCurrent[key]
                const currentValue = props ? props[key] : undefined

                if(!Object.is(prevValue, currentValue)){
                    result[key] = {
                        before: prevValue,
                        after: currentValue,
                    }
                }

                return result
            }, {})

            if(Object.keys(changedProps).length){
                // eslint-disable-next-line no-console
                console.log(CONSOLE_PREFIX, componentName, changedProps)
            }
        }

        prevProps.current = props
    })
}

// 실 사용 예
// import { useState } from "react";

// import useEffectDebugger from './useEffectDebugger'

// function Test(props: { a: string, b: string}){
//     const { a, b } = props
//     useEffectDebugger('TestComponent', props)

//     return (
//         <>
//             <div>{a}</div>
//             <div>{b}</div>
//         </>
//     )
// }

// function App(){
//     const [count, setCount] = useState(0)

//     return (
//         <>
//             <button onClick={() => setCount((count) => count + 1)}>up</button>
//             <Test a={count % 2 === 0 ? '짝수' : '홀수'} b={count} />
//         </>
//     )
// }

// export default App

