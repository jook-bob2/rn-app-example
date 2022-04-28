import React from 'react'
import { initialListState } from '../utils/initialAsyncState'
import { useContext, useReducer } from 'react'
import { commCodeReducer } from '../reducer/commCodeReducer'
import { CommCodeContext } from '../create/commCodeCreate'

// UsersContext 에서 사용 할 기본 상태
const initialState = {
	commCodeSearchList: initialListState,
}

export function CommCodeApiProvider({ children }) {
	const [state, dispatch] = useReducer(commCodeReducer, initialState)

	return <CommCodeContext.Provider value={{ state, dispatch }}>{children}</CommCodeContext.Provider>
}

export function useCommCodeContext() {
	const { state, dispatch } = useContext(CommCodeContext)
	if (!state) {
		throw new Error('Cannot find CommCode State')
	}
	return { state, dispatch }
}
