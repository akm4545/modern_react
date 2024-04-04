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

{
    // in 
    // 어떤 객체에 키가 존재하는지 확인 용도
    // 타입에 여러가지 객체가 있을 경우 유용
    interface Student {
        age: number
        score: number
    }

    interface Teacher {
        name: string
    }

    function doSchool(person: Student | Teacher) {
        if('age' in person){
            person.age // person = Student
            person.score
        }

        if('name' in person){
            person.name // person = Teacher
        }
    }
}

{
    // 제네리
    // 함수나 클래스 내부에서 단일 타입이 아닌 다양한 타입에 대응할 수 있도록 도와줌
    // 제네릭을 사용하면 타입만 다른 비슷한 작업을 하는 컴포넌트를 단일 제네릭 컴포넌트로 선언해 간결하게 작성 가능

    // 하나의 타입으로 이루어진 배열의 첫 번째와 마지막 요소를 반환하는 함수 예제
    // 다양한 타입에 대응하기 위해 any나 unknown을 사용
    function getFirstAndLast(list: unknown[]){
        return [list[0], list[list.length - 1]]
    }

    const [first, last] = getFirstAndLast([1, 2, 3, 4, 5])

    // 결과물도 unknown
    first // unknown
    last // unknown

    // 제네릭 사용 시 
    // 제네릭 사용으로 다양한 타입을 하나의 함수로 처리
    //       함수명           <제네릭>(인수: 제네릭): 리턴타입 제네릭 { ...}
    function getFirstAndLast2<T>(list: T[]): [T, T] {
        return [list[0], list[list.length - 1]]
    }

    const [first2, last2] = getFirstAndLast2([1, 2, 3, 4, 5])

    first2 // number
    last2 // number

    const [first3, last3] = getFirstAndLast2(['a', 'b', 'c', 'd', 'e'])

    first3 // string
    last3 // string
}

{
    // 리액트 제네릭 예시 (useState)
    function Component(){
        // state: string
        // 제네릭 사용으로 state 사용과 기본값 선언을 좀 더 명확하게 함
        // useState의 경우 기본값을 넘기지 않고 사용하는 경우가 많은데 이 경우 값을 undefined로 추론
        const [state, setState] = useState<string>('')
        //...
    }
}

{
    // 다중 제네릭 사용
    // T, U 등으로 표현시 의미가 명확하지 않으므로 적절한 네이밍 추천
    function multipleGeneric<First, Last>(a1: First, a2: Last): [First, Last] {
        return [a1, a2]
    }

    const [a, b] = multipleGeneric<string, boolean>('true', true)

    a //string
    b //boolean
}

{
    // 인덱스 시그니처
    // 객체의 키를 정의하는 방식
    // 동적인 객체 정의시 유용
    // 키의 범위가 넓으면 undefined를 반환할 수도 있음
    // 객체의 키가 동적으로 선언되는 경우를 최대한 지양해야함
    // 객체의 타입도 필요에 따라 좁혀야 한다

    type Hello = {
        // 인덱스 시그니처
        [key: string]: string
    }

    const hello: Hello = {
        hello: 'hello',
        hi: 'hi',
    }

    hello['hi'] //hi
    hello['안녕'] //undefined
}

{
    // 인덱스 시크니처 타입 좁히기 예제
    // record를 사용
    // Record<키, 값> = 객체의 타입에 각각 원하는 키와 값을 넣을 수 있다

    type Hello = Record<'hello' | 'hi', string>

    const hello: Hello = {
        hello: 'hello',
        hi: 'hi'
    }

    // 타입을 사용한 인덱스 시그니처
    // 객체의 키가 hello, hi 둘 중 하나여야 하며 값의 타입은 string인 객체
    type Hello2 = {[key in 'hello' | 'hi']: string}

    const hello2: Hello2 = {
        hello: 'hello',
        hi: 'hi'
    }

    // 인덱스 시그니처 사용시 에러
    Object.keys(hello).map((key) => {
        //error
        const value = hello[key]
        return value
    })

    // string[]
    // key의 타입이 hello, hi라서 string으로 접근 불가
    const result = Object.keys(hello);

    // Object.keys(hello)를 as로 타입을 단언하는 방법
    (Object.keys(hello) as Array<keyof Hello>).map((key) => {
        const value = hello[key]
        return value
    })

    // 타입 가드 함수를 만드는 방법
    // 객체를 인수로 전달하면 키값을 뽑아 만든 배열에 타입을 as 키워드로 단언
    function keysOf<T extends Object>(obj: T): Array<keyof T>{
        return Array.from(Object.keys(obj)) as Array<keyof T>
    }

    keysOf(hello).map((key) => {
        const value = hello[key]
        return value
    })

    // 가져온 key를 단언하는 방법
    // [] 안에서 뽑은 key의 타입을 Hello의 키 타입과 일치시킨다
    Object.keys(hello).map((key) => {
        const value = hello[key as keyof Hello]
        return value
    })
}

{
    // stirng[]으로 반환하는 이유 
    // 덕 타이핑(구조적 타이핑) 때문
    // 타입스크립트는 모든 키가 들어올 수 있는 가능성이 열려 있는 객체의 키에 포괄적으로 대응하기 위해 stirng[]으로 타입 제공
    type Car = {name: string}
    type Truck = Car & {power: number}

    function horn(car: Car){
        console.log(`${car.name}이 경적을 울립니다! 빵빵`)
    }

    const truck: Truck = {
        name: '비싼차',
        power: 100,
    }

    // 정상 작동
    // Car에 필요한 속성은 다 가지고 있기 떄문에 Car처럼 name을 가지고 있으므로 유효하다
    horn(truck)
}

{
    // 타입 스크립트 전환 가이드
    //tsconfig.json 먼저 작성하기
    
    // {
    //     "compilerOptions": {
    //         .ts나 .js가 만들어진 결과를 넣어두는 폴더 tsc는 타입스크립트를 자바스크립트로 변환하는 명령
    //         해당 명령어 사용시 outDir로 결과물이 넘어간다 
    //         "outDir": "./dist",
    //         .js파일을 허용할 것인지 여부
    //         "allowJs": true,
    //         결과물이 될 자바스크립트 버전 지정
    //         "target": "es5"
    //     },
    //     트랜스파일할 자바스크립트와 타입스크립트 파일 지정
    //     "include": ["./src/**/*"]
    // }
}

{
    // JsDoc과 @ts-check를 활용해 점진적으로 전환하기
    // 파일 최상단에 //@ts-check 선언 
    // JSDoc을 활용해 변수나 함수에 타입 제공 = 타입스크립트 컴파일러가 자바스크립트 파일의 타입을 확인
    // 손이 많이 가기 때문에 기존 프로젝트에서 JSDoc을 사용하거나 타입스크립트 전환이 어려울 때만 추천

    // @ts-check
    / **
      * @type {string}
      */
    const str = true

    / **
      * @param {number} a
      * @param {number} b
      * @return {number}
      */
    function sum(a, b){
        return a + b
    }

    / **
      * Function lacks ending return statement and return type does not include 'undefined'
      * @return {JSX.Element}
      */
    export function SampleComponent(){
        // Argument of type 'string' is not assignable to parameter of type 'number' .ts
        const result1 = sum(a, b)
        // Argument of type 'string' is not assignable to parameter of type 'number' .ts
        const result2 = sum(10, str)

        if(result1 && result2){
            return (
                <>
                    {result1}{result2}
                </>
            )
        }
    }   
}

{
    // 타입 기반 라이브러리 사용을 위해 @types 모듈 설치
    // 자바스크립트 기반으로 작성된 라이브러리를 설치해서 사용하고 있다면 @types라 불리는 DefinitelyTyped 설치
    // 타입스크립트로 작성되지 않은 코드에 대한 타입을 제공하는 라이브러리
    // 리액트를 타입스크립트에서 사용하기 위해서도 설치해야함
    // 파일을 .ts로 전환 시 import에 Cannot find module 'loadash' or its corresponding type declarations라는 오류 메세지가 출력된다면 라이브러리를 설치해야 함
}

{
    // 파일 단위로 조금씩 전환
    // 상수나 유틸과 같은 별도 의존성을 가지지 않은 파일 수정
    // 상수의 경우 string, number와 같이 원시값 대신 가능한 한 타입을 좁힘
    // js-to-ts-converter와 같은 전환 도구 라이브러리의 사용은 비추천 = 코드 이해도
    
}


