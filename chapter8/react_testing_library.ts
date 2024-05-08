{
    // 백엔드 테스트
    // 서버나 데이터베이스에서 원하는 데이터를 올바르게 가져올 수 있는지
    // 데이터 수정 간 교착 상태나 경쟁 상태가 발생하지 않는지
    // 데이터 손실은 없는지
    // 특정 상황에서 장애 발생 여부를 확인하는 과정이 주를 이룸
    // 일반적으로 화이트박스 테스트로 작성한 코드가 의도대도 작동하는지 확인해야 하며 이는 GUI가 아닌 AUI에서 주로 수행
    // 어느정도 백엔드에 대한 이해가 있는 사람만 가능

    // 프론트엔드 테스트
    // 일반적인 사용자와 동일하게 유사한 환경에서 수행
    // 사용자가 프로그램에서 수행할 주요 비즈니스 로직이나 모든 경우의 수를 고려 
    // 과정에서 사용잔ㄴ 굳이 프론트엔드 코드를 알 필요는 없다
    // 블랙박스 형태로 테스트가 이뤄지며 의도대로 작동하는지를 확인하는데 초점

    // 프론트엔드 개발은 디자인 요소뿐만 아니라 사용자의 인터랙션, 의도치 않은 작동 등 브라우저에서 발생할 수 있는 다양한
    // 시나리오를 고려해야 하기 때문에 일반적으로 테스팅하기가 매우 번거롭고 손이 많이 가는 작업
}

{
    // React Testing Library
    // DOM Testing Library를 기반으로 만들어진 테스팅 라이브러리
    // 리액트를 기반으로 한 테스트를 수행하기 위해 만들어짐

    // DOM Testing Library
    // jsdom을 기반으로 하고 있다
    // jsdom 
    // 순수하게 자바스크립트로 작성된 라이브러리
    // HTML이 없는 자바스크립트만 존재하는 환경 (Node.js) 같은 환경에서 HTML과 DOM을 사용할 수 있도록 해주는 라이브러리
    // jsdom을 사용하면 자바스크립트 환경에서도 HTML을 사용할 수 있으므로 이를 기반으로 DOM Testing Library에서 제공하는 API를 사용해
    // 테스트 수행 가능

    // jsdom을 사용해 DOM 조작
    // HTML이 있는것처럼 DOM을 불러오고 조작 가능
    const jsdom = require('jsdom')

    const { JSDOM } = jsdom
    const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</P>`)

    console.log(dom.window.document.querySelector('p').textContent) // "Hello world"

    // DOM Testing Library를 활용한 React Testing Library를 사용하여 실제 컴포넌트를 렌더링하지 않고도 원하는 대로 렌더링되고 있는지 확인 가능
    // 굳이 테스트 환경을 구축하는 데 복잡한 과정을 거치지 않아 간편하고 테스트 소요 시간도 단축시킬 수 있다
    // 컴포넌트뿐만 아니라 Provider, 훅 등 리액트를 구성하는 다양한 요소들을 테스트 가능
}

{
    // 인수 두 개의 합을 더하는 함수
    function sum(a, b){
        return a + b
    }

    // 함수에 대한 테스트 코드 작성

    // 테스트1
    // 함수를 실행했을 때의 실제 결과
    let actual = sum(1, 2)
    // 함수 실행 시 기대 결과값
    let expected = 3

    if(expected !== actual){
        throw new Error(`${expected} is not equal to ${actual}`)
    }

    // 테스트 2
    actual = sum(2, 2)
    expected = 4

    if(expected !== actual){
        throw new Error(`${expected} is not equal to ${actual}`)
    }
}

{
    // 기본적인 테스트 코드 작성 과정
    // 1. 테스트할 함수나 모듈 선정
    // 2. 함수나 모듈이 반환하길 기대하는 값을 적는다
    // 3. 함수나 모듈의 실제 반환 값을 적는다
    // 4. 3번의 기대에 따라 2번의 결과가 일치하는지 확인
    // 5. 기대하는 결과를 반환한다면 테스트 성공, 실패시 에러

    // 가장 먼저 필요한 것이 5번을 대신해주는 라이브러리이며 이는 Node.js가 assert라는 모듈로 기본 제공한다
    // 테스트 코드가 예상대로 작동한다고 주장하는 코드를 작성하면 이 코드의 성공 여부에 따라 테스트 통과 또는 실패를 반환

    // Node.js의 assert
    const assert = require('assert')

    function sum(a, b){
        return a + b
    }

    assert.equal(sum(1, 2), 3)
    assert.equal(sum(2, 2), 4)
    // 테스트 코드 실패시 assert.equal 내부에서 예외 발생
    assert.equal(sum(1, 2), 4) // AssertionError [ERR_ASSERTION] [ERR_ASSERTION]: 3 == 4

    // 테스트 결과를 확인할 수 있도록 도와주는 라이브러리를 어설션(assertion) 라이브러리라 한다
    // Node.js가 제공하는 assert 외에도 should.js, expect.js, chai 등 다양
    // 어설션 라이브러리는 단순히 동등 비교 qeual 외에도 객체 자체가 동일한지 비교하는 deepEqual, 같지 않은지 비교하는 notEqual, 
    // 에러를 던지는지 여부를 확인하는 throws등 다양한 메서드 제공
}

{
    // 테스트 코드는 가능한 한 사람이 읽기 쉽게, 테스트의 목적이 분명하게 작성되는 것이 중요
    // 앞서 작성한 테스트 코드는 목적은 달성했나 CI 환경에서 자동으로 실행되게 만들었다고 가정 시 
    // 테스트 코드가 정상 작동하고 테스트는 통과하겠지만 무엇을 어떻게 수행했는지에 대한 정보는 알 수 없다
    // 좋은 테스트 코드는 작성되고 통과뿐만이 아니라 어떤 테스트가 무엇을 테스트하는지 일목요연하게 보여주는것도 중요하다
}

{
    // 이러한 기능을 제공하는 것이 테스팅 프레임워크다 
    // 어설션을 기반으로 테스트를 수행하며 테스트 코드 작성자에게 도움이 될 만한 정보를 알려주는 역할도 함께 수행
    // 자바스크립트에서 유명한 테스팅 프레임워크로는 Jest, Mocha, Karma, Jasmine등이 있다
    // 리액트 진영에서는 리액트와 마찬가지로 메타에서 작성한 오픈소스 라이브러리 Jest가 널리 쓰이고 있다
    // Jest의 경우 자체적으로 제작한 expect 패키지를 사용해 어설션을 수행

    // 테스트 코드를 Jest로 작성 
    // 테스트할 코드 
    // math.js
    function sum(a, b){
        return a + b 
    }

    module.exports = {
        sum,
    }

    // 테스트 코드
    // math.test.js
    const { sum } = require('./math')

    test('두 인수가 덧셈이 되어야 한다.', () => {
        expect(sum(1, 2)).toBe(3)
    })

    test('두 인수가 덧셈이 되어야 한다.', () => {
        expect(sum(2, 2)).toBe(3) // 에러
    })

    // npm run test 명령어로 실행하면 
    // 다양한 정보가 콘솔에 출력된다
    // 테스트 프레임워크를 사용하면 무엇을 테스트했는지, 소요된 시간은 어느 정도인지, 무엇이 성공하고 실패했는지
    // 전체 결과는 어떤지에 대한 자세한 정보를 확인할 수 있다

    // test, expect등의 메서드를 import나 require 같은 모듈을 불러오기 위해 사용하는 구문 없이 바로 사용 가능하다
    // node가 아닌 jest(npm run test)로 싱행했다 
    // 해당 코드를 jest가 아닌 node로 바로 실행했다면 에러가 발생했을 것이다
    // 그 이유는 test와 expect 모두 Node.js 환경의 global 즉 전역 스코프에 존재하지 않는 메서드이기 때문이다
    // Jest를 비롯한 테스팅 프레임워크에는 이른바 글로벌(global)이라 해서 실행 시에 전역 스코프에 기본적으로 넣어주는 값들이 있다
    // Jest는 이 값을 실제 테스트 직전에 미리 전역 스코프에 넣어준다
    // import { expect, jest, test } from '@jest/globals' 구문으로 import 하면 node로 실행하여 테스트도 가능하지만 
    // 작성을 번거롭게 하여 선호되지 않는다
}

{
    
}