import React from 'react'
import { commonProviderArray } from './providers'
import { ProviderCreate } from '@store/config/ProviderCreate'

export function CommonProvider({ children }) {
	return <ProviderCreate contexts={commonProviderArray}>{children}</ProviderCreate>
}
