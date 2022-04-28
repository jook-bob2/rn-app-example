import {
	getFindRoad,
	getFindRoadReqData,
	getNearStationPagingList,
	getStationDetail,
	getStationList,
	getStationListForFavor,
	getStationWaiting,
	postStationCharge,
} from '@/core/api/stationApi'
import { stationConstants } from '@store/api/costants/stationConstants'
import { createContext } from 'react'
import { createAsyncDispatcher } from '../utils/createAsyncDispatcher'
import { createAsyncHandler } from '../utils/createAsyncHandler'

// 컨텍스트를 생성함
export const StationContext = createContext(null)

// 핸들러를 생성함.
export const stationListHandler = createAsyncHandler(stationConstants.GET_STATION_LIST, 'stationList')
export const stationDetailHandler = createAsyncHandler(stationConstants.GET_STATION_DETAIL, 'stationDetail')
export const stationWaitingHandler = createAsyncHandler(stationConstants.GET_STATION_WAITING, 'stationWaiting')
export const stationChargeHandler = createAsyncHandler(stationConstants.POST_STATION_CHARGE, 'stationCharge')
export const nearStationPagingListHandler = createAsyncHandler(
	stationConstants.GET_NEAR_STATION_PAGING_LIST,
	'nearStationPagingList',
)
export const findRoadHandler = createAsyncHandler(stationConstants.GET_FIND_ROAD, 'findRoad')
export const findRoadReqDataHandler = createAsyncHandler(stationConstants.GET_FIND_ROAD_REQ_DATA, 'findRoadReqData')
export const userStationListHandler = createAsyncHandler(stationConstants.GET_USER_STATION_LIST, 'userStationList')

// 액션을 핸들링하고, API 호출함.
export const GET_STATION_LIST = createAsyncDispatcher(stationConstants.GET_STATION_LIST, getStationList)
export const GET_STATION_DETAIL = createAsyncDispatcher(stationConstants.GET_STATION_DETAIL, getStationDetail)
export const GET_STATION_WAITING = createAsyncDispatcher(stationConstants.GET_STATION_WAITING, getStationWaiting)
export const POST_STATION_CHARGE = createAsyncDispatcher(stationConstants.POST_STATION_CHARGE, postStationCharge)
export const GET_NEAR_STATION_PAGING_LIST = createAsyncDispatcher(
	stationConstants.GET_NEAR_STATION_PAGING_LIST,
	getNearStationPagingList,
)
export const GET_FIND_ROAD = createAsyncDispatcher(stationConstants.GET_FIND_ROAD, getFindRoad)
export const GET_FIND_ROAD_REQ_DATA = createAsyncDispatcher(stationConstants.GET_FIND_ROAD_REQ_DATA, getFindRoadReqData)
export const GET_USER_STATION_LIST = createAsyncDispatcher(
	stationConstants.GET_USER_STATION_LIST,
	getStationListForFavor,
)
