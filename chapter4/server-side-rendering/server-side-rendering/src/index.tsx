import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { hydrate } from 'react-dom';
import {fetchTodo} from './fetch';

// 프로덕션 사용 x
// 리액트 서버 사이드 렌더링을 직접 구현보다 Next.js 같은 프레임워크 권장

// create-react-app의 index.jsx와 유사한 역할 
// 애플리케이션의 시작점 hydrate가 포함
// HTML을 hydrate를 통해 완성된 웹 애플리케이션으로 만듦
// fetchTodo를 호출해 필요한 데이터 주입
// 서버에서 완성한 HTML과 하이드레이션 대상이 되는 HTML의 결과물이 동일한지 비교하는 작업을 거치므로 이 비교작업을 무사히 수행하기 위해
// 한 번 더 데이터 조회
async function main(){
  const result = await fetchTodo()

  const app = <App todos={result} />
  const el = document.getElementById('root')

  hydrate(app, el)
}

main()