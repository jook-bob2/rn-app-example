import { getTermsList } from '@/core/api/termsApi'
import { createContext } from 'react'
import { termsConstants } from '../costants/termsConstants'
import { createAsyncDispatcher } from '../utils/createAsyncDispatcher'
import { createAsyncHandler } from '../utils/createAsyncHandler'

// 컨텍스트를 생성함
export const TermsContext = createContext(null)

// 핸들러를 생성함.
export const termsListHandler = createAsyncHandler(termsConstants.GET_TERMS_LIST, 'termsList')
export const personalTermsListHandler = createAsyncHandler(termsConstants.GET_PERSONAL_TERMS_LIST, 'personTermsList')
export const corpTermsListHandler = createAsyncHandler(termsConstants.GET_CORP_TERMS_LIST, 'corpTermsList')

// 액션을 핸들링하고, API 호출함.
export const GET_TERMS_LIST = createAsyncDispatcher(termsConstants.GET_TERMS_LIST, getTermsList)
export const GET_PERSONAL_TERMS_LIST = createAsyncDispatcher(termsConstants.GET_PERSONAL_TERMS_LIST, getTermsList)
export const GET_CORP_TERMS_LIST = createAsyncDispatcher(termsConstants.GET_CORP_TERMS_LIST, getTermsList)
