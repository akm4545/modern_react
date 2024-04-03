{
    // 바벨
    // 자바스크립트 최신 문법을 다양한 브라우저에서도 일관적으로 지원할 수 있도록 코드를 트랜스파일한다
}

{
    // 구조 분해 할당
    // 배열 또는 객체의 값을 분해해 개별 변수에 즉시 할당하는 것
}

{
    // 배열 구조 분해 할당
    const array = [1, 2, 3, 4, 5]   

    const [first, second, third, ...arrayRest] = array
    // first 1
    // second 2
    // third 3
    // arrayRest [4, 5]

    // 리액트의 useState 함수는 2개 짜리 배열을 반환하는 함수
    // 첫 번째 값으로 value 두 번째 값을 setter로 사용 가능

    // useState가 배열을 반환하는 이유
    // 객체 구조 분해 할당은 사용자 쪽에서 원하는 이름으로 변경하는 것이 번거로움
    // 배열 구조 분해 할당은 자유롭게 선언 가능

    // , 위치에 따른 사용법

    // 해당 방법은 실수를 유발할 가능성이 커서 배열의 길이가 작을 때 주로 쓰임
    const array2 = [1, 2, 3, 4, 5]
    const [first2, , , , fifth2] = array2 //2, 3, 4는 아무런 표현식이 없으므로 변수 할당 생략

    first2 //1
    fifth2 // 5

    // 기본값 선언 
    // 사용하고자 하는 배열의 길이가 짧거나 값이 없는 경우는 (undefined) 기본값을 사용
    const array3 = [1, 2]
    const [a = 10, b = 10, c = 10] = array3
    // a 1 
    // b 2
    // c 10

    // 주의점 undefined일 때만 기본값을 사용
    const [a2 = 1, b2= 1, c2 = 1, d2 = 1, e2 = 1] = [undefined, null, 0, '']
    a2 // 1 (명시적 undefined 지정) 
    b2 // null
    c2 // 0
    d2 // ''
    e2 // 1 (배열의 길이를 넘어서는 구조 분해 할당이므로 undefined로 평가)

    // 특정값 이후의 값을 다시금 배열로 선언하고 싶다면 전개 연산자 사용
    // 전개 연산자는 뒤쪽에서만 가능
    // 앞쪽이면 파악이 불가능해 사용하는 것은 불가능
    const array4 = [1, 2, 3, 4, 5]
    const [first4, ...rest] = array

    // first4 1
    // rest [2, 3, 4, 5]
}

{
    // 배열 구조 분해 할당 트랜스파일
    const array = [1, 2, 3, 4, 5]
    const [first, second, third, ...arrayRest] = array

    //트랜스파일된 결과
    var array = [1, 2, 3, 4, 5]
    var first = array[0],
        second = array[1],
        third = array[2],
        arrayRest = array.slice(3)       
}

{
    // 객체 구조 분해 할당
    // 객체에서 값을 꺼내온 뒤 할당
    // 객체 내부 이름으로 꺼내온다
    const object = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5
    }

    const {a, b, c, ...objectRest} = object
    // a 1
    // b 2 
    // c 3
    // objectRest = {d: 4, e: 5}

    // 새로운 이름으로 다시 할당 가능
    const object2 = {
        a: 1,
        b: 2,
    }

    const {a: first, b: second} = object
    // first 1
    // second 2

    // 기본값 할당도 가능
    const object3 = {
        a: 1,
        b: 1
    }

    const {a3 = 10, b3 = 10, c3 = 10} = object3
    // a3 1
    // b3 1
    // c3 10

    // 해당 방식은 리액트 컴포넌트인 props 에서 값을 바로 꺼내올 때 매우 자주 쓰는 방식
    function SampleComponent({a, b}){
        return a + b
    }

    SampleComponent({a: 3, b: 5}) //8

    // 단순히 값으로 꺼내오는 것뿐만 아니라 변수에 있는 값으로 꺼내오는 계산된 속성 이름 방식도 가능
    const key = 'a'
    const object4 = {
        a: 1,
        b: 1,
    }

    // :a 와 같은 변수 네이밍이 필요
    // 계산된 이름인 [key]로 값을 꺼내기만 했을 뿐 어느 변수명으로 할당해야 할지 알 수 없기 떄문
    const { [key]: a4 } = object4

    // a4 = 1

    // 전개 연산자를 사용하면 나머지 값을 모두 가져올 수 있다
    // 전개 연산자는 앞에 올 수 없다
    const object5 = {
        a: 1,
        b: 1,
        c: 1,
        d: 1,
        e: 1
    }

    const {a5, b5, ...rest} = object5
    // rest {c4: 1, d4: 1, e4: 1}
}

{
    // 객체 분해 할당 코드 트랜스파일

    //트랜스파일 전
    const object = {
        a: 1,
        b: 1,
        c: 1,
        d: 1,
        e: 1
    }

    const {a, b, ...rest} = object

    // 트랜스파일 결과
    // 번들링 크기가 상대적으로 커지기 때문에 개발 환경이 ES5를 고려해야 하고 객체 구조 분해 할당을 자주 쓰지 않는다면 꼭 써야 하는지 검토 필요
    // 외부 라이브러리 (lodash.omit, rambda.omit) 고려
    function _objectWithoutProperties(source, excluded){
        if(source == null) return {}

        var target = _objectWithoutPropertiesLoose(source, excluded)
        var key, i

        if(Object.getOwnPropertySymbols) {
            var sourceSymbolKeys = Object.getOwnPropertySymbols(source)

            for(i=0; i<sourceSymbolKeys.length; i++){
                key = sourceSymbolKeys[i]

                if(excluded.indexOf(key) >= 0) continue
                if(!Object.prototype.propertyIsEnumerable.call(source, key)) continue
                target[key] = source[key]
            }
        }

        return target
    }

    function _objectWithoutPropertiesLoose(source, excluded){
        if(source == null) return {}
        var target = {}
        var sourceKeys = Object.keys(source)
        var key, i

        for(i=0; i<sourceKeys.length; i++){
            key = sourceKeys[i];
            if(excluded.indexOf(key) >= 0) continue
            target[key] = source[key]
        }

        return target
    }

    var object = {
        a: 1,
        b: 1,
        c: 1,
        d: 1,
        e: 1
    }

    var a = object.a,
        b = object.b,
        rest = _objectWithoutProperties(object, ['a', 'b'])
}

{
    // 전개 구문
    // 순회할 수 있는 값에 대해 전개해 간결하게 사용할 수 있는 구문
    // 과거에는 배열 간에 합성을 하려면 push(), concat(), splice()등의 메서드를 사용해야 했음
    
    // 전개 구문을 사용한 합성
    const arr1 = ['a', 'b']
    const arr2 = [...arr1, 'c', 'd', 'e'] // ['a', 'b', 'c', 'd', 'e']
}

{
    // 전개 구문을 사용한 배열 복사
    const arr1 = ['a', 'b']
    const arr2 = arr1

    arr1 === arr2 //true 내용이 아닌 참조 복사

    const arr3 = ['a', 'b']
    const arr4 = [...arr3]

    arr3 === arr4 //false 값만 복사
}

{
    // 객체의 전개 구문
    const obj1 = {
        a: 1,
        b: 2
    }

    const obj2 = {
        c: 3,
        d: 4
    }

    const newObj = {...obj1, ...obj2}
    //{"a": 1, "b": 2, "c": 3, "d": 4}
}

{
    // 객체 전개 구문 순서에 따른 차이
    const obj = {
        a: 1,
        b: 1,
        c: 1,
        d: 1,
        e: 1,
    }

    // {a: 1, b:1, c: 10, d: 1, e: 1}
    const aObj = {
        ...obj,
        c: 10,
    }

    //{c: 1, a: 1, b: 1, d: 1, e: 1}
    const bObj = {
        c: 10,
        ...obj,
    }

    // 전개 구문이 앞에 = 할당한 값이 전개 구문 값을 덮어 씌움
    // 전개 구문이 뒤에 = 전개 구문이 해당 값을 덮어 씌움
}

{
    // 배열 전개 구문 트랜스파일
    // 트랜스파일 전
    const arr1 = ['a', 'b']
    const arr2 = [...arr1, 'c', 'd', 'e']

    // 트랜스파일 후
    var arr1 = ['a', 'b']
    var arr2 = [].concat(arr1, ['c', 'd', 'e'])
}

{
    // 객체 전개 구문 트랜스파일
    // 객체 구조 분해 할당과 마찬가지로 번들링이 커지기 때문에 주의 필요
    // 트랜스파일 전
    const obj1 = {
        a: 1,
        b: 2,
    }

    const obj2 = {
        c: 3,
        d: 4,
    }

    const newObj = {...obj1, ...obj2}

    // 트랜스파일 후
    function ownKeys(object, enumerableOnly){
        var keys = Object.keys(object)

        if(Object.getOwnPropertySymbols){
            var symbols = Object.getOwnPropertySymbols(object)

            enumerableOnly && 
                (symbols = symbols.filter(function (sym){
                    return Object.getOwnPropertyDescriptor(object, sym).enumerable
                })),
                keys.push.apply(keys, symbols)
        }

        return keys
    }

    function _objectSpread(target){
        for(var i=1; i<arguments.length; i++){
            var source = null != arguments[i] ? arguments[i] : {}
            i % 2
                ? ownKeys(Object[source], !0).forEach(function (key){
                    _defineProperty(target, key, source[key])
                })
                : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    target,
                    Object.getOwnPropertyDescriptors(source),
                )
                : ownKeys(Object(source)).forEach(function (key){
                    Object.defineProperty(
                        target,
                        key,
                        Object.getOwnPropertyDescriptor(source, key),
                    )
                })
        }

        return target
    }

    function _defineProperty(obj, key, value){
        if(key in obj){
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true,
            })
        }else{
            obj[key] = value
        }

        return ojb
    }

    var obj1 = {
        a: 1,
        b: 2,
    }

    var obj2 = {
        c: 3,
        d: 4,
    }

    var newObj = _objectSpread(_objectSpread({}, obj1), obj2)
}

{
    // 객체 초기자
    // 
}
