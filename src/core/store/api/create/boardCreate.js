import { getBoardDetail, getBoardNormalList, getBoardPageList, postInquiryInsert } from '@/core/api/boardApi'
import { createContext } from 'react'
import { boardConstants } from '../costants/boardConstants'
import { createAsyncDispatcher } from '../utils/createAsyncDispatcher'
import { createAsyncHandler } from '../utils/createAsyncHandler'

// 컨텍스트를 생성함
export const BoardContext = createContext(null)

// 핸들러를 생성함.
export const boardPageListHandler = createAsyncHandler(boardConstants.GET_BOARD_PAGE_LIST, 'boardPageList')
export const boardNormalListHandler = createAsyncHandler(boardConstants.GET_BOARD_NORMAL_LIST, 'boardNormalList')
export const boardDetailHandler = createAsyncHandler(boardConstants.GET_BOARD_DETAIL, 'boardDetail')
export const inquiryInsertHandler = createAsyncHandler(boardConstants.POST_INQUIRY_INSERT, 'inquiryInsert')

// 액션을 핸들링하고, API 호출함.
export const GET_BOARD_PAGE_LIST = createAsyncDispatcher(boardConstants.GET_BOARD_PAGE_LIST, getBoardPageList)
export const GET_BOARD_NORMAL_LIST = createAsyncDispatcher(boardConstants.GET_BOARD_NORMAL_LIST, getBoardNormalList)
export const GET_BOARD_DETAIL = createAsyncDispatcher(boardConstants.GET_BOARD_DETAIL, getBoardDetail)
export const POST_INQUIRY_INSERT = createAsyncDispatcher(boardConstants.POST_INQUIRY_INSERT, postInquiryInsert)
