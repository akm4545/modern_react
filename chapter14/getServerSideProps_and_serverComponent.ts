{
    // 서버에는 사용자에게 노출되면 안되는 정보들이 담겨 있기 때문에 클라이언트에 정보를 내려줄 ㄸ는 조심해야 한다
    export default function App({ cookie }: { cookie: string }){
        if(!validateCookie(cookie)){
            Router.replace(...)

            return null;
        }

        // do something
    }

    export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
        const cookie = ctx.req.headers.cookie || ''

        return {
            props: {
                cookie,
            }
        }
    }

    // 쿠키의 정보를 클라이언트에 문자로 제공해 쿠키의 유효성에 따라 이후 작업 처리
    // getServerSideProps가 반환하는 props 값은 모두 사용자의 HTML에 기록되고 또한 전역변수로 등록되어 스크립트로 충분히 접근할 수 있는
    // 보안 위협에 노출되는 값이 된다
    // 또한 getServerSideProps에서 처리할 수 있는 리다이렉트가 클라이언트에서 실행되어 성능 측면에서도 손해를 본다
    // 따라서 getServerSideProps가 반환하는 값 또는 서버 컴포넌트가 클리아언트 컴포넌트에 반환하는 props는 반드시 필요한 값으로만
    // 철저하게 제한되어야 한다

    // 수정된 코드
    export default function App({ token }: { token: string }){
        const user = JSON.parse(window.atob(token.split('.')[1]))
        const user_id = user.id

        // do something...
    }

    export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
        const cookie = ctx.req.headers.cookie || ''

        const token = validateCookie(cookie)

        if(!token){
            return {
                redirect: {
                    destination: '/404',
                    permanent: false
                },
            }
        }

        return {
            props: {
                token,
            }
        }
    }
}