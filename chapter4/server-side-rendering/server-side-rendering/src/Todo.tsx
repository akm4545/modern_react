import { useState } from "react";
import {TodoResponse} from '../fetch';

export function Todo({ todo } : { todo: TodoResponse }){
    const { title, completed, userId, id} = todo
    const [finished, setFinished] = useState(completed)

    function handleClick() {
        setFinished((prev: boolean) => !prev)
    }

    return (
        <li>
            <span>
                {userId}-{id}) {title} {finished? '완료' : '미완료'}
                <button onClick={handleClick}>토글</button>
            </span>
        </li>
    )
}


// App.tsx의 자식 컴포넌트
// props.todo를 받아 렌더링 하는 역할