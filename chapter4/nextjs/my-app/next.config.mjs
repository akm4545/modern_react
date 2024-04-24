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
