// 로딩중일 때 바뀔 상태 객체
const loadingState = {
	loading: true,
	data: null,
	error: null,
}
const loading = (data) => ({
	loading: true,
	data,
	error: null,
})

// 성공했을 때의 상태 만들어주는 함수
const success = (data, error) => ({
	loading: false,
	data,
	error,
})

// 실패했을 때의 상태 만들어주는 함수
const error = (err, data) => ({
	loading: false,
	data,
	error: err,
})

// 세가지 액션을 처리하는 리듀서를 만들어줍니다
// type 은 액션 타입, key 는 리듀서서 사용할 필드 이름입니다 (예: user, users)
export function createAsyncHandler(type, key) {
	// 성공, 실패에 대한 액션 타입 문자열을 준비합니다.
	const SUCCESS = `${type}_SUCCESS`
	const ERROR = `${type}_ERROR`

	// 함수를 새로 만들어서
	function handler(state, action) {
		switch (action.type) {
			case type:
				return {
					...state,
					[key]: state[key]?.data ? loading(state[key].data) : loadingState,
				}
			case SUCCESS:
				return {
					...state,
					[key]: success(action.data, action.error),
				}
			case ERROR:
				return {
					...state,
					[key]: error(action.error, action.data),
				}
			default:
				return state
		}
	}

	// 반환합니다
	return handler
}
