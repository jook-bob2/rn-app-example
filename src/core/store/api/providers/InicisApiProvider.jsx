import React, { useContext, useReducer } from 'react'
import { InicisContext } from '../create/inicisCreate'
import { inicisReducer } from '../reducer/inicisReducer'
import { initialAsyncState, initialListState, initialResponse } from '../utils/initialAsyncState'

// UsersContext 에서 사용 할 기본 상태
const initialState = {
	wpayMemRequest: {
		...initialAsyncState,
		data: {
			...initialResponse,
			data: {
				mid: '',
				userId: '',
				returnUrl: '',
				signature: '',
			},
		},
	},
	wpayCardRequest: {
		...initialAsyncState,
		data: {
			...initialResponse,
			data: {
				mid: '',
				wpayUserKey: '',
				ci: '',
				returnUrl: '',
				signature: '',
			},
		},
	},
	wpayCardList: initialListState,
	wpayAuthRequest: {
		...initialAsyncState,
		data: {
			...initialResponse,
			data: {
				mid: '',
				wpayUserKey: '',
				wpayToken: '',
				ci: '',
				payMethod: '',
				bankCardCode: '',
				oid: '',
				goodsName: '',
				goodsPrice: '',
				buyerName: '',
				buyerTel: '',
				buyerEmail: '',
				cardQuota: '',
				cardInterest: '',
				couponCode: '',
				flagPin: '',
				returnUrl: '',
				signature: '',
			},
		},
	},
	wpayCardRemove: initialAsyncState,
	wpayCardMain: initialAsyncState,
}

export function InicisApiProvider({ children }) {
	const [state, dispatch] = useReducer(inicisReducer, initialState)

	return <InicisContext.Provider value={{ state, dispatch }}>{children}</InicisContext.Provider>
}

export function useInicisContext() {
	const { state, dispatch } = useContext(InicisContext)
	if (!state) {
		throw new Error('Cannot find InicisState')
	}
	return { state, dispatch }
}
