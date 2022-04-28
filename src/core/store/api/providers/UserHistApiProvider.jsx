import React, { useContext, useReducer } from 'react'
import { UserHistContext } from '../create/userHistCreate'
import { userHistReducer } from '../reducer/userHistReducer'
import { initialAsyncState } from '../utils/initialAsyncState'

// UsersContext 에서 사용 할 기본 상태
const initialState = {
	signInHist: initialAsyncState,
}

export function UserHistApiProvider({ children }) {
	const [state, dispatch] = useReducer(userHistReducer, initialState)

	return <UserHistContext.Provider value={{ state, dispatch }}>{children}</UserHistContext.Provider>
}

export function useUserHistContext() {
	const { state, dispatch } = useContext(UserHistContext)
	if (!state) {
		throw new Error('Cannot find UserState')
	}
	return { state, dispatch }
}
