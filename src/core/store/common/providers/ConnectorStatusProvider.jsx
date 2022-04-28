import React, { useContext, useEffect, useReducer, useState } from 'react'
import { ConnectorStateContext } from '@store/common/create'
import { connectorInitialState } from '@store/common/initialState'
import { constants } from '@store/common/constants'
import { useUser } from './UserProvider'
import { getConnectorStatus } from '@/core/api/connectorApi'
import { connectorReducer } from '../reducer'
// import { storageUtil } from '@/utils/storageUtil'
// import { GET_CONNECTOR_STATUS } from '@/constants/connectorConst'
import { useError } from './ErrorProvider'

const { SET_CONNECTOR_STATUS } = constants

export function ConnectorStatusProvider({ children }) {
	const [connectorState, connectorDispatch] = useReducer(connectorReducer, connectorInitialState)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const { $error } = useError()

	const {
		userState: { isLoggined, id },
	} = useUser()

	/*
	 * 커넥터 연결상태 가져오기
	 */
	useEffect(() => {
		getConnStatus(false)
	}, [isLoggined, id])

	useEffect(() => {
		if (isLoggined && connectorState.status === 0) {
			getConnStatus(false)
		}
	}, [isLoggined, connectorState])

	async function getConnStatus(isNotLoad) {
		if (!isNotLoad) setLoading(true)
		// try {
		// 	const connectorStatusData = await storageUtil.getItem({ key: GET_CONNECTOR_STATUS })
		// 	if (connectorStatusData?.data) {
		// 		setConnectorStatus(connectorStatusData.data)
		// 	} else {
		// 		setConnectorStatus(1)
		// 	}
		// } catch (e2) {
		// 	console.log('get connector status in storage error => ', e2)
		// }

		if (isLoggined && id) {
			try {
				const response = await getConnectorStatus({ userId: id })
				console.log('================ 현재 연결 상태 ==> ', response.data, '===============')
				if (response?.code === 'SUCCESS' && response?.data) {
					const value = response.data
					setConnectorStatus(value)
					// await storageUtil.setItem({ key: GET_CONNECTOR_STATUS, value, options: { addYear: 1 } })
					setLoading(false)
					setError(null)

					return value
				}

				console.log('========== Connector code => ', response?.code)
				console.log('========== Connector msg => ', response?.msg)
				setLoading(false)
				setError(null)

				return
			} catch (e1) {
				console.log('============ Conector status error ===========')
				console.log('============ {} ===========', e1)
				setError(e1)
				setLoading(false)
				const errData = e1?.data
				if (errData?.code) {
					const { code, msg } = errData
					setTimeout(() => {
						$error({
							code,
							msg,
							onPress: (result) => {
								if (result) {
									getConnStatus(false)
								}
							},
						})
					}, 1000)
				}
			}
		} else {
			setConnectorStatus(0)
			setLoading(false)
		}
	}

	// /
	//  커넥터 연결상태 셋팅
	// /
	function setConnectorStatus(status) {
		connectorDispatch({
			type: SET_CONNECTOR_STATUS,
			payload: { status },
		})
	}

	return (
		<ConnectorStateContext.Provider value={{ connectorState, connectorDispatch, loading, error, getConnStatus }}>
			{children}
		</ConnectorStateContext.Provider>
	)
}

export function useConnector() {
	const { connectorState, connectorDispatch, loading, getConnStatus, error } = useContext(ConnectorStateContext)

	if (!connectorState) {
		throw new Error('Cannot find connectorState')
	}

	return { connectorState, connectorDispatch, loading, getConnStatus, error }
}
