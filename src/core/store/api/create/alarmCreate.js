import { getAlarmCheck, putAlarmSelected } from '@/core/api/alarmApi'
import { createContext } from 'react'
import { alarmConstants } from '../costants/alarmConstants'
import { createAsyncDispatcher } from '../utils/createAsyncDispatcher'
import { createAsyncHandler } from '../utils/createAsyncHandler'

// 컨텍스트를 생성함
export const AlarmContext = createContext(null)

// 핸들러를 생성함.
export const alarmCheckHandler = createAsyncHandler(alarmConstants.GET_ALARM_CHECK, 'alarmCheck')
export const alarmSelectedHandler = createAsyncHandler(alarmConstants.PUT_ALARM_SELECTED, 'alarmSelected')

// 액션을 핸들링하고, API 호출함.
export const GET_ALARM_CHECK = createAsyncDispatcher(alarmConstants.GET_ALARM_CHECK, getAlarmCheck)
export const PUT_ALARM_SELECTED = createAsyncDispatcher(alarmConstants.PUT_ALARM_SELECTED, putAlarmSelected)
