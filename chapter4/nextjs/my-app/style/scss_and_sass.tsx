// sass 패키지 npm install --save-dev sass 명령어로 설치
// scss에서 제공하는 variable을 컴포넌트에서 사용하고 싶다면 export 문법 사용

// primary 변수에 blue라는 값을 넣는다
// css 파일
$primary: blue;

:export{
    primary: $primary;
}

// 컴포넌트 파일
import styles from "./Button.module.css"

export function Button(){
    return (
        // Styles.primary 형태로 꺼내올 수 있다 
        <span style={{color: styles.primary}}>
            안녕하세요
        </span>
    );
}

