import { getCommCodeSearchList } from '@/core/api/commCodeApi'
import { createContext } from 'react'
import { commCodeConstants } from '../costants/commCodeConstants'
import { createAsyncDispatcher } from '../utils/createAsyncDispatcher'
import { createAsyncHandler } from '../utils/createAsyncHandler'

// 컨텍스트를 생성함
export const CommCodeContext = createContext(null)

// 핸들러를 생성함.
export const commCodeSearchListHandler = createAsyncHandler(
	commCodeConstants.GET_COMM_CODE_SEARCH_LIST,
	'commCodeSearchList',
)

// 액션을 핸들링하고, API 호출함.
export const GET_COMM_CODE_SEARCH_LIST = createAsyncDispatcher(
	commCodeConstants.GET_COMM_CODE_SEARCH_LIST,
	getCommCodeSearchList,
)
