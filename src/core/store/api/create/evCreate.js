import { getEvManufacturerList, getEvModelList } from '@/core/api/evApi'
import { createContext } from 'react'
import { evConstants } from '../costants/evConstants'
import { createAsyncDispatcher } from '../utils/createAsyncDispatcher'
import { createAsyncHandler } from '../utils/createAsyncHandler'

// 컨텍스트를 생성함
export const EvContext = createContext(null)

//핸들러
export const evManufacturerListHandler = createAsyncHandler(evConstants.GET_EV_MANUFACTURER_LIST, 'evManufacturerList')
export const evModelListHandler = createAsyncHandler(evConstants.GET_EV_MODEL_LIST, 'evModelList')

//액션을 핸들링하고, API 호출함

export const GET_EV_MANUFACTURER_LIST = createAsyncDispatcher(
	evConstants.GET_EV_MANUFACTURER_LIST,
	getEvManufacturerList,
)

export const GET_EV_MODEL_LIST = createAsyncDispatcher(evConstants.GET_EV_MODEL_LIST, getEvModelList)
