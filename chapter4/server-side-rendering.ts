{
    // 싱글 페이지 애플리케이션(Single Page Application: SPA) 
    // 렌더링과 라우팅에 필요한 대부분의 기능을 서버가 아닌 브라우저 자바스크립트에 의존하는 방식
    // 최초의 첫 페이지에서 데이터를 모두 불러온 이후에는 페이지 전환을 위한 모든 작업이 자바스크립트와 브라우저의 history.pushState와
    // history.replaceState로 이뤄지기 때문에 페이지를 불러온 이후에는 서버에서 HTML을 내려받지 않고 하나의 페이지에서 모든 작업을 처리한다
    // 이러한 작동 방식은 최초에 로딩해야 할 자바스크립트 리소스가 커지는 단점이 있지만 한번 로딩된 이후에는 서버를 거쳐 필요한
    // 리소스를 받아올 일이 적어지기 때문에 사용자에게 훌륭한 UI/UX를 제공한다는 장점이 있다
}

{
    // 전통적인 방식의 애플리케이션
    // 과거 서버 사이드에서 작동하던 방식은 페이지 전환이 발생할 때마다 새롭게 페이지를 요청하고 HTML페이지를 다운로드해 파싱하는 작업을 거친다
    // 이 과정은 페이지를 처음부터 새로 그려야 해서 일부 사용자는 페이지가 전환될 때 부자연스러운 모습을 보게 된다
}

{
    // 싱글 페에지 렌더링 방식의 유행과 JAM 스택
    // 싱글 페이지 애플리케이션 즉 클라이언트 사이드 라우팅이 널리 퍼지게 된 것은 단순히 사용자에게 좀 더 멋진 UX를 제공하는 것 뿐만이 아니다
    // PHP 시정 웹 애플리케이션을 만들기 위해서는 자바스크립트 외에 신경 쓸 것이 많았지만 싱글 페이지 애플리케이션에서는 단지 부라우저 
    // 내부에서 작동하는 자바스크립트만 잘 작성하면 문제없다
    // 즉 프론트엔드 개발자들에게 좀 더 간편한 개발 경험을 제공했고 더욱 간편하게 웹 애플리케이션을 만들 수 있다는 장점이 있다

    // 기존의 웹 개발은 LAMP 스택 (Linux/운영체제, Apache/서버, MySQL/데이터베이스, PHP/Python/웹 프레임워크)로 구성돼 있었다
    // 자바스크립트에서 할 수 있는 일이 제한적이었기 떄문에 대부분의 처리를 서버에서 해야만 했다
    // 이런 서버 의존적인 문제는 웹 애플리케이션의 확장성에도 걸림돌로 작용했는데 
    // 웹 애플리케이션의 기능이 다양해지거나 사용자가 늘어나면 이와 동시에 서버도 확장해야 했지만 당시 클라우드의 개념이 부족하여 서버 확장이 매우 번거로웠다

    // 다양한 자바스크립트 프레임워크의 등장으로 등장한것이 바로 JAM(JavaScript, API, Markup) 스택이다
    // 대부분의 작업을 자바스크립트에서 수행할 수 있었기 때문에 프론트엔드는 자바스크립트와 마크업(HTML, CSS)을 미리 빌드하여 정적으로 제공하면 
    // 이후 작동은 클라이언트에서 실행되므로 서버 확장성 문제에서 좀 더 자유로워질 수 있게 됐다
    // 이러한 JAM스택의 인기와 Node.js의 고도화에 힘입어 MEAN(MongoDB, Express.js, AngularJS, Node.js)이나
    // MERN(MongoDB, Express.js, React, Node.js) 스택처럼 아예 API 서버 자체도 자바스크립트로 구현하는 구조가 인기를 끄기 시작했다
}

{
    // 새로운 패러담임의 웹서비스를 향한 요구
    // 인터넷 속도와 하드웨어 성능이 발전하여 웹 페이지를 불러오는데 필요한 부담을 일정 부분 사용자에게 전가하더라도 괜찮을 것이라는 기대감이 팽배했다
    // 그리하여 웹 애플리케이션에서 제공하는 자바스크립트 리소스의 크기와 수가 모두 증가하기 시작했다
    // 하지만 모바일에서 사용자가 상호작용할 수 있을 떄까지 대기해야 하는 평균 시간이 12초고 모든 컨텐츠 로딩에 소요되는 시간은 약 18초로 
    // 사용자들은 생각보다 많은 시간을 웹사이트 로딩에 소비해야 한다
    // 사용자의 기기와 인터넷 속도 등 웹 전반을 이루는 환경이 크게 개선됐음에도 실제 사용자들이 느끼는 웹 애플리케이션의 로딩 속도는 
    // 5년 전과 크게 차이가 없거나 오히려 더 느려졌다
}

{
    // 서버 사이드 렌더링
    // 최초에 사용자에게 보여줄 페이지를 서버에서 렌더링해 빠르게 사용자에게 화면을 제공하는 방식
    // 싱글 페이지 와 서버 사이드의 차이점은 렌더링의 책임을 어디에 두느냐다
    // 서버 사이드 렌더링은 서버에서 제공하기 때문에 비교적 안정적인 렌더링이 가능하다
}

{
    // 서버 사이드 렌더링의 장점
    // 1. 최초 페이지 진입이 비교적 빠르다
    // 사용자가 최초 페이지에 진입했을 때 페이지에 유의미한 정보가 그려지는 시간(First Contentful Paint)이 더 빨라질 수 있다
    // 최초 화면에 표시할 정보가 외부 API 호출에 많이 의지한다고 가정하면
    // 싱글 페이지의 경우 사용자가 해당 페이지 진입 -> 자바스크립트 리소스 다운 -> HTTP 요청 수행 -> 응답 결과를 가지고 화면 렌더링 순으로 이루어진다
    // 이런 작업이 서버에서 이뤄진다면 한결 빠르게 렌더링될 수 있다
    // 일반적으로 서버에서 HTTP 요청을 수행하는 것이 더 빠르고 HTML 렌더링도 해당 HTML을 문자열로 미리 그려서 내려주는 것이 클라이언트에서 기존 HTML에 삽입하는 것보다 더 빠르다
    // 모든 경우에 서버 사이드 렌더링이 초기 페이지 렌더링에 비해 이점을 가진다고 볼 수 없지만 화면 렌더링이 HTTP 요청에 의존적이거나 헨더링해야 할 HTML
    // 의 크기가 커진다면 상대적으로 서버 사이드 렌더링이 더 빠를 수 있다
    // 서버가 렌더링에 필요한 충분한 리소스가 갖춰지지 않았다면 오히려 싱글 페이지 애플리케이션보다 느려질 수도 있다

    // 2. 검색 엔진과 SNS공유 등 메타데이터 제공이 쉽다
    // 검색 엔진이 사이트에 필요한 정보를 가져가는 과정
    // 1. 검색 엔진 로봇(머신)이 페이지에 진입
    // 2. 페이지가 HTML 정보를 제공해 로봇이 이 HTML을 다운로드 자바스크립트 코드는 실행하지 않는다
    // 3. 다운로드한 HTML 페이지 내부의 오픈 그래프(Open Graph)나 메타(meta) 태그 정보를 기반으로 페이지의 검색(공유)정보를 가져오고 이를 바탕으로 검색 엔진에 저장
    // 검색 엔진은 페이지의 정적인 정보를 가져오는 것이 목적이므로 자바스크립트를 다운로드하거나 실행할 필요가 없다
    // 싱글 페이지는 작동이 자바스크립트에 의존하는데 이러한 메타 정보 또한 마찬가지다
    // 페이지에 최초 진입시 이러한 메타 정보를 제공할 수 있도록 조치를 취하지 않는다면 검색엔진이나 SNS공유 시 불이익이 있을 수 있다
    // 서버 사이드 렌더링은 최초의 렌더링 작업이 서버에서 일어나 HTML 응답으로 제공할 수 있으므로 대응하기 매우 용이하다

    // 3. 누적 레이아웃 이동이 적다
    // 서버 사이드 렌더링은 누적 레이아웃 이동(Cumulative Layout Shift)을 줄일 수 있다
    // 누적 레이아웃 이동 = 사용자에게 페이지를 보여준 이후에 뒤늦게 어떤 HTML 정보가 추가되거나 삭제되어 마치 화면이 덜컥거리는 것과 같은
    // 부정적 사용자 경험 즉 사용자가 예상치 못한 시점에서 페이지가 변경되어 불편을 초해 하는것
    // 싱글 페이지 애플리케이션에서는 페이지 콘텐츠가 API 요청에 의존하고 API 요청의 응답 속도가 제각각이며 이를 적절히 처리해두지 않는다면
    // 이러한 누적 레이아웃 이동 문제가 발생할 수 있다
    // 누적 레이아웃 이동을 해결하기 위해 서버 사이드 렌더링을 사용한다 해도 이러한 문제에서 완전히 자유롭지 못하다
    // useEffect는 클라이언트에서 컴포넌트가 마운트된 이후에 실행되므로 서버 사이드나 싱글 페이지 모두 문제의 소지가 있다
    // 또한 API속도가 모두 달랐을 때 서버 사이드 렌더링에서는 모든 요청이 완료되기 전까지 페이지가 렌더링되지 않을 것이므로 최초 페이지 다운로드가 굉장히 느려질 수 있다

    // 4. 사용자 디바이스 성능에 비교적 자유롭다
    // 자바스크립트 리소스 실행은 사용자의 디바이스에서만 실행되므로 절대적으로 사용자 디바이스 성능에 의존적이다
    // 서버 사이드 렌더링은 이러한 부담을 서버에 나눌 수 있으므로 사용자의 디바이스 성능으로부터 조금 더 자유로워질 수 있다
    // 물론 이 또한 절대적인 것은 아니다
    // 인터넷 속도가 느리다면 어떠한 방법론을 쓰든 느릴 것이고 사용자 방문이 폭증해 서버에 부담이 가중된다면 그리고 이를 위한 적절한 처리가 수반돼 있지
    // 않다면 서버 사이드 렌더링도 충분히 느려질 수 있다

    // 5. 보안에 좀 더 안전하다
    // JAM 스택을 채택한 프로젝트의 공통된 문제점은 애플리케이션의 모든 활동이 브라우저에 노출된다는 것이다
    // API호출과 인증 같이 사용자에게 노출되면 안 되는 민감한 작업도 포함되므로 정상적인 비즈니스 로직을 거치지 않은 상황에서 인증이나 API가
    // 호출되는 것을 항상 방지할 준비가 돼 있어야 한다
    // 서버 사이드는 민감 작업을 서버에서 수행하고 그 결과만 브라우저에 제공해 이러한 보안 위협을 피할 수 있다
}

{
    // 서버 사이드 렌더링 단점
    // 1. 소스코드를 작성할 때 항상 서버를 고려해야한다
    // 브라우저 전역 객체인 window 또는 sessionStorage와 같이 브라우저에만 있는 전역 객체에 접근할 수 없다
    // window를 서버에서 접근한다면 window is not defined 라는 에러를 마주하게 된다
    // 서버에서 사용될 가능성이 있는 코드라면 window에 대한 접근을 최소화하고 불가피하면 서버 사이드에서 실행되지 않도록 처리해야한다
    // 외부 의존 라이브러리도 마찬가지다
    // 이러한 위험을 가진 코드를 모두 클라이언트에서 실행하는 것 또한 궁극적인 해결책이 되지 못한다
    // 클라이언트 실행 코드가 많을 수록 서버 사이드 렌더링의 장점을 잃는 셈이다

    // 2.적절한 서버가 구축돼 있어야 한다
    // 싱글 페이지나 정적 HTML 페이지는 단순히 HTML과 자바스크립트, CSS 리소스를 다운로드할 수 있는 준비만 하면 된다
    // 그러나 서버 사이드 렌더링은 말 그대로 사용자의 요청을 받아 렌더링을 수행할 서버가 필요하다
    // 서버 구축은 절대 쉬운 일이 아니다 
    // 사용자 요청에 맞게 물리적 가용량 확보, 장애 복구 전략, 요청 분산, 프로세스 다운에 대비한 PM2 와 같은 프로세스 매니저의 도움도 필요하다

    // 3. 서비스 지연에 따른 문제
    // 싱글 페이지 애플리케이션의 경우 느린 작업은 최초에 어떤 화면이라도 보여준 상태에서 로딩 중 과 같이 작업이 진행 중임을 적절히 안내한다면
    // 충분히 사용자가 기다릴 여지가 있다
    // 반면 서버 사이드 렌더링은 지연 시 사용자에게 보여줄 페이지에 대한 렌더링 작업이 끝나기까지는 사용자에게 그 어떤 정보도 제공할 수 없다
    // 다양한 요청에 얽혀있어 병목 현상이 심해진다면 때로는 서버 사이드 렌더링이 더 안 좋은 사용자 경험을 제공할 수도 있다
}

{
    // 서버 사이드 렌더링은 만능이 아니다
    // 작업이 모두 서버에서 이뤄진다고 해서 모든 성능 문제가 해결되는 것은 아니다
    // 잘못된 웹페이지 설계는 오히려 성능을 해칠 뿐만 아니라 눈에 띄는 성능 개선도 얻지 못하고 서버와 클라이언트 두 군데로 관리 포인트만 늘어나기만 하는
    // 역효과를 낳을 수도 있다
    // 사용자에게 제공하고 싶은 내용이 무엇인지, 어떤 우선순위에 따라 페이지의 내용을 보여줄지를 잘 설계하는 것이 중요하다
    // 웹페이지의 설계와 목적, 우선순위에 따라 싱글 페이지 애플리케이션이 더 효율적일 수도 있다
}

{
    // 서버 사이드 애플리케이션 / 싱글 페이지 애플리케이션

    // 가장 뛰어난 싱글 페이지 애플리케이션은 가장 뛰어난 멀티 페이지 애플리케이션보다 낫다
    // gmail과 같이 완성도가 매우 뛰어난 싱글 페이지 애플리케이션의 경우
    // 최초 진입 시 보여줘야 할 정보만 최적화해 요청해서 렌더링
    // 이미지와 같이 중요성이 떨어지는 리소스는 게으른 로딩으로 렌더링에 방해되지 않도록 처리
    // 코드 분할(code spliting, 사용자에게 필요한 코드만 나눠서 번들링하는 기법) 또한 칼같이 지켜서 불필요한 자바스크립트 릿스의 다운로드 및 실행 방지
    // 라우팅 발생시 변경이 필요한 HTML영역만 교체해 사용자의 피로감 최소화 
    // 멀티 페이지 애플리케이션 또한 마찬가지로 엄청난 최적화를 가미했다 하더라도 싱글 페이지 애플리케이션이 가진 브라우저 API와 자바스크립트를 활용한 라우팅
    // 기반으로 한 매끄러운 라우팅보다 뛰어난 성능을 보여줄 수는 없을 것이다

    // 평균적인 싱글 페이지 애플리케이션은 평균적인 멀티 페이지 애플리케이션보다 느리다
    // 멀티 페이지 애플리케이션은 매번 서버에 렌더링 요청을 하고 서버는 안정적인 리소스를 기반으로 매 요청마다 비슷한 성능의 렌더링을 수행
    // 싱글 페이지 애플리케이션은 렌더링과 라우팅에 최적화가 돼 있지 않다면 사용자 기기에 따라 성능이 들쭉 날쭉하고 멀티 페이지 애플리케이션 대비 
    // 성능이 아쉬울 가능성이 크다
    // 이러한 최적화는 매우 어렵다 페이지 전환 시에 필요한 리소스와 공통 리소스로 분류하고 이에 따른 다운로드나 렌더링 우선순위 전략을 잘 수립해
    // 서비스하기란 매우 어렵다
    // 따라서 평균적인 노력을 기울여 동일 서비스를 만든다면 서버에서 렌더링되는 멀티 페이지 애플리케이션이 더 우위에 있을 수 있다
    // 최근에는 멀티 페이지 애플리케이션에서 발생하는 라우팅으로 인한 문제를 해결하기 위한 다양한 API가 브라우저에 추가되고 있다

    // 페인트 홀딩(Paint Holding): 같은 출처(origin)에서 라우팅이 일어날 경우 화면을 잠깐 하얗게 띄우는 대신 이전 페이지의 모습을 잠깐 보여주는 기법
    // back forward cache(bfcache): 브라우저 앞으로 가기, 뒤로가기 실행 시 캐시된 페이지를 보여주는 기법
    // Shared Element Transitions: 페이지 라우팅이 일어났을 때 두 페이지의 동일 요소가 있다면 해당 콘텍스트를 유지해 부드럽게 전환되게 하는 기법

    // 이러한 기법 모두 싱글 페이지 애플리케이션에서 구현 가능한 것이지만 완벽하게 구현하려면 자바스크립트뿐만 아니라 CSS등의 도움을 받아야 하고 상당한 노력을 기울여햐 한다

    // 두 방법론 모두 상황에 따라 유효한 방벙이다
    // 싱글 페이지 애플리케이션이 제공하는 보일러플레이트나 라이브러리가 점차 완벽해지면서 잠재적인 모든 위험을 제거할 수도 있고
    // 멀티 페이지 애플리케이션이 브라우저 API의 도움을 받아 싱글 페이지 애플리케이션과 같은 끊김 없는 사용자 경험을 제공할 수도 있다
}

{
    // 현대의 서버 사이드 렌더링
    // 현대의 서버 사이드 렌더링은 LAMP 스택의 서버 사이드 렌더링 방식과는 조금 다르다
    // LAMP 스택은 모든 페이지 빌드를 서버에서 렌더링해 초기 페이지 진입이 빠르다는 장점이 있지만 이후에 라우팅이 발생할 때도 마찬가지로
    // 서버에 의존해야 하기 때문에 싱글 페이지 렌더링 방식에 비해 라우팅이 느리다
    // 요즘 서버 사이드 렌더링은 두 가지 장점을 모두 취한 방식으로 작동한다
    // 최초 진입시에는 서버 사이드 렌더링 방식으로 서버에서 완성된 HTML을 제공받고 이후 라우팅에서는 서버에서 내려받은 자바스크립트를 바탕으로
    // 마치 싱글 페이지 애플리케이션처럼 작동한다
    // 이러한 라우팅과 렌더링 방식을 이해하지 못하면 모든 페이지에서 서버 사이드 렌더링으로 작동하는 LAMP 스택과 다름없는 멀티 페이지 애플리케이션을 만들어버릴 수도
    // 혹은 서버에서 아무런 작동도 하지 않는 싱글 페이지 애플리케이션의 방식으로 잘못된 웹서비스를 만들어 버릴 수도 있다
    // 따라서 개발자는 서버에서의 렌더링, 클라이언트에서의 렌더링 모두 이해해야 두 가지 장점을 완벽하게 취하는 제대로 된 웹 서비스를 구축할 수 있다
}