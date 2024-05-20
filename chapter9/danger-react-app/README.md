Dependabot을 취약점 해결
의존성에 숨어 있는 잠재적인 위협을 깃허브를 통해 확인하고 조치

해당 애플리케이션은 2019년 쯤에 만들어진 그 당시 최신 라이브러리를 활용해 구성
package.json을 기준으로 설치하면 각종 vulnerabilities를 발견했다는 메시지가 나온다
원격 저장소에 푸시하면 Dependabot이 저장소의 의존성에 여러 문제가 있다고 알려준다 
배너의 See Dependabot alerts를 누르면 구체적으로 어떤 의존성에 문제가 있는지 확인할 수 있다

깃허브의 Dependabot은 취약점을 Critical, High, Moderate, Low의 4단계로 구분한다

해당 애플리케이션에 Critical 등급의 약점이 두 개가 있다
Improper Neutralization of Special Elements used in a Command in Shell-quote안에 들어가면 

1. 취약점을 발견한 파일의 경로
dependencies에 직접 명시한 경우 package.json이 발견되는 경우도 있으며 dependencies가 의존하고 있는 패키지에서 발견되는 경우 lock 파일이 명시

2. 취약점을 바로 수정할 수 있는 경우 표시되는 버튼
Dependabot은 단순히 패키지의 취약점 검사 뿐만이 아니라 취약점을 수정할 수 있다면 풀 리퀘스트도 생성

3. 보안 취약점의 심각도 
CVE란 Common Vulnerabilities and Exposures의 약자로 공개적으로 알려진 컴퓨터 보안 결함 목록을 나타낸다 CVE란 미국 국토안보부 산하의 사이버 보안 및 보안국의 재정 지원을 받아 MITRE Corporation에서 감독 

4. 취약점의 자세한 정보
어떤 패키지가 취약점으로 지정됐는지, 현재 사용 중인 버전은 무엇이며, 어떤 버전을 설치해야 해결할 수 있는지, 그리고 해당 취약점이 발생하는 상황과 조심해야 할 것들을 나타낸다

이 취약점은 shell-quote 패키지 1.7.2 버전 이하에서 발견할 수 있는 취약점으로 공격자가 윈도우 드라이브 문자(C, D)를 지원하도록 설계된 정규식을 통해 이스케이프되지 않은 셸 문자의 주입을 허용하는 취약점이 존재

package.json을 살펴보면 직접적으로 문제가 되는 shell-quote를 설치해서 사용하는 곳은 없다
대부분의 의존성은 package.json 보다는 package-lock.json에 숨어 있는 경우가 많다
패키지가 어디에 설치돼 있는지 확인해 보려면 npm ls shell-quote 명령어를 사용하면 된다

하지만 취약점이 존재한다 하더라도 취약점이 발생하는 시나리오로 사용하지 않으면 문제가 없는 경우도 있다
browserslist의 정규 표현식 취약점은 browserslist의 인수로 잘못된 정규식을 넣는다면 애플리케이션이 기하급수적으로 느려지는 ReDos가 있다는 것인데
리액트 프로젝트에서 browserslist를 작성할 수 있는 건 개발자뿐이므로 개발자 본인의 악의적인 목적으로 정규식을 넣어서 본인의 서비스를 느리게 하지 않는 이상 실제 위협이 될 수는 없다

axios의 경우 내부의 follow-redirects 패키지가 존재하며 follow-redirects의 경우 axios 0.19.2에서 1.5.10으로 완전히 고정돼 있어서 단순히 
follow-redirects의 버전 업그레이드로는 해결이 안된다 
그래서 해당 취약점의 풀 리퀘스트 제안은 axios를 1.5.10 버전으로 업그레이드 하는 것이다

axios를 업그레이드 하는 것인데 버전이 올라감에 있어 호환성이 깨지는 변경 사항이 예상되므로 꼭 axios를 사용하는 코드를 반드시 꼼꼼히 확인해 봐야 한다

다음 취약점으로 minimatch가 있는데 이 라이브러리는 glob 표현식을 자바스크립트 정규식으로 변경하기 위해 사용된다 
해당 라이브러리는 ReDos로 인한 취약점이 있고 이를 3.0.5 버전 이상으로 올려야만 해결된다고 나와 있다

npm ls minimatch를 입력하여 어디에 어떤 버전을 사용하는지 살펴본다
3.0.4로 지정돼 있는 버전 표현식의 수 버전을 올려서 대응하면 된다 유의적 버전에 따르면 수 버전을 올리는 것은 단순 패치 수정일 것으므로 올려도 기능상에 큰 문제는 없다

패키지 내부에 선언된 의존성을 강제로 올릴 수 있는 방법은 npm이 제공하는 overrides를 활용하는 것이다
package.json overrides를 선언해 두면 패키지 내부의 버전을 강제로 올릴 수 있다
{
    "overrides": {
        "minimatch": "^3.0.5"
    }
}

이는 내부 의존성에 사용하고 있는 모든 minimatch의 버전을 강제로 ^3.0.5로 덮어쓰라는 의미다