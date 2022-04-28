import React, { useContext, useReducer } from 'react'
import { userSelectInitialState } from '@store/common/initialState'
import { constants } from '@store/common/constants'
import { userSelectReducer } from '../reducer'
import { UserSelectStateContext } from '@store/common/create'

const { SET_OPEN_USER_SELECT, SET_CLOSE_USER_SELECT } = constants

export function UserSelectProvider({ children }) {
	const [userSelectState, userSelectDispatch] = useReducer(userSelectReducer, userSelectInitialState)

	function openUserSelect() {
		userSelectDispatch({
			type: SET_OPEN_USER_SELECT,
		})
	}

	function closeUserSelect() {
		userSelectDispatch({
			type: SET_CLOSE_USER_SELECT,
		})
	}

	return (
		<UserSelectStateContext.Provider
			value={{ userSelectState, userSelectDispatch, openUserSelect, closeUserSelect }}
		>
			{children}
		</UserSelectStateContext.Provider>
	)
}

export function useUserSelect() {
	const { userSelectState, userSelectDispatch, openUserSelect, closeUserSelect } = useContext(UserSelectStateContext)
	if (!userSelectState) {
		throw new Error('Cannot find UserSelectState')
	}
	return { userSelectState, userSelectDispatch, $userSelect: openUserSelect, closeUserSelect }
}
