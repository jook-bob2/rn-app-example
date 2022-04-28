import { addressConstants } from '../costants/addressConstants'
import { userAddressSearchHandler } from '../create/addressCreate'

export function addressReducer(state, action) {
	switch (action.type) {
		case addressConstants.GET_ADDRESS:
		case addressConstants.GET_ADDRESS_ERROR:
		case addressConstants.GET_ADDRESS_SUCCESS:
			return userAddressSearchHandler(state, action)
		default:
			throw new Error(`Unhanded action type: ${action.type}`)
	}
}
