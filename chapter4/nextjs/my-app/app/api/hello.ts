// 서버의 API를 정의하는 폴더 = api
// 기본적인 디렉터리에 따른 라우팅 구조는 페이지(next13 -> app)와 동일
// api라는 접두사가 붙는다는 점만 다르다
// 즉 /pages/api/hello.ts는 /api/hello로 호출할 수 있으며 이 주소는 다른 pages 파일과 다르게 HTML 요청을 하는게 아니라
// 단순히 서버 요청을 주고받게 된다

//Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    name: string
}

// 페이지와 마찬가지로 default export로 내보낸 함수가 힐생
// Express나 Koa와 같은 Node.js 기반 서버 프레임워크를 사용해 본 경험이 있다면 쉽게 사용 가능
// 해당 코드는 오직 서버에서만 실행
// window, document 접근 코드를 작성하면 문제 발생
// 일반적인 프론트엔드 프로젝트를 만든다면 /api 폴더는 작성할 일이 거의 업지만 서버에서 내려주는 정보를 조합해
// DFF(backend-for-frontend) 형태를 활용하거나 완전한 풀스택 애플리케이션을 구축하고 싶을 때
// 혹은 CORS(Cross-Origin Resource Sharing) 문제를 우회하기 위해 사용될 수 있다

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
    res.status(200).json({ name: 'John Doe' })
}