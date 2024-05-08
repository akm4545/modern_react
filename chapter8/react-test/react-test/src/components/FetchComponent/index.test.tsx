// 다음과 같이 fetch를 모킹했다고 가정
jest.spyOn(window, 'fetch').mockImplementation(
    jest.fn(() =>
        Promise.resolve({
            ok:true,
            status: 200,
            json: () => Promise.resolve(MOCK_TODO_RESPONSE),
        }),
    ) as jest.Mock, //실제로 정확하게 fetch를 모킹하려면 많은 메서드를 구현해야 하지만 여기서는 간단하게 json만 구현하고 어설션으로 간단하게 처리
)