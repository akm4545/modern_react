{
    // Next.js 13.4.0에 추가된 기능
    // API를 굳이 생성하지 않더라도 함수 수준에서 서버에 직접 접근해 데이터 요청 등을 수행할 수 있는 기능
    // 서버 컴포넌트와 다르게 특정 함수 실행 그 자체만을 서버에서 수행할 수 있다는 장점이 있다
    // 실행 결과에 따라 다양한 작업을 수행할 수도 있다

    // 사용하기 위해 next.config.js에서 실험 기능 활성화
    /** @type {import('next').NextConfig} */
    const nextConfig = {
        experimental: {
            serverActions: true,
        },
    }

    module.export = nextConfig

    // 서버 액션을 만들려면 함수 내부 또는 파일 상단에 'use server' 지시자를 선언해야 한다
    // 함수는 반드시 async여야 한다 아니면 에러 발생

    async function serverAction(){
        'use server'
        // ...
    }

    // 이 파일 내부의 모든 내용이 서버 액션으로 간주
    'use server'

    export async function myAction() {
        // ...
    }
}

{
    // form의 action
    // <form />은 HTML에서 양식을 보낼 때 사용하는 태그로 action props를 추가해서 이 양식 데이터를 처리할 URI를 넘겨줄 수 있다
    export default function Page() {
        async function handleSubmit() {
            'use server'

            console.log('해당 작업은 서버에서 수행합니다. 따라서 CORS 이슈가 없습니다.')

            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'post',
                body: JSON.stringify({
                    title: 'foo',
                    body: 'bar',
                    userId: 1,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })

            const result = await response.json()
            console.log(result)
        }

        return (
            <form action-{handleSubmit}>
                <button type="submit">form 요청 보내보기</button>
            </form>
        )
    }

    // 예제에서는 form.action에 handleSubmit이라는 서버 액션을 만들어 props로 넘겨줬다
    // 이 handleSubmit 이벤트를 발생시키는 것은 클라이언트지만 실제로 함수 자체가 수행되는 것은 서버가 된다

    // 크롬 개발자 모드로 form 버튼을 클릭했을때 /server-action/form으로 요청이 수행되고 페이로는 앞서 코드에서 보낸 post 요청이 
    // 아닌 ACTION_ID 라는 액션 구분자만 있다
    // 그리고 이를 처리ㅏ는 서버에서는 다음과 같은 내용이 미리 빌드돼 있다

    // .next/server/app/server-aciton/form/page.js

    // 해당 페이지에서 수행하는 서버 액션을 모아둔다
    const actions = {
        // 앞서 페이로드에서 본 액션 아이디를 확인할 수 있다
        fdkslg3432312smdlgmd: () =>
            Promise.resolve(/* import() eager */)
            .then(__webpack_require__.bind(__webpack_require__, 5948))
            .then((mod) => mod['$$ACTION_0']),
    }

    // ...

    // 해당 페이지
    function Page() {
        async function handleSubmit() {
            return $$ACTION_0(handleSubmit.$$bound)
        }

        // ...
    }

    // ...

    async function $$ACTION_0(closure){
        console.log('해당 작업은 서버에서 수행합니다. 따라서 CORS 이슈가 없습니다.')

        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'post',
            body: JSON.stringify({
                title: 'foo',
                body: 'bar',
                userId: 1,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })

        const result = await response.json()
        console.log(result)
    }

    // 서버 액션을 실행하면 클라이언트에서는 현재 라우트 주소와 ACTION_ID만 보내고 그 외에는 아무것도 실행하지 않는다
    // 서버에서는 요청받은 라우트 주소와 ACTION_ID를 바탕으로 실행해야 할 내용을 찾고 이를 서버에서 직접 실행
    // 이를 위해 'use server'로 선언돼 있는 내용을 빌드 시점에 미리 클라이언트에서 분리시키고 서버로 옮김으로써 클라이언트 번들링 결과물에는
    // 포함되지 않고 서버에서만 실행되는 서버 액션을 만든 것을 확인할 수 있다
}

{
    // 폼과 실제 노출하는 데이터가 연동돼 있을 때 더욱 효과적으로 사용 가능
    // key value storage. 서버에서만 사용할 수 있는 패키지
    import kv from '@vercel/kv'
    import { revalidatePath } from 'next/cache'

    interface Data{
        name: string
        age: number
    }

    export default async function Page({ params }: { params: { id: string }}){
        const key = `test:${params.id}`
        const data = await kv.get<Data>(key)

        async function handleSubmit(formData: FormData){
            'use server'

            const name = formData.get('name')
            const age = formData.get('age')

            await kv.set(key, {
                name,
                age
            })

            revalidatePath(`/server-action/form/${params.id}`)
        }

        return (
            <>
                <h1>form with data</h1>
                <h2>
                    서버에 저장된 정보: {data?.name} {data?.age}
                </h2>

                <form action={handleSubmit}>
                    <label htmlFor="name">이름: </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={data?.name}
                        placeholder="이름을 입력해 주세요."
                    />

                    <label htmlFor="age">나이: </label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        defaultValue={data?.age}
                        placeholder="나이를 입력해 주세요."
                    />

                    <button type="submit">submit</button>
                </form>
            </>
        )
    }

    // 서버에서만 접근할 수 있는 Redis 스토리지인 @vercel/kv를 기반으로 서버 액션에서 어떻게 양식 데이터를 다룰 수 있는지 나타낸다
    // 먼저 Page 컴포넌트는 서버 컴포넌트로 const data = await kv.get<Data>(key)와 같은 형태로 직접 서버 요청을 수행해서 데이터를 가져와 JSX
    // 렌더링
    // form 태그에 서버 액션인 handleSubmit을 추가해서 formData를 기반으로 데이터를 가져와 다시 데이터베이스인 kv에 업데이트
    // 업데이트 성공 시 마지막으로 revalidatePath를 통해 해당 주소의 캐시 데이터를 갱신해 컴포넌트 재렌더링

    // 과정
    // 서버에 ACTION_ID와 실행에 필요한 데이터 전달 직접적인 업데이트를 수행하지 않는다
    // 서버 액션의 실행이 완료되면 data 객체가 revalidatePath로 갱신되어 업데이트된 최신 데이터를 불러온다

    // PHP와의 차이점은 이 모든 과정이 페이지 새로고침 없이 수행된다
    // 페이지 새로고침 없이 데이터 스트리밍으로 이뤄진다

    // revalidatePath는 인수로 넘겨받은 경로의 캐시를 초기화해서 해당 URL에서 즉시 새로운 데이터를 불러오는 역할
    // Next.js에서는 이를 server mutation(서버에서의 데이터 수정)이라고 하는데 server mutation으로 실행할 수 있는 함수는 다음과 같다

    // redirect: import { redirect } from 'next/navigation'으로 사용할 수 있으며 특정 주소로 리다이렉트할 수 있다
    // revalidatePath: import { revalidatePath } from 'next/cache'로 사용 해당 주소의 캐시를 즉시 업데이트
    // revalidateTag: import { ravalidateTag } from 'next/cache'로 사용 캐시 태그는 fetch 요청 시에 다음과 같이 추가 가능
    fetch('https://localhost:8080/api/something', { next: { tags: [''] }})
    // 이렇게 태그를 추가해 두면 여러 다양한 fetch 요청을 특정 태그 값으로 구분할 수 있으며 revalidateTag를 사용할 경우 이 특정 태그가 추가된 fetch 요청을 모두 초기화
}

{
    // input의 submit과 image의 formAction
    // 둘도 formAction prop으로도 서버 액션을 추가할 수 있다
}

{
    // startTransition과의 연동
    // useTransition에서 제공하는 startTransition에서도 서버 액션을 활용할 수 있다

    //server-action/index.ts
    'use server'

    import kv from '@vercel/kv'
    import { revalidatePath } from 'next/cache'

    export async function updateData(
        id: string,
        data: { name: string; age: number },
    ) {
        const key = `test:${id}`

        await kv.set(key, {
            name: data.name,
            age: data,age
        })

        revalidatePath(`/server-action/form/${id}`)
    }

    // client-component.tsx
    'use client'

    import { useCallback, useTransition } from 'react'
    import { updateData } from '../../server-action'
    import { SkeletonBtn } from '../../app/styles/styled-components/components'

    export function ClientButtonComponent({ id }: { id: string }){
        const [isPending, startTransition] = useTransition()
        const handleClick = useCallback(() => {
            startTransition(() => updateData(id, { name: '기본값', age: 0 }))
        }, [])

        return isPending ? (
            <SkeletonBtn />
        ) : (
            <button onClick={handleClick}>기본값으로 돌리기</button>
        )
    }

    // useTransition을 사용하면 얻을 수 있는 장점 중 하나는 이전과 동일한 로직을 구현하면서도 page단위의 loading.jsx를 사용하지 않아도 된다
    // isPending을 활용해 startTransition으로 서버 액션이 실행됐을 때 해당 버튼을 숨기고 로딩 버튼을 노출함으로써 페이지 
    // 단위의 로딩이 아닌 좀 더 컴포넌트 단위의 로딩 처리도 가능
    // 이와 동시에 revalidatePath와 같은 server mutation도 마찬가지로 처리 가능
}

{
    // server mutation이 없는 작업
    // 별도의 server mutation을 실행하지 않는다면 바로 이벤트 핸들러에 넣어도 된다

    export default function Page() {
        async function handleClick(){
            'use server'

            // server mutation이 필요 없는 작업
        }

        return <button onClick={handleClick}>form 요청 보내보기</button>
    }
}