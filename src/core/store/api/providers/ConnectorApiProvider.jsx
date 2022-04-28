import React, { useContext, useReducer } from 'react'
import { ConnectorContext } from '../create/connectorCreate'
import { connectorReducer } from '../reducer/connectorReducer'
import { initialAsyncState } from '../utils/initialAsyncState'

const initialState = {
	connectorStatus: initialAsyncState,
	statusAvailable: initialAsyncState,
}

export function ConnectorApiProvider({ children }) {
	const [state, dispatch] = useReducer(connectorReducer, initialState)

	return <ConnectorContext.Provider value={{ state, dispatch }}>{children}</ConnectorContext.Provider>
}

export function useConnectorContext() {
	const { state, dispatch } = useContext(ConnectorContext)
	if (!state) {
		throw new Error('Cannot find ConnectorState')
	}
	return { state, dispatch }
}
