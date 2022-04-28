import {
	deleteFavoriteStation,
	getFavoriteStation,
	getFavoriteStationList,
	getFavoriteStationNormalList,
	getFavoriteStationPagingList,
	patchFavoriteStation,
	postBookMarkInsert,
	postToggleBookMark,
} from '@/core/api/userFavoriteStationApi'
import { createContext } from 'react'
import { userFavoriteStationConstants } from '../costants/userFavoriteStationConstants'
import { createAsyncDispatcher } from '../utils/createAsyncDispatcher'
import { createAsyncHandler } from '../utils/createAsyncHandler'

// 컨텍스트를 생성함
export const UserFavoriteStationContext = createContext(null)

// 핸들러를 생성함.
export const favoriteStationNormalHandler = createAsyncHandler(
	userFavoriteStationConstants.GET_FAVORITE_STATION_NORMAL_LIST,
	'favoriteStationNormalList',
)
export const favoriteStationPagingHandler = createAsyncHandler(
	userFavoriteStationConstants.GET_FAVORITE_STATION_PAGING_LIST,
	'favoriteStationPagingList',
)

export const bookmarkInsertHandler = createAsyncHandler(
	userFavoriteStationConstants.POST_BOOK_MARK_INSERT,
	'bookmarkInsert',
)

export const favoriteStationHandler = createAsyncHandler(
	userFavoriteStationConstants.GET_FAVORITE_STATION_LIST,
	'favoriteStationList',
)

export const favoriteStationInfoHandler = createAsyncHandler(
	userFavoriteStationConstants.GET_FAVORITE_STATION,
	'favoriteStation',
)
export const favoriteStationDeleteHandler = createAsyncHandler(
	userFavoriteStationConstants.DELETE_FAVORITE_STATION,
	'favoriteStationDelete',
)

export const favoriteStationUpdateHandler = createAsyncHandler(
	userFavoriteStationConstants.UPDATE_FAVORITE_STATION,
	'patchFavoriteStation',
)

export const toggleBookMarkHandler = createAsyncHandler(
	userFavoriteStationConstants.POST_TOGGLE_BOOK_MARK,
	'toggleBookMark',
)

// 액션을 핸들링하고, API 호출함.
export const GET_FAVORITE_STATION_NORMAL_LIST = createAsyncDispatcher(
	userFavoriteStationConstants.GET_FAVORITE_STATION_NORMAL_LIST,
	getFavoriteStationNormalList,
)
export const GET_FAVORITE_STATION_PAGING_LIST = createAsyncDispatcher(
	userFavoriteStationConstants.GET_FAVORITE_STATION_PAGING_LIST,
	getFavoriteStationPagingList,
)
export const POST_BOOK_MARK_INSERT = createAsyncDispatcher(
	userFavoriteStationConstants.POST_BOOK_MARK_INSERT,
	postBookMarkInsert,
)

export const GET_FAVORITE_STATION_LIST = createAsyncDispatcher(
	userFavoriteStationConstants.GET_FAVORITE_STATION_LIST,
	getFavoriteStationList,
)
export const GET_FAVORITE_STATION = createAsyncDispatcher(
	userFavoriteStationConstants.GET_FAVORITE_STATION,
	getFavoriteStation,
)

export const DELETE_FAVORITE_STATION = createAsyncDispatcher(
	userFavoriteStationConstants.DELETE_FAVORITE_STATION,
	deleteFavoriteStation,
)

export const UPDATE_FAVORITE_STATION = createAsyncDispatcher(
	userFavoriteStationConstants.UPDATE_FAVORITE_STATION,
	patchFavoriteStation,
)
export const POST_TOGGLE_BOOK_MARK = createAsyncDispatcher(
	userFavoriteStationConstants.POST_TOGGLE_BOOK_MARK,
	postToggleBookMark,
)
