import React, { useContext, useReducer } from 'react'
import { LoadingStateContext } from '@store/common/create'
import { loadingInitialState } from '@store/common/initialState'
import { constants } from '@store/common/constants'
import { loadingReducer } from '../reducer'

const { SET_SHOW_LOADING, SET_HIDDEN_LOADING } = constants

// 전역 로딩
export function LoadingProvider({ children }) {
	const [loadingState, loadingDispatch] = useReducer(loadingReducer, loadingInitialState)

	// 로딩 보여줌
	function showLoading() {
		loadingDispatch({
			type: SET_SHOW_LOADING,
		})
	}

	// 로딩 감춤
	function hiddenLoading() {
		loadingDispatch({
			type: SET_HIDDEN_LOADING,
		})
	}

	return (
		<LoadingStateContext.Provider value={{ loadingState, showLoading, hiddenLoading }}>
			{children}
		</LoadingStateContext.Provider>
	)
}

export function useLoading() {
	const { loadingState, showLoading, hiddenLoading } = useContext(LoadingStateContext)

	if (!loadingState) {
		throw new Error('Cannot find loadingState')
	}

	return { loadingState, showLoading, hiddenLoading }
}
