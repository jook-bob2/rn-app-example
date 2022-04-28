import {
	alertInitialState,
	confirmInitialState,
	deviceInitialState,
	errorInitialState,
	userInitialState,
	userSelectInitialState,
} from '../initialState'
import { constants } from '../constants'

export const alertReducer = (state, { type, title, msg, onPress }) => {
	switch (type) {
		case constants.SET_OPEN_ALERT:
			return { ...alertInitialState, isOpen: true, title, msg, onPress }
		case constants.SET_CLOSE_ALERT:
			return { ...alertInitialState }
		default:
			break
	}
}

export const confirmReducer = (state, { type, title, msg, cancelButtonName, confirmButtonName, onPress }) => {
	switch (type) {
		case constants.SET_OPEN_CONFIRM:
			return { ...confirmInitialState, isOpen: true, title, msg, cancelButtonName, confirmButtonName, onPress }
		case constants.SET_CLOSE_CONFIRM:
			return { ...confirmInitialState }
		default:
			break
	}
}

export const userReducer = (state, { type, payload }) => {
	switch (type) {
		case constants.SET_ADD_USER:
			return payload
		case constants.SET_INIT_USER:
			return userInitialState
		default:
			break
	}
}

export const userSelectReducer = (state, { type, onPress }) => {
	switch (type) {
		case constants.SET_OPEN_USER_SELECT:
			return { ...userSelectInitialState, isOpen: !state.isOpen, onPress }
		case constants.SET_CLOSE_USER_SELECT:
			return { ...userSelectInitialState }
		default:
			break
	}
}

export const deviceReducer = (state, { type, payload }) => {
	switch (type) {
		case constants.SET_ADD_DEVICE:
			return payload
		case constants.SET_INIT_DEVICE:
			return deviceInitialState
		default:
			break
	}
}

export const connectorReducer = (state, { type, payload }) => {
	switch (type) {
		case constants.SET_CONNECTOR_STATUS:
			return payload
		default:
			break
	}
}

export const errorReducer = (state, { type, code, msg, onPress }) => {
	switch (type) {
		case constants.SET_OPEN_ERROR:
			return { ...errorInitialState, isOpen: true, code, msg, onPress }
		case constants.SET_CLOSE_ERROR:
			return { ...errorInitialState }
		default:
			break
	}
}

export const backColorReducer = (state, { type, topColor, bottomColor }) => {
	switch (type) {
		case constants.SET_TOP_COLOR:
			return { ...state, topColor }
		case constants.SET_BOTTOM_COLOR:
			return { ...state, bottomColor }
		default:
			break
	}
}

export const loadingReducer = (state, { type }) => {
	switch (type) {
		case constants.SET_SHOW_LOADING:
			return { ...state, isLoading: true }
		case constants.SET_HIDDEN_LOADING:
			return { ...state, isLoading: false }
		default:
			break
	}
}
