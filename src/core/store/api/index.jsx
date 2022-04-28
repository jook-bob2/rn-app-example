import React from 'react'
import { apiProviderArray } from './providers'
import { ProviderCreate } from '@store/config/ProviderCreate'

export function ApiProvider({ children }) {
	return <ProviderCreate contexts={apiProviderArray}>{children}</ProviderCreate>
}
