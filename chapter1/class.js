{
    // 클래스 예제
    // Car 클래스 선언
    class Car{
        // constructor는 생성자 
        // 최초 생성시 어떤 인수를 받을지 결정하고 객체를 초기화한다
        constructor(name){
            this.name = name
        }

        // 메서드
        honk(){
            console.log(`${this.name}이 경적을 울립니다!`)
        }

        // 정적 메서드
        static hello(){
            console.log('저는 자동차 입니다')
        }

        // setter
        set age(value){
            this.carAge = value
        }

        // getter
        get age(){
            return this.carAge
        }
    }

    // Car 클래스로 car 객체 생성
    const myCar = new Car('자동차')

    // 메서드 호출
    myCar.honk()

    // 정적 메서드는 클래스에서 직접 호출
    Car.hello()

    // 정적 메서드는 객체에서는 호출 불가
    //error
    myCar.hello()

    // setter로 값 할당
    myCar.age = 32

    // getter로 값 가져오기
    console.log(myCar.age, myCar.name) //32 자동차
}