import React, { useContext, useReducer } from 'react'
import { EvContext } from '../create/evCreate'
import { evReducer } from '../reducer/evReducer'
import { initialListState } from '../utils/initialAsyncState'

const initialState = {
	evManufacturerList: initialListState,
	evModelList: initialListState,
}

export function EvApiProvider({ children }) {
	const [state, dispatch] = useReducer(evReducer, initialState)
	return <EvContext.Provider value={{ state, dispatch }}>{children}</EvContext.Provider>
}

export function useEvContext() {
	const { state, dispatch } = useContext(EvContext)
	if (!state) {
		throw new Error('Cannot find evState')
	}
	return { state, dispatch }
}
