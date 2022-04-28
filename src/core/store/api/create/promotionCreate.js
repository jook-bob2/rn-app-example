import { getPromotionList } from '@/core/api/promotionApi'
import { createContext } from 'react'
import { promotionConstants } from '../costants/promotionConstants'
import { createAsyncDispatcher } from '../utils/createAsyncDispatcher'
import { createAsyncHandler } from '../utils/createAsyncHandler'

// 컨텍스트를 생성함
export const PromotionContext = createContext(null)

// 핸들러를 생성함.
export const promotionListHandler = createAsyncHandler(promotionConstants.GET_PROMOTION_LIST_PAGE, 'promotionList')

// 액션을 핸들링하고, API 호출함.
export const GET_PROMOTION_LIST_PAGE = createAsyncDispatcher(
	promotionConstants.GET_PROMOTION_LIST_PAGE,
	getPromotionList,
)
