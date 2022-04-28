import { evConstants } from '../costants/evConstants'
import { evManufacturerListHandler, evModelListHandler } from '../create/evCreate'

export function evReducer(state, action) {
	switch (action.type) {
		case evConstants.GET_EV_MANUFACTURER_LIST:
		case evConstants.GET_EV_MANUFACTURER_LIST_SUCCESS:
		case evConstants.GET_EV_MANUFACTURER_LIST_ERROR:
			return evManufacturerListHandler(state, action)
		case evConstants.GET_EV_MODEL_LIST:
		case evConstants.GET_EV_MODEL_LIST_SUCCESS:
		case evConstants.GET_EV_MODEL_LIST_ERROR:
			return evModelListHandler(state, action)
	}
}
