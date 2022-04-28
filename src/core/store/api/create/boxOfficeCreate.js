import { getBoxOfficeDetail, getBoxOfficeList, getBoxOfficePeople } from '@/core/api/boxOfficeApi'
import { createContext } from 'react'
import { boxOfficeConstants } from '../costants/boxOfficeConstants'
import { createAsyncDispatcher } from '../utils/createAsyncDispatcher'
import { createAsyncHandler } from '../utils/createAsyncHandler'

// 컨텍스트를 생성함
export const BoxOfficeContext = createContext(null)

// 핸들러를 생성함.
export const boxOfficeListHandler = createAsyncHandler(boxOfficeConstants.GET_BOX_OFFICE_LIST, 'BoxOfficeList')
export const boxOfficeDetailHandler = createAsyncHandler(boxOfficeConstants.GET_BOX_OFFICE_DETAIL, 'BoxOfficeDetail')
export const boxOfficePeopleHandler = createAsyncHandler(boxOfficeConstants.GET_BOX_OFFICE_PEOPLE, 'BoxOfficePeople')

// 액션을 핸들링하고, API 호출함.
export const GET_BOX_OFFICE_LIST = createAsyncDispatcher(boxOfficeConstants.GET_BOX_OFFICE_LIST, getBoxOfficeList)
export const GET_BOX_OFFICE_DETAIL = createAsyncDispatcher(boxOfficeConstants.GET_BOX_OFFICE_DETAIL, getBoxOfficeDetail)
export const GET_BOX_OFFICE_PEOPLE = createAsyncDispatcher(boxOfficeConstants.GET_BOX_OFFICE_PEOPLE, getBoxOfficePeople)
