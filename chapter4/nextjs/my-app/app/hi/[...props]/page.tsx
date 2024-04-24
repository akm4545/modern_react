// []를 사용해 라우팅을 정의하는 예제
// pages/hi/[...props].tsx

// 해당 예제는 next13이상 작동 안함
'use client'

import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { NextPageContext } from 'next';
import { usePathname, useRouter as useClientRouter } from 'next/navigation';


export default function HiAll({ props: serverProps }: { props: string[] }){
  // 클라이언트에서 값을 가져오는 법
  console.log(serverProps)
  console.log(usePathname());

  // const {
  //   query: { props },
  // } = useClientRouter()

  // useEffect(() => {
  //   /* eslint-disable no-console */
  //   console.log(props)
  //   console.log(JSON.stringify(props) === JSON.stringify(serverProps)) // true
  //   /* eslint-enable no-console */
  // }, [props, serverProps])

  return (
    <>
      hi{' '}
      <ul>
        {/* {serverProps.map((item) => (
          <li key={item}>{item}</li>
        ))} */}
      </ul>
    </>
  )
}

export const getServerSideProps = (context: NextPageContext) => {
  // 서버에서 값을 가져오는 법
  const {
    query: { props }, // string | stirng[] | undefined
  } = context

  // 서버에서 클라이언트로 값을 내려주는 것은 이후에 설명
  return {
    props: {
      props,
    },
  }
}

// 위 페이지를 다음과 같은 주소로 접근하면 props에 다음과 같은 값이 담긴다
// /hi/1:['1']
// /hi/1/2:['1', '2']
// /hi/1/2/3:['1', '2', '3']
// /hi/my/name/is:['my', 'name', 'is']