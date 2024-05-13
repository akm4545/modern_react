// useEffectDebugger를 테스트 하는 코드

// 만약 리액트 18버전 미만이면 @testing-library/react 대신 @testing-library/react-hooks를 사용
import { renderHook } from "@testing-library/react";

import useEffectDebugger, { CONSOLE_PREFIX } from "./useEffectDebugger";

// 해당 훅은 console.log를 사용하므로 spyOn을 활용해 호출 여부 확인
const consoleSpy = jest.spyOn(console, 'log')
// 테스트 대상 컴포넌트의 이름을 componentName에 저장
const componentName = 'TestComponent'

describe('useEffectDebugger', () => {
    // 매번 테스트가 끝난 후에 process.env.NODE_ENV 변경
    // 할당문을 강제로 작성한 이유는 타입스크립트에서는 NODE_ENV를 읽기 전용 속성으로 간주
    afterAll(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        process.env.NODE_ENV = 'development'
    })

    it('props가 없으면 호출되지 않는다.', () => {
        // 훅을 렌더링 하기 위해 renderHook을 래핑해서 사용
        renderHook(() => useEffectDebugger(componentName))

        expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('최초에는 호출되지 않는다.', () => {
        const props = { hello: 'world' }

        renderHook(() => useEffectDebugger(componentName, props))

        expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('props가 변경되지 않으면 호출되지 않는다.', () => {
        const props = { hello: 'world' }

        // renderHook 하나당 하나의 독립된 컴포넌트가 생성
        // 훅을 두 번 호출려혀면 renderHook이 반환하는 객체의 값 중 하나인 rerender 함수를 사용해야 한다
        // rerender외에도 unmount 함수를 반환하여 컴포넌트 언마운트 시킨다
        const { rerender } = renderHook(() => useEffectDebugger(componentName, props))

        expect(consoleSpy).not.toHaveBeenCalled()

        rerender()

        expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('props가 변경되면 다시 호출한다.', () => {
        const props = { hello: 'world' }

        // renderHook에서 함수의 초깃갑인 initialProps를 지정할 수 있다
        const { rerender } = renderHook(
            ({ componentName, props}) => useEffectDebugger(componentName, props),
            {
                initialProps: {
                    componentName,
                    props,
                },
            },
        )

        const newProps = {hello: 'world2' }

        // rerender를 호출해 다시 렌더링 할 때 초깃값을 변경해 다시 렌더링할 수 있다
        rerender({ componentName, props: newProps })

        expect(consoleSpy).toHaveBeenCalled()
    })

    it('process.env.NODE_ENV가 production이면 호출되지 않는다', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-commnet
        // @ts-ignore
        process.env.NODE_ENV = 'production'

        const props = { hello: 'world' }

        const { rerender } = renderHook(
            ({ componentName, props }) => useEffectDebugger(componentName, props),
            {
                initialProps: {
                    componentName,
                    props
                },
            },
        )

        const newProps = { hello: 'world2'}

        rerender({ componentName, props: newProps })

        expect(consoleSpy).not.toHaveBeenCalled()
    })
})

