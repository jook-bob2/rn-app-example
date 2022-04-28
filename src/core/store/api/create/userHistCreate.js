import { postSignInHist } from '@/core/api/userHistoryApi'
import { createContext } from 'react'
import { userHistConstants } from '../costants/userHistConstants'
import { createAsyncDispatcher } from '../utils/createAsyncDispatcher'
import { createAsyncHandler } from '../utils/createAsyncHandler'

// 컨텍스트를 생성함
export const UserHistContext = createContext(null)

// 핸들러를 생성함.
export const signInHistHandler = createAsyncHandler(userHistConstants.POST_SIGN_IN_HIST, 'signInHist')

// 액션을 핸들링하고, API 호출함.
export const POST_SIGN_IN_HIST = createAsyncDispatcher(userHistConstants.POST_SIGN_IN_HIST, postSignInHist)
