import React, { useContext, useReducer } from 'react'
import { UserContext } from '../create/userCreate'
import { userReducer } from '../reducer/userReducer'
import { initialAsyncState, initialResponse } from '../utils/initialAsyncState'

// UsersContext 에서 사용 할 기본 상태
const initialState = {
	userSignIn: initialAsyncState,
	userSignUp: initialAsyncState,
	userSignOut: initialAsyncState,
	userSignSelect: initialAsyncState,
	accessChangePasswd: initialAsyncState,
	changeNewPassword: initialAsyncState,
	userSignUpCorp: initialAsyncState,
	userInfoResponse: initialAsyncState,
	userEmailExist: initialAsyncState,
	userCheck: initialAsyncState,
	userChangePassword: initialAsyncState,
	userFindEmail: initialAsyncState,
	userInfoModify: initialAsyncState,
	emailCheck: initialAsyncState,
	emailSend: initialAsyncState,
	niceCertRequest: initialAsyncState,
	changeDefaultUserEv: initialAsyncState,
	withdrawal: initialAsyncState,
	userWpayCheck: {
		...initialAsyncState,
		data: {
			...initialResponse,
			data: false,
		},
	},
	pinFlag: initialAsyncState,
	checkUserExist: initialAsyncState,
}

export function UserApiProvider({ children }) {
	const [state, dispatch] = useReducer(userReducer, initialState)

	return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>
}

export function useUserContext() {
	const { state, dispatch } = useContext(UserContext)
	if (!state) {
		throw new Error('Cannot find UserState')
	}
	return { state, dispatch }
}
