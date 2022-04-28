import React from 'react'
import { CommonProvider } from './common'
import { ApiProvider } from './api'

export default function Store({ children }) {
	return (
		<CommonProvider>
			<ApiProvider>{children}</ApiProvider>
		</CommonProvider>
	)
}
