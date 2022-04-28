import {
	getWpayAuthRequest,
	getWpayCardList,
	getWpayCardRequest,
	getWpayMemRequest,
	postWpayCardMain,
	postWpayCardRemove,
} from '@/core/api/InicisApi'
import { createContext } from 'react'
import { inicisConstants } from '../costants/inicisConstants'
import { createAsyncDispatcher } from '../utils/createAsyncDispatcher'
import { createAsyncHandler } from '../utils/createAsyncHandler'

// 컨텍스트를 생성함
export const InicisContext = createContext(null)

// 핸들러를 생성함.
export const wpayMemRequestHandler = createAsyncHandler(inicisConstants.GET_WPAY_MEM_REQUEST, 'wpayMemRequest')
export const wpayCardRequestHandler = createAsyncHandler(inicisConstants.GET_WPAY_CARD_REQUEST, 'wpayCardRequest')
export const wpayCardListHandler = createAsyncHandler(inicisConstants.GET_WPAY_CARD_LIST, 'wpayCardList')
export const wpayAuthRequestHandler = createAsyncHandler(inicisConstants.GET_WPAY_AUTH_REQUEST, 'wpayAuthRequest')
export const wpayCardRemoveHandler = createAsyncHandler(inicisConstants.POST_WPAY_CARD_REMOVE, 'wpayCardRemove')
export const wpayCardMainHandler = createAsyncHandler(inicisConstants.POST_WPAY_CARD_MAIN, 'wpayCardMain')
// 액션을 핸들링하고, API 호출함.
export const GET_WPAY_MEM_REQUEST = createAsyncDispatcher(inicisConstants.GET_WPAY_MEM_REQUEST, getWpayMemRequest)
export const GET_WPAY_CARD_REQUEST = createAsyncDispatcher(inicisConstants.GET_WPAY_CARD_REQUEST, getWpayCardRequest)
export const GET_WPAY_CARD_LIST = createAsyncDispatcher(inicisConstants.GET_WPAY_CARD_LIST, getWpayCardList)
export const GET_WPAY_AUTH_REQUEST = createAsyncDispatcher(inicisConstants.GET_WPAY_AUTH_REQUEST, getWpayAuthRequest)
export const POST_WPAY_CARD_REMOVE = createAsyncDispatcher(inicisConstants.POST_WPAY_CARD_REMOVE, postWpayCardRemove)
export const POST_WPAY_CARD_MAIN = createAsyncDispatcher(inicisConstants.POST_WPAY_CARD_MAIN, postWpayCardMain)
