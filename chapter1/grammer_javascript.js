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
