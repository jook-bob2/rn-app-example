/*
 * context api 상태 초기 값
 */
export const initialAsyncState = {
	loading: false,
	data: null,
	error: null,
}

/*
 * 서버 기본 응답 값
 */
export const initialResponse = {
	success: false,
	code: '',
	msg: '',
}

/*
 * 페이징 처리용 초기 상태 값
 */
export const initialPageState = {
	...initialAsyncState,
	data: {
		...initialResponse,
		data: { totalElements: 0, totalPages: 0, size: 10, content: [] },
	},
}

/*
 * 일반 리스트용 초기 상태 값
 */
export const initialListState = {
	...initialAsyncState,
	data: {
		...initialResponse,
		data: [],
	},
}
