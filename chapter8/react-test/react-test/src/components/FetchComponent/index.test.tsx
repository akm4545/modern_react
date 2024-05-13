// 다음과 같이 fetch를 모킹했다고 가정
// jest.spyOn(window, 'fetch').mockImplementation(
//     jest.fn(() =>
//         Promise.resolve({
//             ok:true,
//             status: 200,
//             json: () => Promise.resolve(MOCK_TODO_RESPONSE),
//         }),
//     ) as jest.Mock, //실제로 정확하게 fetch를 모킹하려면 많은 메서드를 구현해야 하지만 여기서는 간단하게 json만 구현하고 어설션으로 간단하게 처리
// )

// 해당 코드로는 오류가 발생한 경우에는 ok, status, json의 모든 값을 바꿔서 다시 모킹해야 한다
// 이러한 방식은 테스트를 수행할 때마다 모든 경우를 새롭게 모킹해야 하므로 테스트 코드가 길고 복잡해진다
// 또한 fetch가 할 수 있는 다양한 일 (headers를 설정하거나, text()로 파싱하거나, status의 값을 다르게 보는 등)
// 을 일일이 모킹해야 하므로 테스트 코드가 길어지고 유지보수도 어렵다

// 이럴 경우 MSW(Mock Service Worker) 사용
// Node.js, 브라우저에서 모두 사용 가능한 모킹 라이브러리
// 브라우저에서는 서비스 워커를 활용해 실제 네트워크 요청을 가로채는 방식으로 모킹 구현
// Node.js 환경에서는 https나 XMLHttpRequest의 요청을 가로채는 방식으로 작동
// 즉 동일하게 네트워크 요청을 수행하고 이 요청 중간에 MSW가 감지하고 미리 준비한 모킹 데이터를 제공하는 방식
// fetch의 모든 기능을 그대로 사용하면서도 응답에 대해서만 모킹 가능
// 테스트 코드뿐만 아니라 create-react-app, Next.js등 다양한 환경에서도 사용 가능

// MSW를 활용해 fetch 응답을 모킹한 테스트 코드
import { fireEvent, render, screen } from "@testing-library/react";
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { FetchComponent } from ".";

const MOCK_TODO_RESPONSE = {
    userId: 1,
    id: 1,
    title: 'delectus aut autem',
    completed: false,
}

// MSW를 활용해 fetch 응답을 모킹 
// setupServer = MSW 제공 메서드로 서버를 만드는 역할
// 해당 함수 내부에 Express나 Koa와 비슷하게 라우트 선언 가능
const server = setupServer(
    // 라우트 설정
    rest.get('/todos/:id', (req, res, ctx) => {
        const todoId = req.params.id

        // todoId 값 체크 
        if(Number(todoId)){
            // 숫자일 경우 정상 데이터 리턴
            return res(ctx.json({...MOCK_TODO_RESPONSE, id: Number(todoId)}))
        }else{
            // 숫자가 아닐 경우 404 반환
            return res(ctx.status(404))
        }
    }),
)

// 테스트 코드 시작 전에 서버 가동 
beforeAll(() => server.listen())
// server.resetHandlers() = setupServer의 기본 설정으로 되돌리는 코드
// 서버에서 실패가 발생할 경우를 테스트 할 때는 res를 임의로 ctx.status(503)과 같이 변경
// 이를 리셋하지 않으면 계속해서 실패하는 코드로 남는다
afterEach(() => server.resetHandlers())
// 테스트 코드 종료 후 서버 종료
afterAll(() => server.close())

beforeEach(() => {
    render(<FetchComponent />)
})

describe('FetchComponent 테스트', () => {
    it('데이터를 불러오기 전에는 기본 문구가 뜬다.', async () => {
        const nowLoading = screen.getByText(/불러온 데이터가 없습니다./)
        expect(nowLoading).toBeInTheDocument()
    })

    it('버튼을 클릭하면 데이터를 불러온다.', async () => {
        const button = screen.getByRole('button', { name: /1번/ })
        fireEvent.click(button)

        const data = await screen.findByText(MOCK_TODO_RESPONSE.title)
        expect(data).toBeInTheDocument()
    })

    it('버튼을 클릭하고 서버 요청에서 에러가 발생하면 에러 문구를 노출한다.', async () => {
        // 에러 발생의 경우를 테스트 하기 위해 
        // server.use를 사용해 기존 setupServer의 내용을 새롭게 덮어쓴다
        server.use(
            rest.get('/todos/:id', (req, res, ctx) => {
                // 모든 응답이 503으로 떨어지도록
                return res(ctx.status(503))
            })
        )

        const button = screen.getByRole('button', { name: /1번/ })
        fireEvent.click(button)

        const error = await screen.findByText(/에러가 발생했습니다/)
        expect(error).toBeInTheDocument()
    })
})