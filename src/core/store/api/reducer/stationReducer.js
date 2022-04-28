import { stationConstants } from '../costants/stationConstants'
import {
	findRoadHandler,
	findRoadReqDataHandler,
	nearStationPagingListHandler,
	stationChargeHandler,
	stationDetailHandler,
	stationListHandler,
	stationWaitingHandler,
	userStationListHandler,
} from '../create/stationCreate'

// 위에서 만든 객체 / 유틸 함수들을 사용하여 리듀서 작성
export function stationReducer(state, action) {
	switch (action.type) {
		case stationConstants.GET_STATION_LIST:
		case stationConstants.GET_STATION_LIST_SUCCESS:
		case stationConstants.GET_STATION_LIST_ERROR:
			return stationListHandler(state, action)
		case stationConstants.GET_STATION_DETAIL:
		case stationConstants.GET_STATION_DETAIL_SUCCESS:
		case stationConstants.GET_STATION_DETAIL_ERROR:
			return stationDetailHandler(state, action)
		case stationConstants.GET_STATION_WAITING:
		case stationConstants.GET_STATION_WAITING_SUCCESS:
		case stationConstants.GET_STATION_WAITING_ERROR:
			return stationWaitingHandler(state, action)
		case stationConstants.POST_STATION_CHARGE:
		case stationConstants.POST_STATION_CHARGE_SUCCESS:
		case stationConstants.POST_STATION_CHARGE_ERROR:
			return stationChargeHandler(state, action)
		case stationConstants.GET_NEAR_STATION_PAGING_LIST:
		case stationConstants.GET_NEAR_STATION_PAGING_LIST_SUCCESS:
		case stationConstants.GET_NEAR_STATION_PAGING_LIST_ERROR:
			return nearStationPagingListHandler(state, action)
		case stationConstants.GET_FIND_ROAD:
		case stationConstants.GET_FIND_ROAD_SUCCESS:
		case stationConstants.GET_FIND_ROAD_ERROR:
			return findRoadHandler(state, action)
		case stationConstants.GET_FIND_ROAD_REQ_DATA:
		case stationConstants.GET_FIND_ROAD_REQ_DATA_SUCCESS:
		case stationConstants.GET_FIND_ROAD_REQ_DATA_ERROR:
			return findRoadReqDataHandler(state, action)
		case stationConstants.GET_USER_STATION_LIST:
		case stationConstants.GET_USER_STATION_LIST_SUCCESS:
		case stationConstants.GET_USER_STATION_LIST_ERROR:
			return userStationListHandler(state, action)
		default:
			throw new Error(`Unhanded action type: ${action.type}`)
	}
}
