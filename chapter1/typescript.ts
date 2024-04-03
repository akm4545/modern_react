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
}