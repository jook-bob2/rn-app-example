import React, { useContext, useReducer } from 'react'
import { TermsContext } from '../create/termsCreate'
import { termsReducer } from '../reducer/termsReducer'
import { initialListState } from '../utils/initialAsyncState'

// UsersContext 에서 사용 할 기본 상태
const initialState = {
	termsList: initialListState,
	personTermsList: initialListState,
	corpTermsList: initialListState,
}

export function TermsApiProvider({ children }) {
	const [state, dispatch] = useReducer(termsReducer, initialState)

	return <TermsContext.Provider value={{ state, dispatch }}>{children}</TermsContext.Provider>
}

export function useTermsContext() {
	const { state, dispatch } = useContext(TermsContext)
	if (!state) {
		throw new Error('Cannot find TermsState')
	}
	return { state, dispatch }
}
