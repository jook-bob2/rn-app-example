import { getMessageDetail, getMessageList, getUnreadCount, patchReadValue } from '@/core/api/messageApi'
import { createContext } from 'react'
import { messageConstants } from '../costants/messageConstants'
import { createAsyncDispatcher } from '../utils/createAsyncDispatcher'
import { createAsyncHandler } from '../utils/createAsyncHandler'

// 컨텍스트를 생성함
export const MessageContext = createContext(null)

// 핸들러를 생성함.
export const messageListHandler = createAsyncHandler(messageConstants.GET_MESSAGE_LIST, 'messageList')
export const readValueHandler = createAsyncHandler(messageConstants.PATCH_READ_VALUE, 'readValue')
export const unreadCountHandler = createAsyncHandler(messageConstants.GET_UNREAD_COUNT, 'unreadCount')
export const messageDetailHandler = createAsyncHandler(messageConstants.GET_MESSAGE_DETAIL, 'messageDetail')

// 액션을 핸들링하고, API 호출함.
export const GET_MESSAGE_LIST = createAsyncDispatcher(messageConstants.GET_MESSAGE_LIST, getMessageList)
export const PATCH_READ_VALUE = createAsyncDispatcher(messageConstants.PATCH_READ_VALUE, patchReadValue)
export const GET_UNREAD_COUNT = createAsyncDispatcher(messageConstants.GET_UNREAD_COUNT, getUnreadCount)
export const GET_MESSAGE_DETAIL = createAsyncDispatcher(messageConstants.GET_MESSAGE_DETAIL, getMessageDetail)
