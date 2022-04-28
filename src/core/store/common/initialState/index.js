// 유저 정보 초기 상태 값
export const userInitialState = {
	id: 0,
	defaultUserEvId: 0,
	name: '',
	email: '',
	accessToken: '',
	refreshToken: '',
	userTypeCd: '',
	pinFlag: '',
	isLoggined: false,
	autoSign: false,
}

export const alertInitialState = {
	isOpen: false,
	title: '',
	msg: '',
	onPress: () => {},
}

export const confirmInitialState = {
	isOpen: false,
	title: '',
	msg: '',
	cancelButtonName: '',
	confirmButtonName: '',
	onPress: () => {},
}

export const userSelectInitialState = {
	isOpen: false,
	onPress: () => {},
}

export const deviceInitialState = {
	fcmToken: '',
	instanceId: '',
	userId: '',
}

export const connectorInitialState = {
	status: 0,
}

export const errorInitialState = {
	isOpen: false,
	code: '',
	msg: '',
	onPress: () => {},
}

export const backColorInitialState = {
	topColor: '',
	bottomColor: '',
}

export const loadingInitialState = {
	isLoading: false,
}
