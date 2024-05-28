{
    // create-react-app을 통해 프로젝트를 생성하면 아래와 같은 파일이 생성된다
    //reportWebvital.ts
    import { ReportHandler } from 'web-vitals'

    const reportWebVitals = (onPerfEntry?: ReportHandler) => {
        if(onPerfEntry && onPerfEntry instanceof Function) {
            import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                getCLS(onPerfEntry)
                getFID(onPerfEntry)
                getFCP(onPerfEntry)
                getLCP(onPerfEntry)
                getTTFB(onPerfEntry)
            })
        }
    }

    export default reportWebVitals

    // ...

    // index.tsx
    reportWebVitals()


    // reportWebVitals 함수는 웹에서 성능을 측정하기 위한 함수
    // 이름에서도 알 수 있듯이 각각
    // 누적 레이아웃 이동(CLS), 최초 입력 지연(FID), 최초 콘텐츠풀 페인트(FCP), 최대 콘텐츠 페인팅(LCP), 첫 바이트까지의 시간(TTFB)을 측정하는 용도
    // 이러한 지표 측정은 web-vitals 라이브러리 덕분
    // 자바스크립트 수준의 라이브러리가 브라우저의 웹페이지 성능을 측정할 수 있는 이유는 PerfomanceObserver라는 API를 사용하기 때문 
    // PerfomanceObserver는 웹페이지에서 다양한 성능을 측정할 수 있도록 도와주는 API로 브라우저에서 웹페이지의 성능을 측정하기 위해 사용
    // 이 API를 제공하지 않는 브라우저에서는 web-vitals의 도움을 받아 성능을 측정하기 어렵다
    // ReportHanlder는 단순히 성능 객체인 Metric을 인수로 받는 함수 타입으로 Metric을 원하는 대로 다룰 수 있다 
    // 즉 단순히 콘솔에 출력하는 것뿌만 아니라 서버로 전송하는 등의 자업을 할 수 있다
}

{
    // 단순히 console.log로 기록하면 브라우저의 콘솔 창에 기록하는 용도로밖에 활용할 수 없다
    // 만약 실제로 서버 등 어딘가에 기록하고 싶다면 소량의 분석용 데이터를 전송하기 위해 만들어진 sendBeacon API나 fetch 등의 API를 
    // 사용해 힘의의 서버로 정보를 보내거나 구글 애널리틱스로 보낼 수도 있다
    function sendToAnalytics(metric: ReportHandler) {
        const body = JSON.stringify(metric)
        const url = '/api/analytics' //지표 정보를 보낼 위치

        // sendBeacon이 없다면 fetch를 사용해 보낸다
        if(navigator.sendBeacon){
            navigator.sendBeacon(url, body)
        } else{
            // fetch나 axios 등을 사용해 보낸다
            fetch(url, { body, method: 'POST', keepalive: true })
        }
    }

    reportWebVitals(sendToAnalytics)

    function sendToAnalytics({ id, name, value }: ReportHandler){
        //https://support.google.com/analytics/answer/11150547?hl=en
        ga('send', 'event', {
            eventCategory: 'Web Vitals',
            eventAction: name,
            eventValue: Math.round(name === 'CLS' ? value * 1000 : value), //정수로 보낸다
            eventLabel: id,
            nonInteraction: true,
        })
    }

    reportWebVitals(sendToAnalytics)
}

{
    // nextjs 에서는 성능 측정 메서드인 NextWebVitalsMetric을 제공한다 

    // _app
    import { AppProps, NextWebVitalsMetric } from 'next/app'

    // @description 메트릭을 측정한다
    // export declare type NextWebVitalsMetric = {
    //     id: string;
    //     startTime: number;
    //     value: number;
    // } & ({
    //     label: 'web-vital';
    //     name: 'FCP' | 'LCP' | 'CLS' | 'FID' | 'TTFB' | 'INP';
    // } | {
    //     label: 'custom';
    //     name: 'Next.js-hydration' | 'Next.js-route-change-to-render' | 'Next.js-render';
    // }) 

    export function reportWebvital(metric: NextWebVitalsMetric) {
        console.log(metric)
    }

    function MyApp({ Component, pageProps }: AppProps) {
        return <Component {...pageProps}></Component>
    }

    export default MyApp

    // 핵심 웹 지표 외에도 Next.js에 특화된 사용자 지표도 제공
    // Next.js-hydration: 페이지가 서버 사이드에서 렌더링되어 하이드레이션하는 데 걸린 시간
    // Next.js-route-change-to-render: 페이지가 경로를 변경한 후 페이지 렌더링을 시작하는 데 걸린 시간
    // Next.js-render: 경로 변경이 완료된 후 페이지를 렌더링하는 데 걸린 시간

    // 모든 단위는 밀리초(ms)다
}