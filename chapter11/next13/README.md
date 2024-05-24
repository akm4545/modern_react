이전 버전까지 서버에서 데이터를 불러와서 하이드레이션할 수 있는 방법은 getServerSideProps를 비롯한 몇 가지 방법으로 제한돼 있었다
Next13과 리액트 18에서는 서버 컴포넌트라면 어디든 서버 관련 코드를 추가할 수 있게 됐다
서버 컴포넌트에서 fetch를 수행하고 이 fetch에 별다른 cache옵션을 제공하지 않는다면 기존의 getServerSideProps와 매우 유사하게 작동한다

예제
import { ReactNode } from 'react'
import { fetchPostById } from ''#services/server'

export default async function Page({
    params,
}: {
    params: { id: string }
    children?: ReactNode
}) {
    // const response = await fetch(
    //  `htttps://jsonplaceholder.typicode.com/posts/${id}`,
    //  options,
    // )
    // const data = await response.json()
    // 와 같다
    const data = await fetchPostById(params.id, { cache: 'no-cache' })

    return (
        <div>
            <h1>{data.title}</h1>
            <p>{data.body}</p>
        </div>
    )
}

최초 요청 시에 HTML을 살펴보면 기존에 getServerSideProps와 마찬가지로 미리 렌더링되어 완성된 HTML이 내려온다
즉 Next.js 13에서도 여전히 서버 사이드 렌더링과 비슷하게 서버에서 미리 페이지를 렌더링해서 내려받는 것이 가능하다

과거 getServerSideProps를 사용하는 애플리케이션에는 <script id="__NEXT_DATA__" type="application/json">
이라는 태그가 추가돼 있었고 이는 클라이언트에서 하이드레이션을 수행했었다

리액트 18에서는 서버 컴포넌트에서 렌더링한 결과를 직렬화 가능한(JSON.stringify가 가능한) 데이터로 클라이언트에 제공하고
클라이언트는 이를 바탕으로 하이드레이션을 진행한다

Next.js 13이전까지 정적 페이지 생성을 위해 getStaticProps나 getStaticPaths를 이용해 사전에 미리 생성 가능한 경로(path)를 모아둔 다음
이 경로에 내려줄 props를 미리 빌드하는 형식으로 구성돼 있었다
이러한 방법은 헤드리스(headless) CMS 같이 사용자 요청에 앞서 미리 빌드해둘 수 있는 페이지를 생성하는데 매우 효과적이었다

Next.js 13에서는 app 디렉터리가 생겨나면서 getStaticProps와 getStaticPaths는 사라졌지만 이와 유사한 방식을 fetch와 cache를 이용해
구현할 수 있다

/app/ssg/[id]/page.tsx 경로의 코드를 보면
generateStaticParams를 사용해 /app/ssg/[id]에서 [id]로 사용 가능한 값을 객체 배열로 모아뒀다
page 컴포넌트에서는 이 각각의 id를 props로 받을 때 어떻게 작동할지 미리 정해뒀다

이전 서버 사이드 렌더링 예제와는 다르게 fetchPostById에는 별다른 옵션을 주지 않았다
이것은 가능한 모든 cache 값을 사용하도록 설정한 것과 같다

빌드 결과물을 볼 수 있는 ./next/server/app 아래에 generateStaticParams로 선언한 모든 경우의 수에 대해 미리 페이지를 생성해둔다
따라서 실제 페이지에 접근할 때는 별다른 추가적인 작업없이 이 HTML만으로도 페이지를 확인할 수 있으므로 사용자는 더욱 빠르게 접속할 수 있다

정적 빌드 뿐만 아니라 캐시를 활용할 수 있다 이러한 방식은 Next.js 에서는 Incremental Static Regeneration 이라고 하는데 정적으로 생성된 페이지를
점진적으로 갱신하는 것을 의미한다 
Next.js에서 제공하는 캐시와 관련된 기능을 활용하면 일정 기간 동안은 캐시를 통해 빠르게 렌더링하고 시간이 지나면 새롭게 데이터를 불러오는 방식으로 페이지를 구성할 수 있다
