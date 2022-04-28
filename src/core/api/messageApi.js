import { authClient } from '../config/axios'

const BASE_PATH = '/message'
const GET_MESSAGE_LIST = `${BASE_PATH}/list`
const PATCH_READ_VALUE = `${BASE_PATH}/read/value`
const GET_UNREAD_COUNT = `${BASE_PATH}/unread/count`
const GET_MESSAGE_DETAIL = `${BASE_PATH}/detail`

/*
 * 메시지 리스트
 * param: page, size, sort
 * return: Page<MessageDto.MessageListResponse>
 */
export async function getMessageList({ page, size, sort }) {
	return await authClient.get(GET_MESSAGE_LIST, {
		params: {
			page,
			size,
			sort,
		},
	})
}

/*
 * 메시지 읽음 처리
 * param: id
 * return: boolean
 */
export async function patchReadValue({ id }) {
	return await authClient.patch(`${PATCH_READ_VALUE}/${id}`)
}

/*
 * 메시지 안읽은 개수
 * return: long
 */
export async function getUnreadCount() {
	return await authClient.get(GET_UNREAD_COUNT)
}

/*
 * 메시지 상세
 * param: id
 * return: MessageDto.Info
 */
export async function getMessageDetail({ id }) {
	return await authClient.get(`${GET_MESSAGE_DETAIL}/${id}`)
}
