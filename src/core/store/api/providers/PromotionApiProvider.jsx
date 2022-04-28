import React from 'react'
import { initialPageState } from '../utils/initialAsyncState'
import { useContext, useReducer } from 'react'
import { promotionReducer } from '../reducer/promotionReducer'
import { PromotionContext } from '../create/promotionCreate'

// UsersContext 에서 사용 할 기본 상태
const initialState = {
	promotionList: initialPageState,
}

export function PromotionApiProvider({ children }) {
	const [state, dispatch] = useReducer(promotionReducer, initialState)

	return <PromotionContext.Provider value={{ state, dispatch }}>{children}</PromotionContext.Provider>
}

export function usePromotionContext() {
	const { state, dispatch } = useContext(PromotionContext)
	if (!state) {
		throw new Error('Cannot find PromotionState')
	}
	return { state, dispatch }
}
