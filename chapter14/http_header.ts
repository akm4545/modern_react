{
    // HTTP 보안 헤더란 브라우저가 렌더링하는 내용과 관련된 보안 취약점을 미연에 방지하기 위해 
    // 브라우저와 함께 작동하는 헤더를 의미한다 이는 웹사이트 보안에 가장 기초적인 부분으로 HTTP 보안 헤더만 효율적으로
    // 사용할 수 있어도 많은 보안 취약점을 방지할 수 있다
}

{
    // Strict-Transport-Security
    // HTTP의 Strict-Transport-Security 응답 헤더는 모든 사이트가 HTTPS를 통해 접근해야 하며 
    // 만약 HTTP로 접근하는 경우 이러한 모든 시도는 HTTPS로 변경되게 한다
    // 사용법
    Strict-Transport-Security: max-age=<expire-time>; includeSubDomains

    // <expire-time>은 이 설정을 브라우저가 기억해야 하는 시간을 의미하며 초 단위로 기록
    // 이 기간 내에는 HTTP로 사용자가 요청한다 하더라도 브라우저는 이 시간을 기억하고 있다가 자동으로 HTTPS로 요청하게 된다
    // 만약 헤더의 이 시간이 경과하면 HTTP로 로드를 시도한 다음에 응답에 따라 HTTPS로 이동하는 등의 작업을 수행

    // 만약 이 시간이 0으로 돼 있다면 헤더가 즉시 만료되고 HTTP로 요청하게 된다
    // 일반적으로 1년 단위로 적용하지만 권장값은 2년이다
    // includeSubDomains가 있을 경우 이러한 규칙은 모든 하위 도메인에도 적용된다
}

{
    // X-XSS-Protection
    // 비표준 기술로 현재 사파리와 구형 브라우저에서만 제공되는 기능
    // XSS취약점이 발견되면 페이지 로딩을 중단하는 헤더 
    // Content-Security-Policy가 있다면 그다지 필요 없지만 구형 브라우저에서는 사용이 가능하다
    // 그러나 이 헤더를 전적으로 믿어서는 안되며 반드시 페이지 내부에서 XSS에 대한 처리가 존재하는 것이 좋다
    //X-XSS-Protection: 0
    //X-XSS-Protection: 1
    //X-XSS-Protection: 1; mode=block
    //X-XSS-Protection: 1; report=<reporting-url>

    // 0은 XSS 필터링을 끈다
    // 1은 기본값으로 XSS필터링을 켜게 된다 만약 XSS 공격이 페이지 내부에서 감지되면 XSS 관련 코드를 제거한 안전한 페이지를 보여준다
    // 1; mode=block은 1과 유사하지만 코드를 제거하는 것이 아니라 아예 접근 자체를 막아버린다
    // 1; report=<reporting-url>는 크로미움 기반 브라우저에서만 작동하며 XSS 공격이 감지되면 보고서를 rport=쪽으로 보낸다
}

{
    // X-Frame-Options
    // 페이지를 frame, iframe, embed, object 내부에서 렌더링을 허용할지를 나타낼 수 있다
    // 예를 들어 네이버와 비슷한 주소를 가진 페이지가 있고 이 페이지에서 네이버를 iframe으로 렌더링한다고 가정했을 때
    // 사용자는 이 페이지를 진짜 네이버로 오해할 수 있고 공격자는 이를 활용해 사용자의 개인정보를 탈취할 수 있다
    // X-Frame-Options는 외부에서 자신의 페이지를 위와 같은 방식으로 삽입되는 것을 막아주는 헤더다

    export default function App(){
        return (
            <div className="App">
                <iframe src="https://www.naver.com" />
            </div>
        )
    }

    // 해당 코드는 정상적으로 노출되지 않는다
    // 네이버에 X-Frame-Options: deny 옵션이 있기 때문이다
    X-Frame-Options: DENY
    X-Frame-Options: SAMEORIGIN

    // DENY: 만약 위와 같은 프레임 관련 코드가 있다면 무조건 막는다
    // SAMEORIGIN: 같은 origin에 대해서만 프레임을 허용한다
}

{
    // Permissions-Policy
    // 웹사이트에서 사용할 수 있는 기능과 없는 기능을 명시적으로 선언하는 헤더
    // 개발자는 다양한 브라우저의 기능이나 API를 선택적으로 활성화하거나 필요에 따라서는 비활성화할 수도 있다
    // 여깃 ㅓ말하는 기능이란 카메라나 GPS와 같이 브라우저가 제공하는 기능을 말한다

    // 예를 들어 브라우저에서 사용자의 위치를 확인하는 기능(geolocation)과 관련된 코드를 전혀 작성하지 않았다고 가정 시
    // XSS공격 등으로 인해 이 기능을 취득해서 사용하게 되면 사용자의 위치를 획득할 수 있게 된다
    // 그래서 이 헤더를 활용해 혹시 XSS가 발생한다고 하더라도 사용자에게 미칠 수 있는 악영향을 제한할 수 있게 된다

    // XSS를 사용하는 예제 헤더
    // 모든 geolocation 사용을 막는다
    Permissions-Policy: geolocation=()

    // getlocation을 페이지 자신과 몇 가지 페이지에 대해서만 허용
    Permissions-Policy: geolocation=(self "https://a.yceffort.kr", "https://b.yceffort.kr")

    // 카메라는 모든 곳에서 허용한다
    Permissions-Policy: camera=*;

    // pip 기능을 막고 geolocation은 자신과 특정 페이지만 허용하며
    // 카메라는 모든 곳에서 허용한다
    Permissions-Policy: picture-in-picture=(), geolocation=(self https://yceffort.kr), camera=*;
}

{
    // X-Content-Type-Options
    // MIME
    // Multipurpose Internet Mail Extension의 약자
    // Content-type의 값으로 사용
    // 원래 메일을 전송할 때 사용하던 인코딩 방식으로 현재는 Content-type에서 대표적으로 사용되고 있다
    // 네이버에서는 www.naver.com을 Content-Type: text/html; charset=UTF-8로 반환해 브라우저가 이를 UTF-8로 인코딩된 text/html로 인식할 
    // 수 있게 도와주고 브라우저는 이 헤더를 참고해 해당 파일에 대해 HTML을 파싱하는 과정을 거치게 된다

    // X-Content-Type-Options는 Content-type 헤더에서 제공하는 MIME 유형이 브라우저에 의해 임의로 변경되지 않게 하는 헤더다
    // 즉 Content-type: text/css 헤더가 없는 파일은 브라우저가 임의로 CSS로 사용할 수 없으며 Content-type: text/javascript나 
    // Content-type: application/javascript 헤더가 없는 파일은 자바스크립트로 해석할 수 없다
    // 웹서버가 브라우저에 강제로 이 파일을 읽는 방식을 지정하는 것이 이 헤더다

    // 예를 들어 어떠한 공격자가 .jpg 파일을 웹서버에 업로드했는데 실제로 이 파일은 그림 관련 정보가 아닌 스크립트 정보를 담고 있다고 가정한다면
    // 브라우저는 .jpg로 파일을 요청했지만 실제 파일 내용은 스크립트인 것을 보고 해당 코드를 실행할 수도 있다
    // 이 경우 다음과 같은 헤더를 설정해 두면 파일의 타입이 CSS나 MIME이 text/css가 아닌 경우, 혹은 파일 내용이 script나 MIME 타입이 자바스크립트 
    // 타입이 아니면 차단하게 된다
    X-Content-Type-Options: nosniff
}

{
    // Referrer-Policy
    // HTTP 요청에는 Referer 헤더가 존재하는데 이 헤더에는 현재 요청을 보낸 페이지의 주소가 나타난다
    // 만약 링크를 통해 들어왔다면 해당 링크를 포함하고 있는 페이지 주소가, 다른 도메인에서 요청을 보낸다면 해당 리소스를 사용하는 
    // 페이지의 주소가 포함된다

    // 이 헤더는 사용자가 어디서 와서 방문 중인지 인식할 수 있는 헤더지만 반대로 사용자 입장에서는 원치 않는 정보가 노출될 위험도 존재한다
    // Referrer-Policy 헤더는 이 Referer헤더에서 사용할 수 있는 데이터를 나타낸다

    // Referer와 Referrer-Policy 의 Referrer의 철자가 다른 이유는 Referer라는 오타가 이미 표준으로 등록된 이후에 뒤늦게 오타임을 발견했기 때문

    // 출처(origin)과 이를 구성하는 용어
    // https://yceffort.kr 주소의 출처
    // scheme: HTTPS 프로토콜을 의미
    // hostname: yceffort.kr 이라는 호스트명을 의미
    // port: 443 포트를 의미
    // 위의 3개의 조합을 출처라고 한다

    // 그리고 두 주소를 비교할 때 same-origin인지 cross-origin인지는 다음과 같이 구분할 수 있다
    // https://yceffort.kr:443 기준

    // https://fake.kr:443 cross-origin 도메인이 다르다
    // https://www.yceffort.kr:443 cross-origin 서브 도메인이 다르다
    // https://blog.yceffort.kr:443 cross-origin 서브 도메인이 다르다
    // http://yceffort.kr:443 cross-origin scheme이 다르다
    // http://yceffort.kr:80 cross-origin port가 다르다
    // https://yceffort.kr:443 same-origin 완전히 같다
    // https://yceffort.kr same-origin 명시적인 포트가 없지만 HTTPS의 기본 포트인 443으로 간주한다

    // Referrer-Policy는 응답 헤더뿐만 아니라 페이지의 <meta/>태그로도 다음과 같이 설정할 수 있다
    <meta name="referrer" content="origin" />

    // 페이지 이동시나 이미지 요청, link 태그 등에도 다음과 같이 사용할 수 있다
    <a href="http://yceffort.kr" referrerpolicy="origin">...</a>

    // 구글에서는 이용자의 개인정보 보호를 위해 strict-origin-when-cross-origin 혹은 그 이상을 명시적으로 선언해 둘 것을 권고한다
    // 만약 이 값이 설정돼 있지 않다면 브라우저의 기본값으로 작동하게 되어 웹사이트에 접근하는 환경별로 다른 결과를 만들어 내어 
    // 혼란을 야기할 수 있으며 이러한 기본값이 없는 구형 브라우저에서는 Referer 정보가 유출될 수도 있다
    // 옵션은 찾아보자
}

{
    // Content-Security-Policy
    // 콘텐츠 보안 정책(Content-Security-Policy, 이하 CSP)은 XSS 공격이나 데이터 삽입 공격과 같은 다양한 보안 위협을 막기 위해 설계
    
    // 대표적인 지시문 예
    // *-src
    // font-src, img-src, script-src 등 다양한 src를 제어할 수 있는 지시문
    Content-Security-Policy: font-src <source>;
    Content-Security-Policy: font-src <source> <source>;

    // 위와 같이 선언해 두면 font의 src로 가져올 수 있는 소스를 제한할 수 있다 
    // 여기에 선언된 font 소스만 가져올 수 있으며 이 외의 소스는 모두 차단된다

    Content-Security-Policy: font-src https://yceffort.kr/;

    // 위와 같은 응답 헤더를 반환했다면 다음 폰트는 사용할 수 없다
    <style>
        @font-face{
            font-family: 'Noto Snas KR';
            ...
            src: URL(https://fonts.gstatic.com/s/notosanskr....)
        }
    </style>

    // 비슷한 유형의 지시문
    // script-src: <script>의 src
    // style-src: <style>의 src
    // font-scr: <font>의 src
    // img-src: <img>의 src
    // connect-src: 스크립트로 접근할 수 있는 URL을 제한한다 <a>태그에서 사용되는 ping, XMLHttpRequest나 fetch의 주소 
    // 웹소켓의 EventSource, Navigator, sendBeacon()등이 포함
    // worker-src: Worker의 리소스
    // object-src: <object>의 data, <embed>의 src, <applet>의 archive
    // media-src: <audio>와 <video>의 src
    // manifest-src: <link rel="manifest" />의 href
    // frame-src: <frame>과 <iframe>의 src
    // prefetch-src: prefetch의 src
    // child-src: Worker 또는 <frame>과 <iframe>의 src

    // 만약 해당 -src가 선언돼 있지 않다면 default-src로 한 번에 처리할 수도 있다
    Content-Security-Policy: default-src <source>;
    Content-Security-Policy: default-src <source> <source>;

    // default-src는 다른 여타 *-src에 대한 폴백 역할을 한다 만약 *-src에 대한 내용이 없다면 이 지시문을 사용하게 된다

    // form-action은 폼 양식으로 제출할 수 있는 URL을 제한할 수 있다
    // 다음과 같이 form-action 자체를 모두 막아버리는 것도 가능하다
    <meta http-equiv="Content-Security-Policy" content="form-action 'none'" />
    export default function App() {
        function handleFormAction() {
            alert('form action!')
        }

        return (
            <div>
                <form action={handleFormAction} method="post">
                    <input type="text" name="name" value="foo" />
                    <input type="submit" id="submit" value="submit" />
                </form>
        )
    }

    // 이 컴포넌트에서 submit을 누르면 에러 메시지가 출력되면서 작동하지 않는다
}

{
    // 보안 헤더 설정하기
    // Next.js
    // 애플리케이션 보안을 위해 HTTP 경로별로 보안 헤더를 적용할 수 있다
    // 이 설정은 next.config.js에서 다음과 같이 추가할 수 있다
    const securityHeaders = [
        {
            key: 'key',
            value: 'value',
        },
    ]

    module.exports = {
        async headers() {
            return [
                {
                    // 모든 주소에 설정한다
                    source: '/:path*',
                    headers: securityHeaders,
                }
            ]
        }
    }

    // 설정 가능한 값
    // X-DNS-Prefetch-Control
    // Strict-Transport-Security
    // X-XSS-Protection
    // X-Frame-Options
    // Permissions-Policy
    // X-Content-Type-Options
    // Referrer-Policy
    // Content-Security-Policy: 지시어가 굉장히 많디 때문에 다음과 같이 개별적으로 선언한 이후에 묶어주는 것이 더 편리하다
    const ContentSecurityPolicies = [
        {key: 'default-src', value: "'self'"},
        {key: 'script-src', value: "'self' example.com"},
    ]

    const securityHeaders = [
        {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicies.map(
                (item) => `${item.key} ${item.value}`,
            ).join(' '),
        },
    ]


    // NGINX
    // 정적인 파일을 제공하는 NGINX의 경우 다음과 같이 경로별로 add_header 지시자를 사용해 원하는 응답 헤더를 추가할 수 있다
    location / {
        # ...
        add_header X-XSS-Protection "1; mode=block";
        add_header Content-Security-Policy "default-src 'self'; script-src 'self'; child-src e_m; style-src 'self' example.com; font-src 'self';";
        # ...
    }
}

{
    // 보안 헤더 확인하기
    // https://securityheaders.com/을 방문하여 헤더를 확인하고 싶은 웹사이트의 주소를 입력하면 보안 헤더 상황을 알 수 있다
}