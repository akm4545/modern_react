{
    // 클로저
    // 함수와 함수가 선언된 어휘적 환경의 조합

    // 어휘적 환경 예제 코드
    // 어휘적 환경 = 변수가 코드 내부에서 어디서 선언됐는지 (변수 유효범위)
    // 코드가 작성된 순간에 정적으로 결정
    // 클로저는 이러한 어휘적 환경을 조합해 코딩하는 기법
    function add(){
        const a = 10
        function innerAdd(){
            const b = 20
            console.log(a + b)
        }
        innerAdd() //30
    }

    add()
}

{
    // 전역 스코프
    // 전역 레벨에 선언하는것
    // 어디서든 호출 가능
    // 브라우저 환경에서 전역 객체는 window이며 전역 레벨에서 선언한 스코프가 바인딩
    var global = 'global scope'

    function hello(){
        console.log(global)
    }

    console.log(global) // global scope
    hello() //global scope
    console.log(global === window.global) //true
}

{
    // 함수 스코프
    // 자바스크립트는 기본적으로 함수 레벨 스코프를 따른다
    // 즉 {} 블록이 스코프 범위를 결정하지 않는다
    if(true){
        var global = 'global scope'
    }

    // {} 블록 밖에서도 접근 가능
    console.log(global) // global scope
    console.log(global === window.global) // true

    function hello() {
        var local = 'local variable'
        console.log(local) //local variable
    }

    // 단순 if 블록과 다르게 함수 블록 내부에서는 일반적인 예측과 같이 스코프 결정
    hello()
    console.log(local) //error

    // 중첩일 경우 일단 가까운 스코프에서 변수가 존재하는지를 먼저 확인
    var x = 10

    function foo(){
        var x = 100
        console.log(x) // 100

        function bar(){
            var x = 1000
            console.log(x) // 1000
        }

        bar()
    }

    console.log(x) // 10
    foo()
}

{
    // 함수와 함수가 선언된 어휘적 환경의 조합 = 함수 레벨 스코프를 활용해 어떤 작업을 할 수 있는 개념
    function outerFunction(){
        var x = 'hello'

        function innerFunction(){
            console.log(x)
        }

        return innerFunction
    }

    const innerFunction = outerFunction()
    // x 변수가 존재하지 않지만 해당 함수가 선언된 어휘적 환경
    // 즉 outerFunction에는 x변수가 존재하며 접근도 가능
    // 따라서 같은 환경에서 선언되고 반환된 innerFunction에서는 x라는 변수가 존재하던 환경을 기억
    innerFunction() //hello
}

{
    
}