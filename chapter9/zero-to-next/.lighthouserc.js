module.exports = {
    ci: {
        collect: {
            // 분석 대상
            url: ['http://localhost:3000'],
            // 다섯번 실행 분석
            collect: {
                numberOfRuns: 5,
            },
        },
        upload: {
            // 서버 실행
            startServerCommand: 'npm run start',
            // 임시 저장소에 업로드해 분석
            target: 'temporary-public-storage',
        },
    },
}