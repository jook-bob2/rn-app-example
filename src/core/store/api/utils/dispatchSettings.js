// 서버 사이드 렌더링 또는 정적 생성을 할 경우 context API에 데이터를 주입 시키기 위한 함수
export function setPreRenderDispatch({ type, dispatch, response, initData }) {
	// dispatch 검증
	if (typeof dispatch !== 'function') throw new Error('Dispatch is not a function')

	// 성공여부에 따른 dispatch 실행
	!response.success
		? dispatch({
				type: `${type}_ERROR`,
				error: response,
				data: initData,
		  })
		: dispatch({ type: `${type}_SUCCESS`, data: response, error: null })
}

// 컴포넌트 Unmount 시 데이터를 초기화 시켜줌.
export function setUnmountDispatch({ type, dispatch, response }) {
	// dispatch 검증
	if (typeof dispatch !== 'function') throw new Error('Dispatch is not a function')

	dispatch({ type: `${type}_SUCCESS`, data: response, error: null })
}
