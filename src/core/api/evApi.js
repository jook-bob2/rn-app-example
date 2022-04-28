import { noneAuthClient } from '../config/axios'

const BASE_PATH = '/ev'
const EV_MANUFACTURERE_LIST = `${BASE_PATH}/manufacturer-list`
const EV_MODEL_LIST = `${BASE_PATH}/model-list`

export async function getEvManufacturerList() {
	return await noneAuthClient.get(EV_MANUFACTURERE_LIST)
}

export async function getEvModelList({ manufacturer }) {
	return await noneAuthClient.get(EV_MODEL_LIST, {
		params: {
			manufacturer,
		},
	})
}
