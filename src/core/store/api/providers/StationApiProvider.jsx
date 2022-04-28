import React, { useContext, useReducer } from 'react'
import { StationContext } from '../create/stationCreate'
import { stationReducer } from '../reducer/stationReducer'
import { initialAsyncState, initialListState, initialPageState, initialResponse } from '../utils/initialAsyncState'

export const findRoadInitialState = {
	...initialAsyncState,
	data: {
		...initialResponse,
		data: {
			id: null,
			name: '',
			latitude: 0,
			longitude: 0,
		},
	},
}

// UsersContext 에서 사용 할 기본 상태
const initialState = {
	stationList: initialListState,
	stationDetail: {
		...initialAsyncState,
		data: {
			...initialResponse,
			data: {
				stationId: null,
				distance: 0,
				distanceUnit: '',
				hours: 0,
				minutes: 0,
				seconds: 0,
				addr1: '',
				addr2: '',
				latitude: 0,
				longitude: 0,
				oprtnStartTime: '',
				oprtnEndTime: '',
				useFlag: '',
				fvrtFlag: '',
				slowChgPrice: 0,
				mediumChgPrice: 0,
				quickChgPrice: 0,
				totalSlowChgCnt: 0,
				totalMediumChgCnt: 0,
				totalQuickChgCnt: 0,
			},
		},
	},
	stationWaiting: {
		...initialAsyncState,
		data: {
			...initialResponse,
			data: 0,
		},
	},
	stationCharge: initialAsyncState,
	nearStationPagingList: initialPageState,
	findRoad: findRoadInitialState,
	findRoadReqData: findRoadInitialState,
	userStationList: initialListState,
}

export function StationApiProvider({ children }) {
	const [state, dispatch] = useReducer(stationReducer, initialState)

	return <StationContext.Provider value={{ state, dispatch }}>{children}</StationContext.Provider>
}

export function useStationContext() {
	const { state, dispatch } = useContext(StationContext)
	if (!state) {
		throw new Error('Cannot find StationState')
	}
	return { state, dispatch }
}
