import { theme } from '@/theme'
import React from 'react'
import { LayoutAnimation, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
const Image = styled.Image`
	width: 18px;
	height: 18px;
`
const Accordion = ({ value, onPress }) => {
	// const [iss, setIsOpen] = useState(false)

	const toggleOpen = () => {
		//isOpen(!value)
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
		onPress(!value)
	}
	return (
		<TouchableOpacity onPress={toggleOpen} activeOpacity={0.7}>
			<Image
				tintColor={theme.colors.darkGray}
				source={value ? require('@assets/icons/arrow_up.png') : require('@assets/icons/arrow_down.png')}
			/>
		</TouchableOpacity>
	)
}

export default Accordion
