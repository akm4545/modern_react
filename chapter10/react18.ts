{
    // 리액트 18에서 가장 큰 변경점은 동시성 지원이다
}

{
    // 리액트 18에서 새로 추가된 훅

    // useId
    // 컴포넌트별로 유니크한 값을 생성하는 훅

    // 유니크 값을 만들기 위해 고려해야 할 점
    // 1. 하나의 컴포넌트를 여러 군데에서 재사용 하는 경우
    // 2. 리액트 컴포넌트 트리에서 컴포넌트가 가지는 모든 값이 겹치지 않고 다 달라야 한다는 제약
    // 3. 서버 사이드 렌더링 환경에서 하이드레이션이 일어날 때도 서버와 클라이언트에서 동일한 값을 가져야 한다

    // 다음 컴포넌트가 서버 사이드에서 렌더링되어 클라이언트에 제공된다면
    export default function UniqueComponent() {
        return <div>{Math.rendom()}</div>
    }

    // 에러 발생
    // Text content did not match. Server: "0.321312..." Client: "0.7689646"

    // 서버에서 렌더링하고 클라이언트에서 해당 결과물을 받고 이벤트를 입히기 위한 하이드레이션을 했을 때 Math.random() 값이 다르기 때문
    // 리액트 17까지는 컴포넌트별로 고유한 값을 사용한다면 반드시 하이드레이션을 고려해야 해서 리액트 17까지는 굉장히 까다로운 작업이다

    // useId를 사용하면 클라이언트와 서버에서 불일치를 피하면서 컴포넌트 내부의 고유한 값을 생성할 수 있게 됐다
    import { useId } from 'react'

    function Child(){
        const id = useId()
        return <div>child: {id}</div>
    }

    function SubChild(){
        const id = useId()

        return (
            <div>
                Sub Child: {id}
                <Child />
            </div>
        )
    }

    export default function Random(){
        const id = useId()

        return (
            <>
                <div>Home: {id}</div>
                <SubChild />
                <SubChild />
                <Child />
                <Child />
                <Child />
            </>
        )
    }
    
    // 이 컴포넌트를 서버 사이드에서 렌더링하면 다음과 같은 HTML을 확인할 수 있다
    <div>
        <div>
            Home:
            <!-- -->:Rm:
        </div>
        <div>
            Sub Child:<!-- -->:Ram:
            <div>
                child:
                <!-- -->:R7am:
            </div>
        </div>
        <div>
            Sub Child:<!-- -->:Rem:
            <div>
                Child:
                <!-- -->:R7em:
            </div>
        </div>
        <div>
            child:
            <!-- -->:Rim:
        </div>
        <div>
            child:
            <!-- -->:Rmm:
        </div>
        <div>
            child:
            <!-- -->:Rqm:
        </div>
    </div>
}