import React, { useContext, useReducer } from 'react'
import { UserFavoriteStationContext } from '../create/userFavoriteStationCreate'
import { userFavoriteStationReducer } from '../reducer/userFavoriteStationReducer'
import { initialAsyncState, initialListState, initialPageState } from '../utils/initialAsyncState'

// UsersContext 에서 사용 할 기본 상태
const initialState = {
	favoriteStationNormalList: initialListState,
	favoriteStationPagingList: initialPageState,
	bookmarkInsert: initialAsyncState,
	favoriteStationList: initialListState,
	favoriteStation: initialAsyncState,
	favoriteStationDelete: initialAsyncState,
	patchFavoriteStation: initialAsyncState,
	toggleBookMark: initialAsyncState,
}

export function UserFavoriteStationApiProvider({ children }) {
	const [state, dispatch] = useReducer(userFavoriteStationReducer, initialState)

	return (
		<UserFavoriteStationContext.Provider value={{ state, dispatch }}>
			{children}
		</UserFavoriteStationContext.Provider>
	)
}

export function useUserFavoriteStationContext() {
	const { state, dispatch } = useContext(UserFavoriteStationContext)
	if (!state) {
		throw new Error('Cannot find UserFavoriteStationState')
	}
	return { state, dispatch }
}
