// 이 함수는 파라미터로 액션의 타입 (예: GET_USER) 과 Promise 를 만들어주는 함수를 받아옵니다.
export function createAsyncDispatcher(type, promiseFn) {
	// 성공, 실패에 대한 액션 타입 문자열을 준비합니다.
	const SUCCESS = `${type}_SUCCESS`
	const ERROR = `${type}_ERROR`
	// 새로운 함수를 만듭니다.
	// ...rest 를 사용하여 나머지 파라미터를 rest 배열에 담습니다.
	async function actionHandler(dispatch, ...rest) {
		dispatch({ type }) // 요청 시작됨
		try {
			const data = await promiseFn(...rest) // rest 배열을 spread 로 넣어줍니다.

			// 예외가 발생할 경우 초기화 데이터를 넣어줌
			let initData = null
			let isInit = false
			if (rest.length > 0 && !data.success) {
				const newArr = [...rest]
				Object.values(newArr).forEach((a, i) => {
					Object.keys(a).forEach((b) => {
						isInit = b === 'initData' ? true : false
						initData = isInit ? newArr[i].initData : null
					})
				})
			}

			dispatch({
				type: SUCCESS,
				data: isInit ? initData : data,
				error: isInit ? data : null,
			}) // 성공함

			return Promise.resolve({ success: true, data })
		} catch (error) {
			dispatch({
				type: ERROR,
				error,
			}) // 실패함

			return Promise.reject({ success: false, data: error })
		}
	}

	return actionHandler // 만든 함수를 반환합니다.
}
