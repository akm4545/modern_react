import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { InputComponent } from "./index";

// setup 함수: setup 함수는 내부에서 컴포넌트를 렌더링하고 또 테스트에 필요한 button, input을 반환
// 이 파일에서 수행하는 모든 테스트는 렌더링과 button, input을 필요로 하므로 이를 하나의 함수로 묶어 두었다

// userEvent.type: 사용자가 타이핑하는 것을 흉내 내는 메서드 사용자가 키보드로 타이핑하는 것과 동일한 작동을 만들 수 있다
// userEvent는 @testing-library/react에서 제공하는 fireEnvet와 차이가 있다 기본적으로 userEvent는 fireEvent의 여러 이벤트를
// 순차적으로 실행해 좀 더 자세하게 사용자의 작동을 흉내낸다 userEvent는 사용자의 작동을 여러 fireEvent를 통해 좀 더 자세하게 흉내 내는
// 모듈이라고 볼 수 있다
// maxLength는 사용자가 하나씩 입력하는 경우에만 막히고 코드로 한 번에 입력하는 경우에는 작동하지 않는다
// fireEvent.type으로는 이 maxLength 작동을 확인할 수 없으므로 userEvent.type을 사용해야 한다
// 대부분의 이벤트를 테스트할 때는 fireEvent로 충분하고 훨씬 더 빠르다
// 특별히 사용자의 이벤트를 흉내 내야 할 때만 userEvent를 사용한다
// userEvent.click -> fireEvent 순서
// fireEvent.mouseOver
// fireEvent.mouseMove
// fireEvent.mouseDown
// fireEvent.mouseUp
// fireEvent.click

// jest.spyOn: Jest가 제공하는 spyOn은 어떠한 특정 메서드를 오렴시지키 않고 실행이 됐는지 또 어떤 인수로 실행됐는지 등 실행과 
// 관련된 정보만 얻고 싶을 때 사용 여기서는 (window, 'alert')라는 인수와 함께 사용도ㅒㅆ는데 이는 window 객체의 메서드 alert를
// 구현하지 않고 해당 메서드가 싱핼됐는지만 관찰하겠다는 뜻

// 예제
const calc = {
    add: (a, b) => a + b,
}

// spyOn으로 calc 객체의 add 메서드 관찰 
// spyOn으로 관찰한 덕분에 한번 호출됐는지(toBeCalledTimes(1))
// 원하는 인수와 함께 호출됐는지(toBeCalledWith(1, 2)) 확인할 수 있다
// spyOn으로 관찰은 했지만 calc.add의 작동 자체에는 영향을 미치지 않은 것을 확인할 수 있다
// 특정 객체의 메서드를 오염시키지 않고 단순히 관찰하는 용도로 사용할 수 있다
const spyFn = jest.spyOn(calc, 'add')
const result = calc.add(1, 2)

expect(spyFn).toBeCalledTimes(1)
expect(spyFn).toBeCalledWith(1, 2)
expect(result).toBe(3)

// mockImplementation: 해당 메서드에 대한 모킹(mocking) 구현을 도와준다 현재 Jest를 실행하는 Node.js 환경에서는 window.alert가 존재하지 않으므로 
// 해당 메서드를 모의 함수(mock)로 구현해야 하는데 이것이 mockImplementation의 역할
// 함수가 실행됐는지 등의 정보는 확인할 수 있도록 도와준다

// jest.spyOn(window, 'alert').mockImplementation(): Node.js에 존재하지 않는 window.alert을 테스트하기 위해 jest.spyOn을 사용해 window.alert
// 를 관찰하게끔 하고 mockImplementation을 통해 window.alert가 실행됐는지 등의 정보를 확인할 수 있도록 처리한것

// 정적 컴포넌트에 비해 테스트 코드가 복잡하지만 액션이 수행된 이후에 DOM에 기댓값이 반영됐는지 확인하는 방법은 동일
describe('InputComponent 테스트', () => {
    const setup = () => {
        const screen = render(<InputComponent />)
        const input = screen.getByLabelText('input') as HTMLInputElement
        const button = screen.getByText(/제출하기/i) as HTMLButtonElement

        return {
            input,
            button,
            ...screen
        }
    }

    it('input의 초깃값은 빈 문자열이다.', () => {
        const { input } = setup()
        
        expect(input.value).toEqual('')
    })

    it('input의 최대 길이가 20자로 설정돼 있다.', () => {
        const { input } = setup()

        expect(input).toHaveAttribute('maxlength', '20')
    })

    it('영문과 숫자만 입력된다.', () => {
        const { input } = setup()
        const inputValue = '안녕하세요123'

        userEvent.type(input, inputValue)
        expect(input.value).toEqual('123')
    })

    it('아이디를 입력하지 않으면 버튼이 활성화되지 않는다.', () => {
        const { button } = setup()

        expect(button).toBeDisabled()
    })

    it('아이디를 입력하면 버튼이 활성화된다.', () => {
        const { button, input } = setup()

        const inputValue = 'helloworld'
        userEvent.type(input, inputValue)

        expect(input.value).toEqual(inputValue)
        expect(button).toBeEnabled()
    })

    it('버튼을 클릭하면 alert가 해당 아이디로 표시된다.', () => {
        const alertMock = jest
            .spyOn(window, 'alert')
            .mockImplementation((_: string) => undefined)

        const { button, input } = setup()

        const inputValue = 'helloworld'
        userEvent.type(input, inputValue)
        fireEvent.click(button)

        expect(alertMock).toHaveBeenCalledTimes(1)
        expect(alertMock).toHaveBeenCalledWith(inputValue)
    })
})