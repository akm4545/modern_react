import { createServer, IncomingMessage, ServerResponse } from "http";
import { createReadStream } from "fs";

import {renderToNodeStream, renderToString} from 'react-dom/server';
import { createElement } from "react";

import html from '../public/index.html';
import indexFront from '../public/index-front.html';
import indexEnd from '../public/index-end.html';

import App from "./components/App";
import { fetchTodo } from './fetch';

const PORT = process.env.PORT || 3000

// createServer로 넘겨주는 인수 HTTP 서버가 라우트(주소) 별로 어떻게 작동할지를 정의하는 함수
async function serverHandler(req: IncomingMessage, res: ServerResponse) {
    // req.url을 통해 사용자가 접근한 주소를 알 수 있다
    const { url } = req;

    switch(url){
        // renderToString을 사용한 서버 사이드 렌더링

        // 루트 라우터
        // renderToString을 활용해 리액트 컴포넌트를 HTML로 만들고 앞서 언급한
        // __placeholder__를 대상으로 replace를 실행해 서버 응답으로 제공
        // 서버 사이드 렌더링의 목적 달성
        case '/': {
            const result = await fetchTodo()

            const rootElement = createElement(
                'div',
                { id: 'root'},
                createElement(App, { todos: result }),
            )
            const renderResult = renderToString(rootElement)

            const htmlResult = html.replace('__placeholder__', renderResult)

            res.setHeader('Content-Type', 'text/html')
            res.write(htmlResult)
            res.end()

            return
        }

        // renderToNodeStream을 사용한 서버 사이드 렌더링
        // rootElement를 만드는 과정까지는 동일
        // indexFront, indexEnd는 __placeholder__를 기준으로 앞 뒤 나눈 형태
        // 앞의 절반을 indexFront로 응답
        // 이후에 renderToNodeStream을 활용해 나머지 부분을 스트림으로 생성
        // 청크 단위로 생성하기 떄문에 이를 pipe와 res에 걸어두고 청크가 생성될 때마다 res에 기록
        // 스트림 종료시 indexEnd를 붙이고 최종 결과물을 브라우저에 출력
        case '/stream': {
            res.setHeader('Content-Type', 'text/html')
            res.write(indexFront)

            const result = await fetchTodo()
            const rootElement = createElement(
                'div',
                { id: 'root' },
                createElement(App, { todos: result }),
            )

            const stream = renderToNodeStream(rootElement)
            stream.pipe(res, { end: false })
            stream.on('end', () => {
                res.write(indexEnd)
                res.end()
            })
            return
        }

        // 아래는 디버깅 용도 
        // 브라우저에 제공되는 리액트 코드
        case '/browser.js': {
            res.setHeader('Content-Type', 'application/javascript')
            createReadStream('./dist/browser.js').pipe(res)
            return
        }

        // 위 파일의 소스맵
        case '/browser.js.map': {
            res.setHeader('Content-Type', 'application/javascript')
            createReadStream(`./dist/browser.js.map`).pipe(res)
            return
        }

        default: {
            res.statusCode = 404
            res.end('404 Not Found')
        }
    }
}

function main() {
    // http 모듈을 이용해 간단한 서버를 만들 수 있는 Node.js 기본 라이브러리 
    // 3000번 포트를 이용하는 서버를 만들었다
    createServer(serverHandler).listen(PORT, () => {
        console.log(`Server has been started ${PORT}...`) //eslint-disable-line no-console
    })
}
