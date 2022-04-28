import { getRecentChargeList, getPaymentDetail, getPaymentList, getIsUnpaid } from '@/core/api/paymentApi'
import { createContext } from 'react'
import { paymentConstants } from '../costants/paymentConstants'
import { createAsyncDispatcher } from '../utils/createAsyncDispatcher'
import { createAsyncHandler } from '../utils/createAsyncHandler'

// 컨텍스트를 생성함
export const PaymentContext = createContext(null)

// 핸들러를 생성함.
export const recentChargeListHandler = createAsyncHandler(paymentConstants.GET_RECENT_CHARGE_LIST, 'recentChargeList')
export const paymentDetailHandler = createAsyncHandler(paymentConstants.GET_PAYMENT_DETAIL, 'paymentDetail')
export const paymentListHandler = createAsyncHandler(paymentConstants.GET_PAYMENT_LIST, 'paymentList')
export const isUnpaidHandler = createAsyncHandler(paymentConstants.GET_IS_UNPAID, 'isUnpaid')

// 액션을 핸들링하고, API 호출함.
export const GET_RECENT_CHARGE_LIST = createAsyncDispatcher(
	paymentConstants.GET_RECENT_CHARGE_LIST,
	getRecentChargeList,
)
export const GET_PAYMENT_DETAIL = createAsyncDispatcher(paymentConstants.GET_PAYMENT_DETAIL, getPaymentDetail)
export const GET_PAYMENT_LIST = createAsyncDispatcher(paymentConstants.GET_PAYMENT_LIST, getPaymentList)
export const GET_IS_UNPAID = createAsyncDispatcher(paymentConstants.GET_IS_UNPAID, getIsUnpaid)
