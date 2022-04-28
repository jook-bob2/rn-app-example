import Background from '@/components/ui/Background'
import Modal from '@/components/ui/modal/Modal'
import React from 'react'

export default function AppContainer(props) {
	const { Screen, backgroundOption } = props
	return (
		<Background options={backgroundOption}>
			<Screen {...props} />
			<Modal.Alert />
			<Modal.Confirm />
			<Modal.Error />
		</Background>
	)
}
