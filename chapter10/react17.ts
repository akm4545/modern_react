{
    // 이벤트 위임 방식의 변경

    import {useEffect, useRef} from 'react'

    export default function Button(){
        const buttonRef = useRef<HTMLButtonElement | null>(null)

        useEffect(() => {
            if(buttonRef.current){
                buttonRef.current.onclick = function click() {
                    alert('안녕하세요!')
                }
            }
        }, [])

        function 안녕하세요(){
            alert('안녕하세요!')
        }

        return (
            <>
                // 리액트 방식
                // onClick 이벤트에 noop이라는 핸들러가 추가
                <button onClick={안녕하세요}>리액트 버튼</button>
                // 직접 DOM을 참조해서 가져온 다음 DOM의 onclick에 직접 함수를 추가하는 고전적인 방식
                // 리벤트 리스너에 click으로 추가
                <button ref={buttonRef}>그냥 버튼</button>
            </>
        )
    }

    // noop 함수는 문자 그대로(no operation) 아무런 일도 하지 않는다 
    // 그러나 두 버튼 모두 동일하게 작동한다

    // 리액트는 이벤트 핸들러를 해당 이벤트 핸들러를 추가한 각각의 DOM 요소에 부탁하는 것이 아니라 
    // 이벤트 타입(click, change)당 하나의 핸들러를 루트에 부착한다 이를 이벤트 위임이라고 한다

    // 이벤트 단계
    // 캡처(capture): 이벤트 핸들러가 트리 최상단 요소에서 부터 시작해서 실제 이벤트가 발생한 타깃 요소까지 내려가는 것
    // 타깃(target): 이벤트 핸들러가 타깃 노드에 도달하는 단계 이 단계에서 이벤트 호출
    // 버블링(bubbling): 이벤트가 발생한 요소에서부터 시작해 최상위 요소까지 다시 올라간다

    // 이벤트 위임은 이런 원리를 이용해 이벤트를 상위 컴포넌트에만 붙이는 것을 의미

    <ul>
        <li />
        <li />
        <li />
        <li />
        <li />
    </ul>

    // 만약 모든 li 요소에 이벤트가 필요하다면 이 li에 이벤트를 다 추가할 수도 있지만 ul에만 추가해서 이벤트를 위임한다면 더욱 많은 이점이 있다
    // ul의 자식에 li가 추가 또는 삭제되더라도 이벤트 핸들러를 똑같이 추가 수정할 필요도 없고 이벤트 추가를 한 번만 하면 되므로 좀 더 효율적으로 관리할 수 있게 된다
}

{
    // 리액트는 이벤트 핸들러를 각 요소가 아닌 document에 연결해서 이벤트를 좀 더 효율적으로 관리
    // 리액트 16 버전까지는 모두 document에서 수행되고 있었다

    import React from 'react'
    import ReactDOM from 'react-dom'

    export default function App () {
        function 안녕하세요(){
            alert('안녕하세요!')
        }

        return <button onClick={안녕하세요}>리액트 버튼</button>
    }

    ReactDOM.render(<App />, document.getElementById('root'))

    // 리액트 17부터는 이러한 이벤트 위임이 모두 document가 아닌 리액트 컴포넌트 최상단 트리, 즉 루트 요소로 바뀌었다
    // 이는 점진적인 업그레이드 지원, 다른 바닐라 자바스크립트 코드 또는 jQuery 등이 혼재돼 있는 경우 혼란을 방지하기 위해서다
}

{
    //만약 기존 리액트 16의 방식대로 모든 이벤트가 document에 달려 있다면
    import React from 'react' // 16.14
    import ReactDOM from 'react-dom' //16.14

    function React1614(){
        function App() {
            function 안녕하세요(){
                alert('안녕하세요! 16.14')
            }

            return <button onClick={안녕하세요}>리액트 버튼</button>
        }

        return ReactDOM.render(<App />, document.getElementById('React-16-14'))
    }

    import React from 'react' // 16.8
    import ReactDOM from 'react-dom' // 16.8

    function React168(){
        function App(){
            function 안녕하세요(){
                alert('안녕하세요! 16.8')
            }

            return <button onClick={안녕하세요}>리액트 버튼</button>
        }

        return ReactDOM.render(<App />, document.getElementById('React-16-8'))
    }
    
    // 이 코드는 다음과 같이 렌더링될 것이다
    <html>
        <body>
            <div id="React-16-14">
                <div id="React-16-8"></div>
            </div>
        </body>
    </html>

    // 만약 이 상황에서 React168 컴포넌트에 이벤트 전파를 막는 e.stopPropagation을 실행하면 모든 이벤트는 document로 올라가 있는 상태이기
    // 떄문에 document의 이벤트 전파는 막을 수 없다
    // 따라서 React1614에도 이 이벤트를 전달받는다

    // 이러한 문제 때문에 이벤트 위임의 대상을 document에서 컴포넌트의 최상위로 변경했다
    // 이렇게 되면 각 이벤트는 해당 리액트 컴포넌트 트리 수준으로 격리되므로 이벤트 버블링으로 인한 혼선을 방지할 수 있다
    // jQuery 같은 라이브러리와 리액트 16등이 혼재되어 있는 상황인 경우에도 이와 동일한 문제가 발생할 수 있다
}

{
    // 리액트 16 버전에서 document와 리액트가 렌더링되는 루트 컴포넌트 사이에서 이벤트를 막는 코드를 추가하면 리액트의 모든 핸들러가 작동하지 않도록 막을 수 있었다
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, shring-to-fit=no"
            />
        </head>
        <body>
            // 리액트 루트 컴포넌트
            <div id="main">
                <div id="root"></div>
            </div>
            <script>
                // 여기에 클릭 이벤트로 이벤트 전파를 막아버리면 리액트의 
                // 클릭 이벤트 핸들러가 모두 막힌다
                document.getElementById('main').addEventListener(
                    'click',
                    function (e) {
                        e.stopPropagation()
                    },
                    false,
                )
            </script>
        </body>
    </html>
}

{
    // 이러한 변경으로 만약 코드에 document.addEventListener를 활용해 리액트의 모든 이벤트를 document에서 확인하는 코드가 있다면 
    // 여기까지 이벤트가 전파되지 않는 경우도 존재할 수 있으므로 꼭 확인해 봐야 한다
    import React, {MouseEvent, useEffect} from 'react'
    import ReactDOM from 'react-dom'

    export default function App(){
        useEffect(() => {
            document.addEventListener('click', (e) => {
                console.log('이벤트가 document까지 올라옴')
            })
        }, [])

        function 안녕하세요(e: MouseEvent<HTMLButtonElement>) {
            e.stopPropagation()
            alert('안녕하세요!')
        }

        return <button onClick={안녕하세요}>리액트 버튼</button>
    }

    ReactDOM.render(<App />, document.getElementById('root'))

    // 이 코드는 리액트 16에서는 document에 달려 있으므로 stopPropagation이 의미가 없지만 리액트 17의 경우에는 컴포넌트 루트에 달려 있으므로 
    // document에 부착한 console 이벤트를 볼 수 없다
}

{
    // 리액트16에서는 JSX 변환을 위해서 코드 내에서 React 사용 구문이 없더라도 import React from 'react'가 필요했다
    // 리액트17부터는 바벨과 협력해 이러한 import 구문이 없어도 JSX를 변환할 수 있게 됐다
    // 이런 변화로 인해 불필요한 import 구문을 삭제해 번틀링 크기를 약간 줄일 수 있고 컴포넌트 작성을 더욱 간결하게 해준다

    // 리액트 16 JSX 변환
    const Component = (
        <div>
            <span>hello world</span>
        </div>
    )

    // 리액트 16 변환
    var Component = React.createElement(
        'div',
        null,
        React.createElement('span', null, 'hello world'),
    )

    // JSX 코드를 변환시켜주지만 React.createElement를 수행할 때 필요한 import React from 'react'까지는 추가해 주지 않는다

    // 리액트 17 변환
    'use strict'

    ver _jsxRuntime = require('react/jsx-runtime')

    var Component = (0, _jsxRuntime.jsx)('div', {
        children: (0, _jsxRuntime.jsx)('span', {
            children: 'hello world',
        }),
    })

    // JSX를 변환 시 필요한 모듈인 react/jsx-runtime을 불러오는 require 구문도 같이 추가되므로 import를 작성하지 않아도 된다
}

{
    // 이벤트 풀링 제거
    // 리액트 16에서는 이벤트 풀링이라 불리는 기능이 있었다
    // 리액트에는 이벤트를 처리하기 위한 SynthticEvent라는 이벤트가 있었는데 브라우저의 기본 이벤트를 한 번 더 감싼 이벤트 객체다
    // 리액트는 브라우저 기본 이벤트가 아닌 한번 래핑한 이벤트를 사용하기 때문에 이벤트가 발생할 때마다 이 이벤트를 새로 만들어야 했고 그 과정에서 
    // 메모리 할당 작업이 일어났다
    // 메모리 누수를 방지하기 위해 이렇게 만든 이벤트를 주기적으로 해제해야 하는 번거로움도 있다
    // 이벤트 풀링은 SyntheticEvent 풀을 만들어서 이벤트가 발생할 때마다 가져오는 것을 의미한다

    // 이벤트 풀링 시스템에서의 이벤트 발생
    // 1. 이벤트 핸들러가 이벤트 발생
    // 2. 합성 이벤트 풀에서 합성 이벤트 객체에 대한 참조를 가져옴
    // 3. 이 이벤트 정보를 합성 이벤트 객체에 넣음
    // 4. 유저가 지정한 이벤트 리스너 실행
    // 5. 이벤트 객체 초기화 후 다시 이벤트 풀로 돌아감

    // 합성 이벤트를 풀에서 꺼내 반복 사용 가능해서 효과적으로 보이지만 풀에서 이벤트를 받아오고 종료되면 다시 초기화(null)하는 방식은 사용하는 
    // 쪽에서는 직관적이지 않다

    export default function App(){
        const [value, setValue] = useState('')
        function handleChange(e: ChangeEvent<HTMLInputElement>){
            setValue(() => {
                return e.target.value
            })
        }

        return <input onChange={handleChange} value={value}><input/>
    }

    // 이 코드는 에러를 발생시킨다
    // 이벤트 핸들러롤 호출한 SyntheticEvent는 이후 재사용을 위해 null로 초기화 된다
    // 따라서 비동기 코드 내부에서 SynthticEvent인 e에 접근하면 이미 사용되고 초기화된 이후이기 때문에 null만 얻게 된다
    // 비동기 코드 내부에서 이 합성 이벤트 e에 접근하기 위해서는 추가적인 작업인 e.persist() 같은 처리가 필요했다

    function handleChange(e: ChangeEvent<HTMLInputElement>){
        e.persist()
        setValue(() => {
            return e.target.value
        })
    }
}

{
    // useEffect 클린업 함수의 비동기 실행
    // 리액트 16에서는 useEffect에 있는 클린업 함수는 동기적으로 처리됐다
    // 동기 실행이기 때문에 다른 작업을 방해하므로 불필요한 성능 저하로 이어지는 문제가 존재했다

    // 리액트 17에서는 화면이 완전히 업데이트된 이후에 클린업 함수가 비동기적으로 실행된다
    // 클린업 함수는 컴포넌트의 커밋 단계가 완료될 때까지 지연된다 
    // 이로써 약간의 성능적인 이점을 볼 수 있게 됐다

    import React, {useState, Profiler, useEffect, useCallback} from 'react'

    export default function App() {
        const callback = useCallback(
            (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
                console.log(phase)
                console.table({ id, phase, commitTime})
                console.groupEnd()
            },
            [],
        )

        return (
            <Profiler id="React16" onRender={callback}>
                <Button>
                    <Users />
                </Button>
            </Profiler>
        )
    }

    function Button({ children }){
        const [toggle, setToggle] = useState(false)

        const handleClick = useCallback(() => setToggle((prev) => !prev), [])

        return (
            <section>
                <button onClick={handleClick}>{toggle ? 'show' : 'hide'}</button>
                {toggle && children}
            </section>
        )
    }

    function Users() {
        const [users, setUsers] = useState(null)

        useEffect(() => {
            const abortController = new AbortController()
            const signal = abortController.signal

            fetch('https://jsonplaceholder.typicode.com/users', {signal: signal})
                .then((results) => results.json())
                .then((data) => {
                    setUsers(data)
                })

            return () => {
                console.log('cleanup!')
                abortController.abort()
            }
        }, [])

        return <p>{users === null ? 'Loading' : JSON.stringify(users)}</p>
    }
}