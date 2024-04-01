// 원시타입
// 객체가 아닌 다른 모든 타입

{
    // undefined 
    // 선언 후 값이 할당되지 않은 변수 또는 인수에 자동 할당
    // null과 undefined만이 하나의 값만 가지고 나머지는 두 개 이상(true, false)
    let foo

    typeof foo === 'undefined' //true

    function bar(hello){
        return hello
    }   

    typeof bar() === 'undefined' //true
}

{
    // null
    // 값이 없거나 비었을 때

    // typeof로 null 확인시 object 반환
    // 초창기 자바스크립트가 값을 표현하는 방식 때문에 발생한 문제
    typeof null === 'object' //true?
}

{
    // Boolean
    // true, false
    // truthy, falsy한 값이 존재

    if(1){
        //true
    }

    if(0){
        //false
    }

    if(NaN){
        //false
    }

    // 조건문 외에도 truthy와 falsy를 Boolean()을 통해 확인 가능
    Boolean(1) //true
    Boolean(0) //false
    Boolean(true) //true
}

{
    // Number
    // 자바스크립트는 모든 숫자를 하나의 타입에 저장
    const a = 1

    const maxInteger = Math.pow(2, 53)
    maxInteger - 1 === Number.MAX_SAFE_INTEGER //true

    const minInteger = -(Math.pow(2, 53) - 1)
    minInteger === Number.MIN_SAFE_INTEGER //true

    // 2진수, 8진수, 16진수 지원 X
    // 모두 10진수로 해석
    const 이진수_2 = 0b10 //2진수(binary) 2
    이진수_2 == 2 //true

    const 팔진수_8 = 0o10 //8진수(octal) 8
    팔진수_8 == 8 //true

    const 십육진수_16 = 0x10 // 16진수(hexadecimal) 16
    십육진수_16 == 16 //true
}

{
    //BigInt
    // number 자료형을 넘는 크기의 숫자
    9007199254740992 === 9007199254740993 //마지막 숫자가 다른데 true 더이상 다룰 수 없는 크기이기 떄문

    const maxInteger = Number.MAX_SAFE_INTEGER
    console.log(maxInteger + 5 === maxInteger + 6) //true ???

    // bigint형
    const bigInt1 = 9007199254740995n //끝에 n을 붙이거나
    const bigInt2 = BigInt('9007199254740995') //BigInt 함수를 사용

    const number = 9007199254740992
    const bigint = 9007199254740992n

    typeof number // number
    typeof bigint // bigint

    number == bigint //true
    number === bigint //false (엄격한 비교로 타입이 다르기 때문)
}

{
    //String 
    // '\n안녕하세요.\n'
    const longText = `
    안녕하세요.
    `

    //error
    //const longText= "
    //안녕하세요.
    //"

    // 문자열은 변경 불가능
    const foo = 'bar'

    console.log(foo[0]) //'b'

    foo[0] = 'a'

    console.log(foo) //bar
}

{
    // Symbol
    // ES6추가 
    // 중복되지 않는 고윳값 
    // 함수로만 생성 가능
    
    // 동일한 인수를 넘기더라도 같은 값으로 취급 x
    // 함수 내부에 넘겨주는 값은 Symbol 생성에 영향을 미치지 않는다(Symbol.for 제외)    
    const key = Symbol('key')
    const key2 = Symbol('key')

    key === key2 //false

    // 동일값을 위해선 for를 사용
    Symbol.for('hello') === Symbol.for('hello') //true
}

{
    //Object

    typeof [] === 'object' //true
    typeof {} === 'object' //true

    function hello(){}
    typeof hello === 'function' //true

    const hello1 = function(){

    }

    const hello2 = function(){

    }

    hello1 === hello2 //false
}

{
    let hello = 'hello world'
    let hi = hello

    console.log(hello === hi) //true

    hello = 'hello world'
    hi = 'hello world'

    console.log(hello === hi) //true

    //다음 객체는 완벽하게 동일한 내용
    var hello = {
        greet: 'hello, world',
    }

    var hi = {
        greet: 'hello, world'
    }

    // 객체는 참조를 저장하기 떄문
    console.log(hello === hi) //false
    console.log(hello.greet === hi.greet) //true

    var hello = {
        greet: 'hello, world',
    }

    // 같은 참조
    var hi = hello

    console.log(hi === hello) //true
}

{
    // 자바스크립트 비교 방법
    // Object.is 사용

    // == 연산자는 형변환 후 비교 Object.is는 ===와 동일하게 타입이 다르면 false

    // === 와의 차이점
    -0 === +0 //true
    Object.is(-0, +0) //false

    Number.NaN === NaN //false
    Object.is(Number.NaN, NaN) //true

    NaN === 0 / 0 //false
    Object.is(NaN, 0 / 0) //true

    // == 와 ===가 만족하지 못하는 몇 가지 특이 케이스를 보완
    // Object.is도 객체 비교는 차이가 없다
    Object.is({}, {}) //false

    const a = {
        hello: 'hi',
    }

    const b = a 

    Object.is(a, b) //true
    a === b //true
}

{
    // 리액트 동등비교 = Object.is
    // 이를 구현한 폴리필을 함께 사용

    // flow로 구현돼 있어 any가 추가 flow에서 any는 타입스크립트와 동일하게 어떤 값도 허용
    function is(x: any, y:any){
        return (
            (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y) //eslint-disable-line no-self-compare
        )
    }

    // 런타임에 Object.is가 있다면 그것을 사용하고 아니라면 위 함수 사용
    // Object.is는 인터넷 익스플로러 등에 존재하지 않기 때문에 폴리필을 넣어준 것으로 보임
    const objetIs: (x: any, y: any) => boolean = 
        typeof Object.is === 'function' ? Object.is : is

    export default objectIs

    // 리액트는 objectIs를 기반으로 동등 비교를 하는 shallowEqual이라는 함수를 만들어 사용
    // shallowEqual은 의존성 비교 등 리액트의 동등 비교가 필요한 다양한 곳에서 사용
    import is from './objectIs'

    // 다음 코드는 Object.prototype.hasOwnProperty다
    // 이는 객체에 특정 프로퍼티가 있는지 확인하는 메서드다
    import hasOwnProperty from './hasOwnProperty'

    /**
     * 주어진 객체의 키를 순회하면서 두 값이 엄격한 동등성을 가지는지를 확인하고
     * 다른 값이 있다면 false를 반환한다. 만약 두 객체 간에 모든 키의 값이 동일하다면
     * true를 반환한다.
     */
    // 단순히 Object.is를 수행하는 것뿐만 아니라 객체 간의 비교도 추가돼 있다
    function shallowEqual(objA: mixed, objB: mixed): boolean {
        if(is(objA, objB)){
            return true
        }

        if(
            typeof objA !== 'object' ||
            objA === null ||
            typeof objB !== 'object' ||
            objB === null
        ){
            return false
        }

        // 각 키 배열을 꺼낸다
        const keysA = Object.keys(objA)
        const keysB = Object.keys(objB)

        // 배열의 길이가 다르면 false
        if(keysA.length !== keysB.length){
            return false
        }

        // A의 키를 기준으로 B에 같은키가 있는지 값이 같은지 확인
        for(let i=0; i<keysA.length; i++){
            const currentKey = keysA[i]

            if(
                !hasOwnProperty.call(objB, currentKey) ||
                !is(objA[currentKey], objB[currentKey])
            ){
                return false
            }
        }

        return true
    }

    export default shallowEqual

    // Object.is로 먼저 비교 수행 후 수행하지 못하는 비교는 객체 간 얕은 비교를 한 번 더 수행한다

    // Object.is = 참조가 다른 객체 비교 불가능
    Object.is({hello: 'world'}, {hello: 'world'}) //false

    // 리액트 팀에서 구현한 shallowEqual은 객체의 1 depth 까지는 비교가 가능
    shallowEqual({hello: 'world'}, {hello: 'world'}) //true

    // 그러나 2 depth까지 가면 이를 비교할 방법이 없음
    shallowEqual({hello: {hi: 'world'}}, {hello: {hi: 'world'}}) //false

    // 얕은 비교까지만 필요한 이유는 JSX props는 객체이고 여기에 있는 props만 일차적으로 비교하면 되기 떄문
    type Props = {
        hello: string
    }

    function HelloComponent(props: Props){
        return <h1>{props.hello}</h1>
    }

    // ...
    function App(){
        return <HelloComponent hello="hi!"/>
    }
}

{
    import {memo, useEffect, useState} from 'react';

    type Props = {
        counter: number
    }

    const Component = memo((props: Props) => {
        useEffect(() => {
            console.log('Component has been rendered!')
        })

        return <h1>{props.counter}</h1>
    }) 

    type DeeperProps = {
        counter: {
            counter: number
        }
    }

    // props 의 depth가 깊어지는 경우 실제로 변경된 값이 없음에도 불하고 메모이제이션된 컴포넌트 반환 불가
    const DeeperComponent = memo((props: DeeperProps) => {
        useEffect(() => {
            console.log('DeeperComponent has been rendered!')
        })

        return <h1>{props.counter.counter}</h1>
    })

    export default function App(){
        const [, setCounter] = useState(0)

        function handleClick(){
            setCounter((prev) => prev + 1)
        }

        return (
            <div className="App">
                {/* 리렌더링 방지 가능 */}
                <Component counter={100} />
                {/* 리렌더링 방지 불가 */}
                <DeeperComponent counter={{counter: 100}} />
                <button onClick={handleClick}>+</button>
            </div>
        )
    }
}






