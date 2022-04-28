import React from 'react'
import { initialAsyncState, initialPageState, initialResponse } from '../utils/initialAsyncState'
import { useContext, useReducer } from 'react'
import { messageReducer } from '../reducer/messageReducer'
import { MessageContext } from '../create/messageCreate'

export const initialMessageDetailState = {
	...initialAsyncState,
	data: {
		...initialResponse,
		data: {
			id: null,
			userId: null,
			msgTypeCd: '',
			subject: '',
			content: '',
			sendDate: '',
			readFlag: '',
			delFlag: '',
			regDate: '',
		},
	},
}

// UsersContext 에서 사용 할 기본 상태
const initialState = {
	messageList: initialPageState,
	readValue: initialAsyncState,
	unreadCount: initialAsyncState,
	messageDetail: initialMessageDetailState,
}

export function MessageApiProvider({ children }) {
	const [state, dispatch] = useReducer(messageReducer, initialState)

	return <MessageContext.Provider value={{ state, dispatch }}>{children}</MessageContext.Provider>
}

export function useMessageContext() {
	const { state, dispatch } = useContext(MessageContext)
	if (!state) {
		throw new Error('Cannot find AlarmState')
	}
	return { state, dispatch }
}
