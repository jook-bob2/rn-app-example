import { theme } from '@/theme'
import { horizontalScale, moderateScale, verticalScale } from '@/theme/scaling'
import React, { memo } from 'react'
import { View, FlatList, Platform, StyleSheet } from 'react-native'
import styled from 'styled-components/native'
import Modal from '../modal/Modal'
import Paragraph from '../text/Paragraph'
import SmallText from '../text/SmallText'
import { ArrowDownSvg, CheckSvg } from '@util/svgUtil'
import Left from '../view/Left'
import Right from '../view/Right'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Container = styled.View`
	/* background-color: ${theme.colors.background}; */
`

const SelectView = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	/* padding-left: ${moderateScale(8)}px; */
	/* min-width: ${verticalScale(120)}px; */
`

const InputIOS = styled.View`
	justify-content: center;
`

const InputAndroid = styled.View`
	justify-content: center;
`

const Pressable = styled.Pressable``

const ModalButton = styled.Pressable`
	padding: ${moderateScale(10)}px;
`

const LeftIconView = styled.View`
	margin-right: ${horizontalScale(8)}px;
`

const RightIconView = styled.View`
	justify-content: flex-end;
	padding: ${moderateScale(10)}px;
`

const Feedback = styled.View`
	height: 80%;
`

const ModalContainer = styled.View`
	flex: 1;
	justify-content: space-between;
	z-index: 1;
	flex-direction: column;
	justify-content: flex-end;
`

const ModalWrap = styled.View`
	border-top-left-radius: ${moderateScale(12)}px;
	border-top-right-radius: ${moderateScale(12)}px;
	background-color: ${theme.colors.white};
	/* padding-bottom: ${Platform.OS === 'ios' ? verticalScale(30) : verticalScale(10)}px; */
`

const TitleView = styled.View`
	padding-left: ${horizontalScale(10)}px;
	padding-right: ${horizontalScale(10)}px;
	padding-top: ${verticalScale(20)}px;
	padding-bottom: ${verticalScale(5)}px;
	margin: 0px ${horizontalScale(10)}px;
	align-items: flex-start;
`

const ItemView = styled.View`
	justify-content: space-between;
	flex-direction: row;
	align-items: center;
	padding-top: ${moderateScale(10)}px;
	padding-left: ${horizontalScale(10)}px;
	padding-right: ${horizontalScale(10)}px;
`

const SelectedView = styled.View`
	align-items: center;
	justify-content: center;
`

const ButtonView = styled.View`
	background-color: ${theme.colors.turquoise};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(25)}px;
	border-color: ${theme.colors.turquoise};
	padding: ${verticalScale(7)}px ${horizontalScale(22)}px;
	margin-left: ${horizontalScale(5)}px;
`

function Select({
	items,
	value,
	names,
	onValueChange,
	placeholder,
	isOpen,
	setOpen,
	title,
	animationType,
	leftIcon,
	containerStyle,
	selectviewStyle,
	feedbackStyle,
	inputIosStyle,
	inputAndroidStyle,
	rightIconViewStyle,
	rightChangeButton,
	placeholderStyle,
	textStyle,
}) {
	const insets = useSafeAreaInsets()

	function getValue(item) {
		for (const n of names) {
			if (item[n]) {
				return item[n]
			}
		}
	}

	function getValue2(item) {
		if (names.length > 1) return item[names[1]]
	}

	return (
		<>
			<Container style={containerStyle}>
				<Pressable onPressIn={() => setOpen()}>
					<SelectView style={selectviewStyle}>
						{leftIcon && <LeftIconView>{leftIcon}</LeftIconView>}
						{Platform.OS === 'ios' ? (
							<InputIOS style={inputIosStyle}>
								{!value ? (
									<SmallText style={placeholderStyle}>
										{placeholder ? placeholder : '선택하세요.'}
									</SmallText>
								) : (
									<SmallText style={{ color: theme.colors.text, ...textStyle }}>{value}</SmallText>
								)}
							</InputIOS>
						) : Platform.OS === 'android' ? (
							<InputAndroid style={inputAndroidStyle}>
								{!value ? (
									<SmallText style={placeholderStyle}>
										{placeholder ? placeholder : '선택하세요.'}
									</SmallText>
								) : (
									<SmallText style={{ color: theme.colors.text, ...textStyle }}>{value}</SmallText>
								)}
							</InputAndroid>
						) : null}
						<RightIconView style={rightIconViewStyle}>
							{rightChangeButton ? (
								<ButtonView>
									<SmallText style={styles.buttonText}>변경</SmallText>
								</ButtonView>
							) : (
								<ArrowDownSvg width={moderateScale(8)} height={moderateScale(4)} />
							)}
						</RightIconView>
					</SelectView>
				</Pressable>
			</Container>

			{isOpen && (
				<Modal.Common
					transparent={true}
					visible={isOpen}
					animationType={animationType ? animationType : 'none'}
					setClose={() => setOpen()}
				>
					<Feedback style={feedbackStyle} />
					<ModalContainer>
						<ModalWrap style={{ paddingBottom: insets.bottom }}>
							<TitleView>
								<Paragraph>{title}</Paragraph>
							</TitleView>
							<FlatList
								style={{
									...styles.flatList,
								}}
								data={items}
								keyExtractor={(item, index) => index}
								renderItem={(render) => (
									<ModalButton
										onPress={() => {
											onValueChange(render.item)
											setOpen(!isOpen)
										}}
									>
										{getValue(render.item) === value ? (
											<ItemView>
												<Left>
													<View>
														<SmallText>{getValue(render.item)}</SmallText>
														{names.length > 1 ? (
															<SmallText
																style={{
																	color: theme.colors.placeholder,
																	marginTop: verticalScale(5),
																}}
															>
																{getValue2(render.item)}
															</SmallText>
														) : null}
													</View>
												</Left>
												<Right>
													<SelectedView>
														<CheckSvg
															width={moderateScale(18)}
															height={moderateScale(12)}
														/>
													</SelectedView>
												</Right>
											</ItemView>
										) : (
											<ItemView>
												<View>
													<SmallText>{getValue(render.item)}</SmallText>
													{names.length > 1 ? (
														<SmallText
															style={{
																color: theme.colors.placeholder,
																marginTop: verticalScale(5),
															}}
														>
															{getValue2(render.item)}
														</SmallText>
													) : null}
												</View>
											</ItemView>
										)}
									</ModalButton>
								)}
								showsVerticalScrollIndicator={false}
								showsHorizontalScrollIndicator={false}
							/>
						</ModalWrap>
					</ModalContainer>
				</Modal.Common>
			)}
		</>
	)
}

const styles = StyleSheet.create({
	flatList: {
		backgroundColor: theme.colors.white,
	},
	buttonText: {
		fontWeight: '700',
		color: '#fff',
	},
})

export default memo(Select)
