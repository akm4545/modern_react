{
    // any 대신 unknown을 사용
    // any는 정말 불가피할 때만 사용해야 하는 타입
    // any 사용 시 타입스크립트가 제공하는 정적 타이핑의 이점을 모두 버림
    function doSomthing(callback: any){
        callback()
    }

    //타입스크립트에서 에러가 발생하지 않지만 런타임시 에러 발생
    doSomthing(1)

    // 아직 타입을 단정할 수 없는 경우 unkown을 사용
    // 모든 값을 하당 가능 (top type)
    // any와는 다르게 바로 사용 불가능
    function doSomthing2(callback: unknown){
        callback()
    }

    //사용하려면 타입 좁히기를 해야한다
    function doSomthing3(callback: unknown){
        if(typeof callback === 'function'){
            callback()
            return
        }

        throw new Error('callback은 함수여야 합니다.')
    }
}

{
    // unknown의 반대 never(bottom type) 
    // 어떠한 타입도 들어올 수 없다

    // string과 number 모두 만족하는 타입은 없으므로 never가 선언
    type what1 = string & number
    // 두번째 경우도 마찬가지
    type what2 = ('hello' | 'hi') & 'react'
}

{
    // never 리액트 사용 예시 
    // props는 없지만 state는 존재하는 상황에서 어떠한 props도 받아들이지 않는다는 뜻으로 사용

    // string이 키지만 값은 never 
    // 어떠한 값도 올 수 없다
    type Props = Record<string, never>
    type State = {
        counter: 0
    }

    // React.component<Props, State> 순으로 제네릭 작성
    // 어떠한 props도 받을 수 없다
    // state는 존재
    class SampleComponent extends React.component<Props, State>{
        constructor(props: Props){
            super(props)
            this.state = {
                counter: 0,
            }
        }

        render() {
            return <>
                // ...
            </>
        }
    }

    export default function App(){
        return (
            <>
                // ok
                <SampleComponent />
                // error
                <SampleComponent hello="world" />
            </>
        )
    }
}

{
    // 타입 가드를 적극 활용
    // 타입을 좁히는데 도움을 줌
    // 조건문과 함께 타입 가드를 사용 시 효과적을 ㅗ좁힐 수 있음
}

{
    // instanceof
    // 지정한 인스턴스가 특정 클래스의 인스턴스인지 확인할 수 있는 연산자

    // instanceof를 활용한 타입가드 예제
    class UnAuthorizedError extends Error{
        constructor(){
            super()
        }

        get message(){
            return '인증에 실패했습니다.'
        }
    }

    class UnExpectedError extends Error {
        constructor(){
            super()
        }

        get message(){
            return '예상치 못한 에러가 발생했습니다.'
        }
    }

    async function fetchSomething(){
        try{
            const response = await fetch('/api/something')

            return await response.json()
        }catch(e){
            // e는 unknown이다
            // 해당 타입 가드를 통해 각 에러에 따라 원하는 처리 내용을 추가할 수 있다

            // UnAuthorizedError를 위한 타입 가드 조건문
            if(e instanceof UnAuthorizedError){
                // do something...
            }

            // UnExoectedError을 위한 타입 가드 조건문
            if(e instanceof UnExpectedError){
                // do something...
            }

            throw e
        }
    }
}

{
    // typeof
    // 특정 요소에 대해 자료형을 확인
    function logging(value: string | undefined){
        if(typeof value === 'string'){
            console.log(value)
        }

        if(typeof value === 'undefined'){
            // nothing to do
            return
        }
    }
}