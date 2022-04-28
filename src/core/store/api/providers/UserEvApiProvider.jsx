import React, { useContext, useReducer } from 'react'
import { UserEvContext } from '../create/userEvCreate'
import { userEvReducer } from '../reducer/userEvReducer'
import { initialAsyncState, initialListState } from '../utils/initialAsyncState'

// UsersContext 에서 사용 할 기본 상태
const initialState = {
	userEvList: initialListState,
	myEvList: initialListState,
	sharedEvList: initialListState,
	sharedUserList: initialListState,
	sharedUserEvList: initialListState,
	receivedShareList: initialListState,
	sendShare: initialAsyncState,
	refuseShare: initialAsyncState,
	checkShare: initialAsyncState,
	approveShare: initialAsyncState,
	addEv: initialAsyncState,
	newUserEvList: initialListState,
	userEvInfo: initialAsyncState,
	userEvModify: initialAsyncState,
	stopShare: initialAsyncState,
	releaseShare: initialAsyncState,
	userEvDelete: initialAsyncState,
	userMyEvList: initialListState,
}

export function UserEvApiProvider({ children }) {
	const [state, dispatch] = useReducer(userEvReducer, initialState)

	return <UserEvContext.Provider value={{ state, dispatch }}>{children}</UserEvContext.Provider>
}

export function useUserEvContext() {
	const { state, dispatch } = useContext(UserEvContext)
	if (!state) {
		throw new Error('Cannot find UserEvState')
	}
	return { state, dispatch }
}
