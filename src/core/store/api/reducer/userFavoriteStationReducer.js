import { userFavoriteStationConstants } from '../costants/userFavoriteStationConstants'
import {
	bookmarkInsertHandler,
	favoriteStationDeleteHandler,
	favoriteStationHandler,
	favoriteStationInfoHandler,
	favoriteStationNormalHandler,
	favoriteStationPagingHandler,
	favoriteStationUpdateHandler,
	toggleBookMarkHandler,
} from '../create/userFavoriteStationCreate'

// 위에서 만든 객체 / 유틸 함수들을 사용하여 리듀서 작성
export function userFavoriteStationReducer(state, action) {
	switch (action.type) {
		case userFavoriteStationConstants.GET_FAVORITE_STATION_NORMAL_LIST:
		case userFavoriteStationConstants.GET_FAVORITE_STATION_NORMAL_LIST_SUCCESS:
		case userFavoriteStationConstants.GET_FAVORITE_STATION_NORMAL_LIST_ERROR:
			return favoriteStationNormalHandler(state, action)
		case userFavoriteStationConstants.GET_FAVORITE_STATION_PAGING_LIST:
		case userFavoriteStationConstants.GET_FAVORITE_STATION_PAGING_LIST_SUCCESS:
		case userFavoriteStationConstants.GET_FAVORITE_STATION_PAGING_LIST_ERROR:
			return favoriteStationPagingHandler(state, action)
		case userFavoriteStationConstants.POST_BOOK_MARK_INSERT:
		case userFavoriteStationConstants.POST_BOOK_MARK_INSERT_SUCCESS:
		case userFavoriteStationConstants.POST_BOOK_MARK_INSERT_ERROR:
			return bookmarkInsertHandler(state, action)
		case userFavoriteStationConstants.GET_FAVORITE_STATION_LIST:
		case userFavoriteStationConstants.GET_FAVORITE_STATION_LIST_SUCCESS:
		case userFavoriteStationConstants.GET_FAVORITE_STATION_LIST_ERROR:
			return favoriteStationHandler(state, action)
		case userFavoriteStationConstants.GET_FAVORITE_STATION:
		case userFavoriteStationConstants.GET_FAVORITE_STATION_SUCCESS:
		case userFavoriteStationConstants.GET_FAVORITE_STATION_ERROR:
			return favoriteStationInfoHandler(state, action)
		case userFavoriteStationConstants.DELETE_FAVORITE_STATION:
		case userFavoriteStationConstants.DELETE_FAVORITE_STATION_SUCCESS:
		case userFavoriteStationConstants.DELETE_FAVORITE_STATION_ERROR:
			return favoriteStationDeleteHandler(state, action)
		case userFavoriteStationConstants.UPDATE_FAVORITE_STATION:
		case userFavoriteStationConstants.UPDATE_FAVORITE_STATION_SUCCESS:
		case userFavoriteStationConstants.UPDATE_FAVORITE_STATION_ERROR:
			return favoriteStationUpdateHandler(state, action)
		case userFavoriteStationConstants.POST_TOGGLE_BOOK_MARK:
		case userFavoriteStationConstants.POST_TOGGLE_BOOK_MARK_SUCCESS:
		case userFavoriteStationConstants.POST_TOGGLE_BOOK_MARK_ERROR:
			return toggleBookMarkHandler(state, action)
		default:
			throw new Error(`Unhanded action type: ${action.type}`)
	}
}
