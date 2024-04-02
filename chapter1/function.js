{
    function sum(a, b){
        return a + b
    }

    sum(10, 24) // 34

    // 리액트 컴포넌트 반환 함수
    // 일반적으로 props라는 단일 객체를 받고 return 문으로 JSX 반환
    function Component(props){
        return <div>{props.hello}</div>
    }
}

{
    // 함수 선언문 종류
    function add(a, b){
        return a + b
    }

    // 자바스크립트 엔진이 코드의 문맥에 따라 동일한 함수를 문이 아닌 표현식으로 해석하는 경우가 있기 떄문에 가능
    // 아래와 같이 이름을 가진 형태의 함수 리터럴은 코드 문맥에 따라 전자와 같은 선언문으로도 후자와 같은 표현식으로도 사용될 수 있다
    const sum = function sum(a, b){
        return a + b
    }

    sum(10, 24) // 34
}

{
    // 함수 표현식 종류

    // 일급 객체 = 다른 객체들에 일반적으로 적용 가능한 연산을 모두 지원하는 객체
    // 자바스크립트에서는 함수는 일급 객체
    // 함수는 다른 함수의 매개변수가 될 수도 있고 반환값이 될 수도 있으며 앞에서 본 것처럼 할당도 가능하므로 일급 객체의 조건을 갖추고 있다

    // 함수를 변수에 할당 가능
    const sum = function (a, b){
        return a + b
    }

    sum(10, 24) //34
}

{
    // 함수 표현식에서는 할당하려는 함수의 이름을 생략하는 것이 일반적이다 (코드 혼란을 방지하기 위함)
    const sum = function add(a, b){
        // 함수 몸통에서 현재 실행 중인 함수를 참조하는 데 사용할 수 있다
        // 이는 단순히 코드에 대한 이해를 돕기 위한 예제 코드고 
        // 실제 프로덕션 코드에서는 절대로 사용해서는 안 된다

        console.log(arguments.callee.name)

        return a + b
    }

    sum(10 ,24)
    // add
    add(10, 24) //error

    // 함수 호출로 sum을 사용 add는 함수 내부에서만 유효한 식별자 외부에서 호출할때 사용 불가
    // 함수 표현식에 함수에 이름을 주는 것은 함수 호출에 도움이 전혀 안되는 코드를 읽는데 방해가 될 수 있는 요소
}

{
    // 호이스팅으로 인해 함수가 메모리에 등록되고 어느 위치에서 호출해도 작동

    hello() //hello

    function hello() {
        console.log('hello')
    }

    hello() //hello
}

{
    // 변수도 호이스팅이 되지만 undefined로 초기화
    // 할당문이 실행되는 시점 즉 런타인 시점에서 할당되어 작동
    console.log(typeof hello === 'undefined') //true

    hello() //error

    var hello = function() {
        console.log('hello')
    }

    hello()
}

{
    // Function 생성자
    // add 함수 예제
    // 함수의 클로저 생성 X
    // eval 만큼이나 실제 코딩에서 사용하지 않음
    const add = new Function('a', 'b', 'return a + b')

    add(10, 24) // 34 
}

{
    // 화살표 함수
    const add = (a, b) => {
        return a + b
    }

    const add1 = (a, b) => a + b

    // 생성자 사용 불가
    const Car = (name) => {
        this.name = name
    }

    //error
    const myCar = new Car('하이')

    // 화살표 함수에는 arguments 존재 x
    function hello() {
        conconle.log(arguments)
    }

    // Argument(3) [1, 2, 3, callee: f, Symbol(Symbol.iterator): f] 
    hello(1, 2, 3)

    const hi = () => {
        console.log(arguments)
    }

    //error
    hi(1, 2, 3)

    //this 바인딩의 차이도 존재
    // 컴포넌트에서 이벤트 바인딩 함수도 이에 따라 차이가 존재
    // 함수가 어떻게 호출되느냐에 따라 this의 값 변경
    // 일반 함수로 호출 시 this는 전역 객체를 가리킴
    // 화살표 함수 this는 상위 this를 따름
}

{
    // this 바인딩 예제
    class Component extends React.Component {
        constructor(props){
            super(props)
            this.state = {
                counter: 1,
            }
        }
    }

    functionCountUp(){
        console.log(this) //undefined
        this.setState((prev) => ({counter: prev.counter + 1}))
    }

    ArrowFunctionCountUp = () => {
        console.log(this) // class Component
        this.setState((prev) => ({counter: prev.counter + 1}))
    }

    render(){
        return (
            <div>
                {/* Cannot read properties ... 'setState' */}
                <button onClick={this.functionCountUp}>일반 함수</button>
                {/* 정상작동 */}
                {/* 별도의 작업을 추가로 하지 않고 this에 접근 가능 */}
                <button onClick={this.ArrowFunctionCountUp}>화살표 함수</button>
            </div>
        )
    }
}

{
    // 바벨 트랜스파일링의 함수 차이
    // 트랜스파일 전
    const hello = () => {
        console.log(this)
    }

    function hi(){
        console.log(this)
    }

    //트랜스파일된 결과: 바벨 변경
    var _this = void 0

    var hello = function hello(){
        // 바벨에서는 화살표 함수 내부의 _this 자체를 undefined로 바꿔버린다
        console.log(_this)
    }

    function hi(){
        console.log(this)
    }

    // 화살표 함수는 this 선언 시점에 이미 상위 스코프로 결정
    // _this를 받아서 사용
    // 일반 함수는 런타임 시점에 결정되는 this 사용
    // 화살표 함수를 단순히 일반 함수의 축약형이라고 보기엔 무리가 있음
}

{
    // 즉시 실행 함수 (IIFE)
    // 함수를 정의하고 그 순간 즉시 실행
    // 단 한번 실행하고 호출 불가
    // 글로벌 스코프를 오염시키지 않는 독립적인 함수 스코프 운영 가능
    // 선언과 실행이 동시에 일어나므로 내부의 값은 함수 내부가 아니면 접근 불가
    // 리펙터링에도 도움 (선언만으로 실행이 거기서 끝나는 것을 각인시킬 수 있기 떄문)
    (function (a, b){
        return a + b
    })(10, 24); //34

    ((a, b) => {
        return a + b
      }
    )(10, 24) //34
}

{
    // 고차 함수
    // 함수를 인수로 받거나 결과로 새로운 함수 반환

    // Array.prototype.map
    const doubledArray = [1, 2, 3].map((item) => item + 2)

    doubledArray // [2, 4, 6]

    // 함수를 반환하는 고차 함수의 예
    // 컴포넌트를 인수로 받아 함수 컴포넌트를 반환하는 고차 함수 생성 가능
    // 이를 고차 컴포넌트라 부름
    // 고차 함수 컴포넌트 작성 시 내부에서 공통으로 관리되는 로직을 분리해 관리할 수 있어 효과적인 리펙터링이 가능
    const add = function (a){
        // a가 존재하는 클로저를 생성
        return function(b){
            // b를 인수로 받아 두 합을 반환하는 또 다른 함수를 생성
            return a + b
        }
    }

    add(1)(3) //4
}

{
    // 함수 작성 시 주의사항
    // 1. 함수의 부수 효과를 최대한 억제
    // 함수 내의 작동으로 인해 함수가 아닌 함수 외부에 영향을 끼치는 것 = 함수의 부수 효과 (side-effect)
    // 순수 함수 = 함수의 부수 효과가 없고 언제 어디서나 동일한 인수를 받으면 동일한 결과 반환 외부에 어떤 영향도 미치지 않음

    // 순수 컴포넌트 예
    function PureComponent(props){
        const {a, b} = props
        return <div>{a + b}</div>
    }

    // 부수효과는 피할 수 없지만 최대학 억제하는 방향으로 설계
    // 리액트의 관점에서 본다면 부수 효과를 처리하는 훅인 useEffect의 작동을 최소화하는것이 그 일환
    // useEffect를 최소한으로 줄임으로써 함수의 역할을 좁히고 버그를 줄이며 컴포넌트 안정성을 높임
}

{
    // 2. 가능한 한 함수를 작게 만들어라
    // ESLint에는 max-lines-per-function이라는 규칙이 존재
    // 함수가 50줄이 넘어가면 과도하게 커진 함수로 분류하고 경고 메세지 출력 = 코드가 길어질수록 코드 냄새(문제를 일으킬 여지가 있는 코드)가 날 확률이 커짐
    // 내부에서 무슨 일이 일어나는지 추적하기 어려움
    // 그 외에도 중첩, 콜백이 얼마나 많은지도 확인 가능
    // 함수는 하나의 일을 해야함
}

{
    // 3. 누구나 이해할 수 있는 이름을 붙여라
    // 가능한 간결하고 이해하기 쉽게 붙여라
    // Terser가 설치돼 있다면 한글로 네이밍 하는것도 좋은 방법이다
    // Terser는 자바스크립트 코드를 맹글링 (코드를 컴파일러가 이해할 수 있는 수준에서 단순화) 및 압축 도구
    // 실제 서비스 코드에는 영향을 미치지 않는다

    // uesEffect나 useCallback등의 훅에 넘겨주는 콜백 함수에 네이밍을 붙여주면 가독성에 도움이 됨
    // useEffect의 콜백 함수에 이름을 붙여도 apiRequest()로 접근은 불가능하지만 이름으로 유추해 코드를 보는데 도움
    useEffect(function apiRequest(){
        // ...
    }, [])  
}