import React, { useContext, useReducer } from 'react'
import { AddressContext } from '../create/addressCreate'
import { addressReducer } from '../reducer/addressReducer'
import { initialAsyncState } from '../utils/initialAsyncState'

// UsersContext 에서 사용 할 기본 상태
const initialState = {
	userAddress: initialAsyncState,
}

export function AddressApiProvider({ children }) {
	const [state, dispatch] = useReducer(addressReducer, initialState)

	return <AddressContext.Provider value={{ state, dispatch }}>{children}</AddressContext.Provider>
}

export function useAddressContext() {
	const { state, dispatch } = useContext(AddressContext)
	if (!state) {
		throw new Error('Cannot find UserState')
	}
	return { state, dispatch }
}
