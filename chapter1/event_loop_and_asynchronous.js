{
    // 비동기 예시
    console.log(1)

    setTimeout(() => {
        console.log(2)
    }, 0)

    setTimeout(() => {
        console.log(1)
    }, 100)

    console.log(4)
}

{
    // 이벤트 루프
    // 자바스크립트 런타임 외부에서 자바스크립트의 비동기 실행을 돕기 위해 만들어진 장치

    // 호출 스택
    // 자바스크립트에서 수행해야 할 코드나 함수를 순차적으로 담아두는 스택

    // 실행 순서
    // 1. foo() 가 호출스택에 들어감
    // 2. foo() 내부의 console.log가 존재하므로 호출 스택에 들어감
    // 3. 2의 실행이 완료된 이후에 다음 코드로 넘어간 (아직 foo()는 존재)
    // 4. bar()가 호출 스택에 들어감
    // 5. bar() 내부에 console.log가 존재하므로 호출 스택에 들어감
    // 6. 5의 실행이 완료된 이후에 다음 코드로 넘어감(아직 foo(), bar() 존재)
    // 7. 더 이상 bar()에 남은 것이 없으므로 호출 스택에서 제거 (foo() 존재)
    // 8. baz()가 호출 스택에 들어감
    // 9. baz() 내부에 console.log가 존재하므로 호출 스택에 들어감
    // 10. 9의 실행이 완료된 이후에 다음 코드로 넘어감 (foo(), baz() 존재)
    // 11. baz()에 남은것이 없으므로 호출 스택에서 제거 (foo() 존재)
    // 12. foo()에 남은 것이 없으므로 호출 스택에서 제거
    // 13 호출 스택 비워짐
    function bar(){
        console.log('bar')
    }

    function baz(){
        console.log('baz')
    }

    function foo(){
        console.log('foo')
        bar()
        baz()
    }

    foo()

    // 호출 스택이 비어 있는지 여부를 확인하는 것 = 이벤트 루프
    // 이벤트 루프만의 단일 스레드 내부에서 호출 스택에서 수행해야 할 작업이 있는지 확인
    // 있으면 자바스크립트 엔진을 이용해 실행
    // 코드를 실행하는 것과 호출 스택이 비어있는지 확인하는것 모두 단일 스레드에서 발생
    // 두가지 작업이 동시에 일어날 수 없으며 한 스레드에서 순차적으로 발생

    // 비동기
    // 1. foo()가 호출 스택에 들어감
    // 2. foo()내부의 console.log가 호출 스택에 들어감
    // 3. 2의 실행 완료 후 다음 코드로 이동
    // 4. setTimeout(bar(), 0)이 호출 스택에 들어감
    // 5. 4에 대해 타이머 이벤트가 실행 태스크 큐로 들어가고 그 대신 바로 스택에서 제거
    // 6. baz()가 호출 스택에 들어감
    // 7. baz()내부의 console.log가 호출 스택에 들어감
    // 8. 7의 실행 완료 후 다음 코드로 넘어감
    // 9. baz() 제거
    // 10. foo() 제거
    // 11. 호출 스택 비워짐
    // 12. 이벤트 루프가 스택이 비워져 있는것을 확인 태스크 큐에 4번 내용이 있어 bar()를 호출 스택에 넣음
    // 13. bar() 내부의 console.log가 호출 스택에 들어감
    // 14. 13실행이 끝나고 다음 코드로 이동
    // 15. bar() 샂게
    function bar(){
        console.log('bar')
    }

    function baz(){
        console.log('baz')
    }

    function foo(){
        console.log('foo')

        setTimeout(bar(), 0) //setTimeout만 추가
        baz()
    }

    foo()

    // 태스크 큐
    // 실행해야 할 태스크의 집합
    // 이벤트 루프는 태스크 큐를 한 개 이상 가지고 있음
    // 큐 형태가 아니고 set의 형태
    // 살행해야 할 태스크 = 비동기 함수의 콜백 함수나 이벤트 핸들러 등

    // 즉 이벤트 루프 = 호출 스택에 실행 중인 코드가 있는지 태스크 큐에 대기 중인 함수가 있는지 박복해서 확인
    // 호출 스택이 비었다면 태스크 큐에서 대기 중인 작업이 있는지 확인하고 실행 가능한 오래된 것부터 순차적으로 꺼내와서 실행
    // 비동기 함수 수행은 메인 스레드가 아닌 태스크 큐가 할당되는 별도의 스레드에서 수행 (브라우저)
    // 자바스크립트 코드 외부에서 실행되고 콜백이 태스크 큐로 들어가는 형태
    // 이벤트 루프는 콜백이 실행 가능한 때가 오면 이것을 꺼내서 수행하는 역할
}

{
    // 마이크로 태스크 큐
    // 이벤트 루프는 하나의 마이크로 태스크 큐를 가지고 있음
    // 태스크 큐와는 다른 태스크 처리
    // 대표적으로 Promise가 있다
    // 마이크로 태스크 큐는 태스크 큐보다 우선권을 갖는다
    // setTimeout과 setInterval은 Promise보다 늦게 실행
    // 마이크로 큐가 빌 때까지는 기존 태스크 큐의 실행은 뒤로 밀림

    // bar, baz, foo 순으로 실행
    function foo(){
        console.log('foo')
    }

    function bar(){
        console.log('bar')
    }

    function baz(){
        console.log('baz')
    }

    setTimeout(foo, 0)

    Promise.resolve().then(bar).then(baz)

    // 큐에 할당되는 대표적인 작업
    // 태스크 큐: setTimeout, setInterval, setImmediate
    // 마이크로 큐: process.nextTick, Promises, queueMicroTask, MutationObserver
}

{
    // 렌더링 순서
    // 마이크로 태스크 큐 -> 렌더링 (각 마이크로 태스크 큐 작업이 끝날 때마다)
    <html>
        <body>
            <ul>
                <li>동기 코드: <button id="sync">0</button></li>
                <li>태스크: <button id="macrotask">0</button></li>
                <li>마이크로 태스크: <button id="microtask">0</button></li>
            </ul>

            <button id="macro_micro">모두 동시 실행</button>
        </body>
        <script>
            const button = document.getElementById('run')
            const sync = documenr.getElementById('sync')
            const macrotask = document.getElementById('macrotask')
            const microtask = document.getElementById('microtask')

            const macro_micro = document.getElementById('macro_micro')

            {/* 동기 코드로 버튼에 1부터 렌더링 */}
            {/* for문을 모두 순회 후 렌더링 (숫자가 한번에 나타난다) */}
            sync.addEventListener('click', function() {
                for(let i=0; i<=10000; i++){
                    sync.innerHTML = i
                }
            })

            {/* setTimeout으로 태스크 큐에 작업을 넣어서 1부터 렌더링 */}
            {/* 모든 setTimeout 콜백에 큐에 들어가기 전까지 잠깐의 대기시간을 가지다가 1부터 순차적으로 렌더링 */}
            macrotask.addEventListener('click', function(){
                for(let i=0; i<=10000; i++){
                    setTimeout(() => {
                        macrotask.innerHTML = i
                    }, 0)
                }
            })

            {/* queueMicrotask로 마이크로 태스크 큐에 넣어서 1부터 렌더링 */}
            {/* for문 모두 순회 후 렌더링 */}
            microtask.addEventListener('click', function(){
                for(let i=0; i<=10000; i++){
                    queueMicrotask(() => {
                        queueMicrotask.innerHTML = i
                    })
                }
            })

            {/* 동기 코드와 마이크로 태스크 큐만 한번에 렌더링 */}
            {/* 태스크 큐만 순차 렌더링 */}
            macro_micro.addEventListener('click', function(){
                for(let i=0; i<=10000; i++){
                    sync.innerHTML = i

                    setTimeout(() => {
                        macrotask.innerHTML = i
                    }, 0)

                    queueMicroTask(() => {
                        microtask.innerHTML = i
                    })
                }
            })
        </script>
    </html>
}

{
    // 리페인트 전에 콜백 함수 호출을 가능하게 하는 requestAnimationFrame으로도 확인 가능
    // a, c, d, b 순으로 출력
    console.log('a')

    setTimeout(() => {
        console.log('b')
    }, 0)

    Promise.resolve().then(() => {
        console.log('c')
    })

    window.requestAnimationFrame(() => {
        console.log('d')
    })

    // 동기 코는 물론이고 마이크로 태스크 또한 마찬가지로 렌더링에 영향을 미칠 수 있다
    // 따라서 특정 렌더링이 자바스크립트 내 무거운 작업과 연관이 있다면 이를 어떤 식으로 분리해서 최적화를 할지 고민해야 한다
}