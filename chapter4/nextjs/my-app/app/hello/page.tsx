// Next.js는 서버 사이드 렌더링을 수행하지만 동시에 싱글 페이지 애플리케이션과 같이 클라이언트 라우팅 또한 수행

// 예제
export default function hello(){
    console.log(typeof window === 'undefined' ? '서버' : '클라이언트')

    return <>hello</>
}

// Next13 작동 안함 -> 이후 버전은 없어도 로그 남음
// 제거하고 실행하면 <a />, <Link />에 상관없이 서버에 로그가 남지 않는다
// 빌드 시 getServerSideProps가 존재하면 서버 사이드에서 렌더링되는 페이지로 구분
// 없으면 빌드 시점에 미리 만들어도 되는 페이지로 간주
// 후자의 경우 typeof window === 'undefined' ? '서버' : '클라이언트' 코드도 단순히 '클라이언트'로 축약돼 빌드된다
// typeof window의 처리를 모두 object로 바꾼 다음 빌드 시점에 미리 트리쉐이킹을 해버리기 때문 
// Next.js는 서버 사이드 렌더링 프레임워크지이지만 모든 작업이 서버에서 일어나는 것은 아니다

// export const getServerSideProps = () => {
//     return {
//         props: {},
//     }
// }