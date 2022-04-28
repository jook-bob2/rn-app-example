import { useNavigation } from '@react-navigation/native'
import { horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import React, { memo, useEffect, useState } from 'react'
import { BackHandler, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu'
import styled from 'styled-components'
import SmallText from '../text/SmallText'

const ImageView = styled.View`
	flex-direction: row;
`

function PopupMenu({ icon, triggerStyle, menuOptions = [], item, defaultResult }) {
	const modify = menuOptions[0]
	const [isOpen, setIsOpen] = useState(true)
	const { isFocused } = useNavigation()
	useEffect(() => {
		const backAction = () => {
			return setIsOpen(false)
		}
		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
		return () => backHandler.remove()
	}, [])

	useEffect(() => {
		if (isFocused()) {
			setIsOpen(true)
		} else {
			setIsOpen(false)
		}
	}, [isFocused()])
	return (
		<>
			{isOpen && (
				<Menu>
					<MenuTrigger style={triggerStyle}>
						<TouchableOpacity>{icon ? icon : undefined}</TouchableOpacity>
					</MenuTrigger>

					{defaultResult === 'Y' ? (
						<MenuOptions
							optionsContainerStyle={{
								marginTop: verticalScale(25),
								marginLeft: horizontalScale(-15),
								width: '26%',
								alignItems: 'flex-start',
								alignSelf: 'center',
							}}
						>
							<MenuOption
								style={{
									flexDirection: 'row',
								}}
								onSelect={() => menuOptions[0].callback(item)}
							>
								<ImageView>
									<modify.icon></modify.icon>
									<SmallText style={styles.textStyle}>{menuOptions[0].text}</SmallText>
								</ImageView>
							</MenuOption>
						</MenuOptions>
					) : (
						<MenuOptions
							optionsContainerStyle={{
								marginTop: verticalScale(25),
								marginLeft: horizontalScale(-15),
								width: '26%',
								alignItems: 'flex-start',
								alignSelf: 'center',
							}}
						>
							{menuOptions.map((m) => (
								<MenuOption
									key={m.index}
									style={{
										flexDirection: 'row',
									}}
									onSelect={() => m.callback(item)}
								>
									<ImageView>
										<m.icon></m.icon>
										<SmallText style={styles.textStyle}>{m.text}</SmallText>
									</ImageView>
								</MenuOption>
							))}
						</MenuOptions>
					)}
				</Menu>
			)}
		</>
	)
}

const styles = StyleSheet.create({
	textStyle: {
		fontSize: moderateScale(14),
		marginTop: moderateScale(12),
	},
	imageStlye: {
		marginTop: moderateScale(-7),
		marginRight: moderateScale(-10),
		//backgroundColor: theme.colors.danger,
	},
	menuContainer: {
		top: verticalScale(20),
		right: horizontalScale(20),
	},
})

export default memo(PopupMenu)
