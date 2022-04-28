import React, { useContext, useReducer } from 'react'
import { BackColorStateContext } from '@store/common/create'
import { backColorInitialState } from '@store/common/initialState'
import { backColorReducer } from '@store/common/reducer'
import { constants } from '@store/common/constants'

const { SET_TOP_COLOR, SET_BOTTOM_COLOR } = constants

export function BackColorProvider({ children }) {
	const [backColorState, backColorDispatch] = useReducer(backColorReducer, backColorInitialState)

	function setTopColor(topColor) {
		backColorDispatch({
			type: SET_TOP_COLOR,
			topColor,
		})
	}

	function setBottomColor(bottomColor) {
		backColorDispatch({
			type: SET_BOTTOM_COLOR,
			bottomColor,
		})
	}

	return (
		<BackColorStateContext.Provider value={{ backColorState, setTopColor, setBottomColor }}>
			{children}
		</BackColorStateContext.Provider>
	)
}

export function useBackColor() {
	const { backColorState, setTopColor, setBottomColor } = useContext(BackColorStateContext)
	if (!backColorState) {
		throw new Error('Cannot find BackColorState')
	}
	return { backColorState, setTopColor, setBottomColor }
}
