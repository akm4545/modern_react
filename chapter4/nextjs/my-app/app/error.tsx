// _error.tsx
// 클라이언트, 서버에서 발생하는 에러를 처리할 목적으로 만들어졌다
// Next.js 프로젝트 전역에서 발생하는 에러를 적절하게 처리하고 싶다면 해당 페이지를 사용
// 개발 모드에서는 이 페이지를 방문할 수 없고 Next.js가 제공하는 개발자 에러 팝업이 나타난다
// 이 페이지가 잘 작동하는지 확인하여면 프로덕션으로 빌드해서 확인해 봐야한다


// next13에서 _error.tsx 대체
// _error.tsx 버전 예제 코드
// import { NextPageContext } from "next";

// function Error({ statusCode } : {statusCode: number}){
    // return (
    //     <p>
    //         {statusCode ? `서버에서 ${statusCode}` : `클라이언트에서`} 에러가 
    //         발생했습니다.
    //     </p>
    // )
// }

// Error.getInitialProps = ({ res, err }: NextPageContext) => {
//     const statusCode = res ? res.statusCode : err ? err.statusCode : ''

//     return { statusCode }
// }

// export default Error


// error.tsx 예제 코드
"use client"

export default function Error({ statusCode } : {statusCode: number}) {
    return (
        <p>
            {statusCode ? `서버에서 ${statusCode}` : `클라이언트에서`} 에러가 
            발생했습니다.
        </p>
    )
}
