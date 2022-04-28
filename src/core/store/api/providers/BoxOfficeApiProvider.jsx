import React from 'react'
import { initialAsyncState } from '../utils/initialAsyncState'
import { useContext, useReducer } from 'react'
import { boxOfficeReducer } from '../reducer/boxOfficeReducer'
import { BoxOfficeContext } from '../create/boxOfficeCreate'

// UsersContext 에서 사용 할 기본 상태
const initialState = {
	BoxOfficeList: initialAsyncState,
	BoxOfficeDetail: initialAsyncState,
	BoxOfficePeople: initialAsyncState,
}

export function BoxOfficeApiProvider({ children }) {
	const [state, dispatch] = useReducer(boxOfficeReducer, initialState)

	return <BoxOfficeContext.Provider value={{ state, dispatch }}>{children}</BoxOfficeContext.Provider>
}

export function useBoxOfficeContext() {
	const { state, dispatch } = useContext(BoxOfficeContext)
	if (!state) {
		throw new Error('Cannot find BoxOffice State')
	}
	return { state, dispatch }
}
