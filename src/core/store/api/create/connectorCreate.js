import { getConnectorStatus, getStatusAvailable } from '@/core/api/connectorApi'
import { createContext } from 'react'
import { connectorConstants } from '../costants/connectorConstants'
import { createAsyncDispatcher } from '../utils/createAsyncDispatcher'
import { createAsyncHandler } from '../utils/createAsyncHandler'

// 컨텍스트를 생성함
export const ConnectorContext = createContext(null)

// 핸들러를 생성함.
export const connectorStatusHandler = createAsyncHandler(connectorConstants.GET_CONNECTOR_STATUS, 'connectorStatus')
export const statusAvailableHandler = createAsyncHandler(connectorConstants.GET_STATUS_AVAILABLE, 'statusAvailable')

// 액션을 핸들링하고, API 호출함.
export const GET_CONNECTOR_STATUS = createAsyncDispatcher(connectorConstants.GET_CONNECTOR_STATUS, getConnectorStatus)
export const GET_STATUS_AVAILABLE = createAsyncDispatcher(connectorConstants.GET_STATUS_AVAILABLE, getStatusAvailable)
