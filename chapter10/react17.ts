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
    
    
    
}