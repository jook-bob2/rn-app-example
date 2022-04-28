import React from 'react'

export function setOptions({
	CustomHeader,
	options = { title: '', isBack: false, tabShown: false, isNotification: false },
}) {
	const { title, isBack, tabShown, isNotification } = options

	return {
		header: (props) => <CustomHeader {...props} />,
		isBack,
		title,
		tabShown,
		isNotification,
	}
}

export function setBackground({ options = { isFlat: false } }) {
	const { isFlat } = options

	return {
		isFlat,
	}
}
