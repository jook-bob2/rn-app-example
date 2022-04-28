import React from 'react'
import { initialAsyncState, initialListState, initialPageState, initialResponse } from '../utils/initialAsyncState'
import { useContext, useReducer } from 'react'
import { BoardContext } from '../create/boardCreate'
import { boardReducer } from '../reducer/boardReducer'

// UsersContext 에서 사용 할 기본 상태
const initialState = {
	boardPageList: initialPageState,
	boardNormalList: initialListState,
	boardDetail: {
		...initialAsyncState,
		data: {
			...initialResponse,
			data: {
				id: null,
				boardCd: '',
				userId: null,
				subject: '',
				content: '',
				dspStartDate: '',
				dspEndDate: '',
				hit: '',
				blockFlag: '',
				delFlag: '',
				regDate: '',
			},
		},
	},
	inquiryInsert: initialAsyncState,
}

export function BoardApiProvider({ children }) {
	const [state, dispatch] = useReducer(boardReducer, initialState)

	return <BoardContext.Provider value={{ state, dispatch }}>{children}</BoardContext.Provider>
}

export function useBoardContext() {
	const { state, dispatch } = useContext(BoardContext)
	if (!state) {
		throw new Error('Cannot find BoardState')
	}
	return { state, dispatch }
}
