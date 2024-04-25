// Next.js 프로젝트의 환경 설정을 담당 반드시 알아야 하는 파일

// type 주석은 자바스크립트 파일에 타입스크립트의 타입 도움을 받기 위해 추가된 코드
// 해당 주석이 존재하면 next의 NextConfig를 기준으로 타입의 도움을 받을 수 있으나 없으면 일일이 타이핑해야 한다
/** @type {import('next').NextConfig} */

// reactStrictMode: 리액트의 엄격 모드와 관련된 옵션 리액트 애플리케이션 내부에서 잠재적인 문제를 개발자에게 알리기 위한 도구 
// 특별한 이유가 없다면 켜두는 것이 좋다

// swcMinify: Vercel에서는 만든 오픈소스 
// 번들링과 컴파일을 더욱 빠르게 수행하기 위해 만들어짐
// 바벨의 대안 
// 러스트라는 완전히 다른 언어로 작동하고 병렬로 처리
// swcMinify는 SWC 기반으로 코드 최소화 작업을 할 것인지 여부를 설정
// 이 밖에도 다양한 설정을 추가할 수 있다 자세한 내용은 공식 홈페이지 또는 next.config.js를 읽는 파일 자체를 깃허브에서 확인
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
};

export default nextConfig;

// @type 구문을 활용해 미리 선언돼 있는 설정 타입(NextConfig)의 도움을 받을 수 있다
// 다음과 같은 파일을 작성해 도움을 얻을 수 있다

/** @type {import('next').NextConfig} */
// const nextConfig = {
//     //설정
// }

// module.exports = nextConfig

// 실무에서 자주 사용되는 설정 
// basePath: 기본적으로 애플리케이션을 실행하면 호스트 아래 /에 애플리케이션이 제공
// 개발환경으로 치면 localhost:3000/이 접근 가능한 주소 
// basePath에 docs와 같은 문자열 추가 시 localhost:3000/docs에 서비스가 시작
// 여기에 값을 추가했다 하더라도 <Link>나 router.push() 등에 이 basePath를 추가할 필요는 없다
// basePath가 있다면 클라이언트 렌더링을 트리거하는 모든 주소에서 알아서 basePath가 붙은 채로 렌더링 및 작동할 것이다
// Next.js에서 제공하는 기능이므로 <a>태그나 window.location.push등으로 라우딩 시 반드시 basePath가 붙어야 한다

// swcMinify: swc를 이용해 코드를 압출할지를 나타낸다 기본값 true

// poweredByHeader: Next.js는 응답 헤더에 X-Power-by: Next.js 정보를 제공하는데 false를 선언하면 이 정보가 사라짐
// 보안 관련 솔루션에서는 powered-by 헤더를 취약점으로 분류하므로 false로 설정하는 것이 좋다

// redirects: 특정 주소를 다른 주소로 보내고 싶을 때 사용
// 정규식도 사용 가능하므로 다양한 방식으로 응용할 수 있다
// 예제
module.exports = {
    redirects() {
        return [
            {
                // /tag/foo => /tag/foo/pages/1
                source: '/tag/:tag',
                destination: '/tags/:tag/pages/1',
                permanent: true,
            },
            {
                // /tag/foo => /tags/foo/pages/1
                source: '/tag/:tag/page/:no',
                destination: '/tags/:tag/pages/:no',
                permanent: true,
            },
            {
                // /tag/foo/pages/something => /tags/foo/pages/1
                source: '/tags/:tag/pages/((?!\\d).*)',
                destination: '/tags/:tag/pages/1',
                permanent: true,
            },
        ]
    },
}

// reactStrictMode: 리액트에서 제공하는 엄격 모드를 설정할지 여부를 나타낸다 기본값은 false이지만 
// true로 설정해 다가올 리액트 업데이트에 미리 대비하는 것을 추천

// assetPrefix: 만약 next에서 빌드된 결과물을 동일한 호스트가 아닌 CDN 등에 업로드하고자 한다면 이 옵션을 해당 CDN 주소를 명시하면 된다
// 해당 옵션이 활성화되면 static 리소스들은 해당 주소에 있다고 가정하고 해당 주소로 요청하게 된다
// 정적인 리소스를 별도 CDN에 업로드하고 싶다면 이 기능을 활성화하면 된다
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
    assetPrefix: isProduction ? 'https://cdn.somewhere.com' : undefined
}