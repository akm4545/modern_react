import { AppProps, NextWebVitalsMetric } from 'next/app'

export function reportWebvitals(metric: NextWebVitalsMetric) {
    // eslint-disable-next-line no-console
    console.log(metric)
}

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />
}

export default MyApp