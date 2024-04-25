// button.module.css 사용 예제
import styles from './Button.module.css'

export function Button(){
    return (
        <button type="button" className={styles.alert}>
            경고!
        </button>
    )
}

// HTML 결과
{/* <head> */}
    {/* 생략 */}
    {/* 실제 프로덕션 빌드 시에는 스타일 태그가 아닌 별도 CSS 파일로 생성 */}
    {/* <style>
        .Button_alert_62TGU {
            color: red;
            font-size: 16px;
        }
    </style>
</head>
<button type="button" class="Button_alert_62TGU">경고!</button> */}