import { UserProvider } from './UserProvider'
import { AlertProvider } from './AlertProvider'
import { ConfirmProvider } from './ConfirmProvider'
import { UserSelectProvider } from './UserSelectProvider'
import { DeviceProvider } from './DeviceProvider'
import { ConnectorStatusProvider } from './ConnectorStatusProvider'
import { ErrorProvider } from './ErrorProvider'
import { BackColorProvider } from './BackColorProvider'
import { LoadingProvider } from './LoadingProvider'

export const commonProviderArray = [
	UserProvider,
	AlertProvider,
	ConfirmProvider,
	UserSelectProvider,
	DeviceProvider,
	ErrorProvider,
	ConnectorStatusProvider,
	BackColorProvider,
	LoadingProvider,
].reverse()
