// 서버 발생 에러 핸들링
// _error.tsx와 500.tsx가 모두 있다면 500.tsx가 우선적으로 실행
export default function My500Page(){
    return <h1>서버에서 에러가 발생했습니다.</h1>
}