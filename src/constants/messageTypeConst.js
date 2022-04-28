/*
 * 대기열 상태 코드
 */
export const MsgTypeCd = {
	UNPAID: 'UNPAID',
	PROMOTION: 'PROMOTION',
	SUSPENDED_EVSE: 'SUSPENDED_EVSE',
	CHARGE_COMPLETE: 'CHARGE_COMPLETE',
	RETURN_QUEUE: 'RETURN_QUEUE',
	FAULTED: 'FAULTED',
	PAYMENT_FINISHED: 'PAYMENT_FINISHED',
	ANSWER_DONE: 'ANSWER_DONE',
	CANCEL_WARNING: 'CANCEL_WARNING',
	CANCEL_FINISHED: 'CANCEL_FINISHED',
	NOTICE: 'NOTICE',
	EXTINCTION_RESERVES: 'EXTINCTION_RESERVES',
	SECESSION: 'SECESSION',
	DORMANCY: 'DORMANCY',
	SHARE_INVITE: 'SHARE_INVITE',
	SHARE_DISABLE: 'SHARE_DISABLE',
	SHARE_REJECT: 'SHARE_REJECT',
	CHARGE_QUEUE_CHANGE: 'CHARGE_QUEUE_CHANGE',
	SUSPENDED_EV: 'SUSPENDED_EV',
	PREPARING: 'PREPARING',
	CHARGING: 'CHARGING',
	SHARE_STOP: 'SHARE_STOP',
}