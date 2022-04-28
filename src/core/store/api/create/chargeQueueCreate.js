import {
	getChargeQueueReturn,
	getRegistrationData,
	postChargeQueue,
	patchSendSteve,
	getChargingData,
} from '@/core/api/chargeQueueApi'
import { createContext } from 'react'
import { chargeQueueConstants } from '../costants/chargeQueueConstants'
import { createAsyncDispatcher } from '../utils/createAsyncDispatcher'
import { createAsyncHandler } from '../utils/createAsyncHandler'

// 컨텍스트를 생성함
export const ChargeQueueContext = createContext(null)

// 핸들러를 생성함.
export const chargeQueueReturnHandler = createAsyncHandler(chargeQueueConstants.GET_CHARGE_QUEUE_RETURN, 'returnData')
export const chargeQueueSaveHandler = createAsyncHandler(chargeQueueConstants.POST_CHARGE_QUEUE_SAVE, 'chargeQueueSave')
export const chargeQueueRegistrationHandler = createAsyncHandler(
	chargeQueueConstants.GET_CHARGE_QUEUE_REGISTRATION,
	'chargeQueueRegistration',
)
export const chargingDataHandler = createAsyncHandler(chargeQueueConstants.GET_CHARGING_DATA, 'chargingData')
export const sendSteveHandler = createAsyncHandler(chargeQueueConstants.PATCH_SEND_STEVE, 'sendSteve')

// 액션을 핸들링하고, API 호출함.
export const GET_CHARGE_QUEUE_RETURN = createAsyncDispatcher(
	chargeQueueConstants.GET_CHARGE_QUEUE_RETURN,
	getChargeQueueReturn,
)
export const POST_CHARGE_QUEUE_SAVE = createAsyncDispatcher(
	chargeQueueConstants.POST_CHARGE_QUEUE_SAVE,
	postChargeQueue,
)
export const GET_CHARGE_QUEUE_REGISTRATION = createAsyncDispatcher(
	chargeQueueConstants.GET_CHARGE_QUEUE_REGISTRATION,
	getRegistrationData,
)
export const GET_CHARGING_DATA = createAsyncDispatcher(chargeQueueConstants.GET_CHARGING_DATA, getChargingData)
export const PATCH_SEND_STEVE = createAsyncDispatcher(chargeQueueConstants.PATCH_SEND_STEVE, patchSendSteve)
