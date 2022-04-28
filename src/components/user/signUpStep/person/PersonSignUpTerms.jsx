import Checkbox from '@/components/ui/checkbox/Checkbox'
import Modal from '@/components/ui/modal/Modal'
import Paragraph from '@/components/ui/text/Paragraph'
import SmallText from '@/components/ui/text/SmallText'
import Title from '@/components/ui/text/Title'
import Left from '@/components/ui/view/Left'
import Right from '@/components/ui/view/Right'
import { useTermsContext } from '@/core/store/api/providers/TermsApiProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { horizontalScale, moderateScale, verticalScale } from '@/theme/scaling'
import { useNavigation } from '@react-navigation/core'
import { ArrowForwardSvg, CheckmarkCircle, EmptyCircleSvg } from '@util/svgUtil'
import React, { useEffect, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components/native'

const { PERSON_NICE_CERT_WEBVIEW_SCREEN } = constants
const Container = styled.View`
	flex: 1;
	padding: ${moderateScale(24)}px;
	background-color: ${theme.colors.background};
`

const TitleView = styled.View`
	margin-top: ${verticalScale(40)}px;
	margin-bottom: ${verticalScale(60)}px;
`

const AccordionWrap = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-bottom: ${verticalScale(20)}px;
`

const TrueCheckImg = styled.Image`
	width: ${moderateScale(10)}px;
	height: ${verticalScale(10)}px;
	margin-top: ${verticalScale(1)}px;
`
const FalseCheckImg = styled.Image`
	width: ${moderateScale(10)}px;
	height: ${moderateScale(10)}px;
	margin-top: ${verticalScale(1)}px;
`

const Interval = styled.View`
	padding-right: ${({ right }) => (right ? right : 0)}px;
	padding-left: ${({ left }) => (left ? left : 0)}px;
	padding-top: ${({ top }) => (top ? top : 0)}px;
	padding-bottom: ${({ bottom }) => (bottom ? bottom : 0)}px;
`
const CheckView = styled.View`
	flex-direction: row;
	margin-bottom: ${verticalScale(20)}px;
	margin-top: ${verticalScale(6)}px;
	margin-left: ${horizontalScale(15)}px;
`
const SignInBtnView = styled.View`
	justify-content: flex-end;
	align-items: center;
`
const ConfirmButton = styled.TouchableOpacity`
	align-items: center;
	justify-content: center;
	width: 90%;
	height: ${verticalScale(50)}px;
	background-color: ${theme.colors.turquoise};
	border-color: ${theme.colors.white};
	border-radius: ${moderateScale(8)}px;
	border-width: ${moderateScale(1)}px;
	flex-direction: row;
	bottom: ${verticalScale(13)}px;
`

export default function PersonSignUpTerms() {
	const { navigate } = useNavigation()
	const { $alert } = useAlert()
	const { state: termsState } = useTermsContext()
	const personalTermList = termsState.personTermsList.data?.data || []
	const [useModal, setUseModal] = useState({ isOpen: false, content: '' })
	// const [checkedItems, setCheckedItems] = useState([])
	const [check, setCheck] = useState({
		0: false,
		1: false,
		2: false,
		sixthCheck: false,
		smsCheck: false,
		pushCheck: false,
		emailCheck: false,
		checkAll: false,
	})

	useEffect(() => {
		if (
			check[0] &&
			check[1] &&
			check[2] &&
			check.sixthCheck &&
			check.smsCheck &&
			check.pushCheck &&
			check.emailCheck
		) {
			setCheck({ ...check, checkAll: true })
		} else setCheck({ ...check, checkAll: false })
	}, [check[0], check[1], check[2], check.sixthCheck, check.smsCheck, check.pushCheck, check.emailCheck])

	useEffect(() => {
		if (check.smsCheck && check.pushCheck && check.emailCheck) {
			setCheck({ ...check, sixthCheck: true })
		} else setCheck({ ...check, sixthCheck: false })
	}, [check.smsCheck, check.pushCheck, check.emailCheck])

	const buttonBackgroundColor = useMemo(() => getButtonColor(), [check])
	function getButtonColor() {
		let color = check[0] && check[1] && check[2] ? theme.colors.turquoise : theme.colors.disabled

		return color
	}

	function handlePressCheck(value, name) {
		if (name === 'checkAll') {
			setCheck({
				0: value,
				1: value,
				2: value,
				sixthCheck: value,
				checkAll: value,
				smsCheck: value,
				pushCheck: value,
				emailCheck: value,
			})
		} else if (name === 'sixthCheck') {
			setCheck({
				...check,
				[name]: value,
				smsCheck: value,
				pushCheck: value,
				emailCheck: value,
			})
		} else {
			setCheck({
				...check,
				[name]: value,
			})
		}
	}
	function handleAcceptBtn() {
		if (check[0] && check[1] && check[2] === true) {
			const alarmCheck = {
				smsFlag: check.smsCheck ? 'Y' : 'N',
				emailFlag: check.emailCheck ? 'Y' : 'N',
				pushFlag: check.pushCheck ? 'Y' : 'N',
			}

			navigate(PERSON_NICE_CERT_WEBVIEW_SCREEN, { alarmFlag: alarmCheck })
		} else {
			$alert('필수 항목을 모두 선택해 주세요')
		}
	}
	function handleModal(id) {
		setUseModal({ ...useModal, isOpen: true, content: personalTermList[id].content })
	}

	return (
		<>
			<ScrollView
				nestedScrollEnabled={true}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				// nestedScrollEnabled={true}
				// keyboardDismissMode="on-drag"
				keyboardShouldPersistTaps="handled"
			>
				<Container>
					<TitleView>
						<Title style={styles.titleStyle}>서비스 이용약관에</Title>
						<Title style={styles.titleStyle}>동의해 주세요</Title>
					</TitleView>

					<AccordionWrap style={styles.inputItem}>
						<Paragraph style={styles.paragraph}>차밥 약관 모두 동의</Paragraph>
						<Right style={styles.rightHead}>
							<Checkbox
								onPress={() => handlePressCheck(!check.checkAll, 'checkAll')}
								checked={check.checkAll}
								checkStyle={styles.checkAll}
								customTrueImage={
									<CheckmarkCircle width={moderateScale(26)} height={moderateScale(26)} />
								}
								customFalseImage={
									<EmptyCircleSvg width={moderateScale(26)} height={moderateScale(26)} />
								}
							/>
						</Right>
					</AccordionWrap>

					{personalTermList.map((item, index) => (
						<AccordionWrap key={item.id}>
							<TouchableOpacity onPress={() => handleModal(index)}>
								<Left style={styles.left}>
									<View style={styles.titleView}>
										<SmallText style={styles.textStlye}>{item.subject}</SmallText>
									</View>
									<View style={styles.arrowImgStyle}>
										<ArrowForwardSvg width={moderateScale(6)} height={moderateScale(8)} />
									</View>
								</Left>
							</TouchableOpacity>
							<Right style={styles.right}>
								<Checkbox
									onPress={() => handlePressCheck(!check[index], index)}
									checked={check[index]}
									checkStyle={styles.checked}
									uncheckStyle={styles.unChecked}
									customTrueImage={
										<CheckmarkCircle width={moderateScale(20)} height={moderateScale(20)} />
									}
									customFalseImage={
										<EmptyCircleSvg width={moderateScale(20)} height={moderateScale(20)} />
									}
								/>
							</Right>
							{useModal.isOpen ? (
								<Modal.Common
									transparent={true}
									visible={useModal.isOpen}
									animationType="fade"
									// style={{ backgroundColor: theme.colors.white }}
									setClose={() => setUseModal(false)}
								>
									<View
										style={{
											backgroundColor: theme.colors.white,
											borderRadius: moderateScale(25),
											padding: moderateScale(15),
										}}
									>
										<ScrollView>
											<SmallText>{useModal.content}</SmallText>
										</ScrollView>
									</View>
								</Modal.Common>
							) : null}
						</AccordionWrap>
					))}

					<AccordionWrap>
						<Left style={styles.left}>
							<View style={styles.titleView}>
								<SmallText style={styles.textStlye}> 마케팅 목적 개인정보수집/이용 (선택)</SmallText>
							</View>
							<TouchableOpacity style={styles.arrowImgStyle}>
								<ArrowForwardSvg width={moderateScale(6)} height={moderateScale(8)} />
							</TouchableOpacity>
						</Left>

						<Right style={styles.right}>
							<Checkbox
								onPress={() => handlePressCheck(!check.sixthCheck, 'sixthCheck')}
								checked={check.sixthCheck}
								checkStyle={styles.checked}
								uncheckStyle={styles.unChecked}
								customTrueImage={
									<CheckmarkCircle width={moderateScale(20)} height={moderateScale(20)} />
								}
								customFalseImage={
									<EmptyCircleSvg width={moderateScale(20)} height={moderateScale(20)} />
								}
							/>
						</Right>
					</AccordionWrap>
					<CheckView>
						<Checkbox
							onPress={() => handlePressCheck(!check.smsCheck, 'smsCheck')}
							checked={check.smsCheck}
							checkStyle={styles.checkedPush}
							uncheckStyle={styles.unCheckedPush}
							customTrueImage={
								<>
									<TrueCheckImg
										style={styles.trueStyle}
										source={require('@assets/icons/check.png')}
									/>
									<Interval left={moderateScale(6)} />
									<SmallText style={styles.smallTextTrueStyle}>{'SMS'}</SmallText>
								</>
							}
							customFalseImage={
								<>
									<FalseCheckImg source={require('@assets/icons/check.png')} />
									<Interval left={moderateScale(6)} />
									<SmallText style={styles.smallTextStyle}>{'SMS'}</SmallText>
								</>
							}
						/>

						<Interval right={moderateScale(7)} />

						<Checkbox
							onPress={() => handlePressCheck(!check.pushCheck, 'pushCheck')}
							checked={check.pushCheck}
							checkStyle={styles.checkedPush}
							uncheckStyle={styles.unCheckedPush}
							customTrueImage={
								<>
									<TrueCheckImg
										style={styles.trueStyle}
										source={require('@assets/icons/check.png')}
									/>
									<Interval left={moderateScale(6)} />
									<SmallText style={styles.smallTextTrueStyle}>{'Push'}</SmallText>
								</>
							}
							customFalseImage={
								<>
									<FalseCheckImg source={require('@assets/icons/check.png')} />
									<Interval left={moderateScale(6)} />
									<SmallText style={styles.smallTextStyle}>{'Push'}</SmallText>
								</>
							}
						/>

						<Interval right={moderateScale(7)} />

						<Checkbox
							onPress={() => handlePressCheck(!check.emailCheck, 'emailCheck')}
							checked={check.emailCheck}
							checkStyle={styles.checkedPush}
							uncheckStyle={styles.unCheckedPush}
							customTrueImage={
								<>
									<TrueCheckImg
										style={styles.trueStyle}
										source={require('@assets/icons/check.png')}
									/>
									<Interval left={moderateScale(6)} />
									<SmallText style={styles.smallTextTrueStyle}>{'이메일'}</SmallText>
								</>
							}
							customFalseImage={
								<>
									<FalseCheckImg source={require('@assets/icons/check.png')} />
									<Interval left={moderateScale(6)} />
									<SmallText style={styles.smallTextStyle}>{'이메일'}</SmallText>
								</>
							}
						/>
					</CheckView>
				</Container>

				<SignInBtnView>
					<ConfirmButton
						onPress={handleAcceptBtn}
						style={{
							backgroundColor: buttonBackgroundColor,
						}}
					>
						<SmallText style={styles.buttonText}>다음</SmallText>
					</ConfirmButton>
				</SignInBtnView>
			</ScrollView>
		</>
	)
}
const styles = StyleSheet.create({
	titleStyle: {
		color: theme.colors.text,
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
	},

	right: {
		marginRight: horizontalScale(19),
	},
	rightHead: {
		marginRight: horizontalScale(6),
	},
	buttonText: {
		fontWeight: 'bold',
		fontSize: moderateScale(16),
		color: theme.colors.white,
	},
	allChecked: {
		marginLeft: 10,

		justifyContent: 'center',

		elevation: 1,
	},

	checkAll: {
		justifyContent: 'center',
	},
	checked: {
		justifyContent: 'center',
	},
	trueStyle: {
		tintColor: theme.colors.white,
	},

	unChecked: {
		justifyContent: 'center',
	},
	checkedPush: {
		width: moderateScale(84),
		height: moderateScale(32),
		marginRight: moderateScale(10),
		flexDirection: 'row',
		backgroundColor: theme.colors.turquoise,
		// borderWidth: moderateScale(2),
		// borderColor: theme.colors.darkGray,
		borderRadius: moderateScale(20),
		justifyContent: 'center',
	},

	unCheckedPush: {
		width: moderateScale(84),
		height: moderateScale(32),
		marginRight: moderateScale(10),
		flexDirection: 'row',
		backgroundColor: theme.colors.white,
		borderWidth: moderateScale(1),
		borderColor: theme.colors.lightGray,
		borderRadius: moderateScale(20),
		justifyContent: 'center',
	},
	titleView: {
		paddingLeft: horizontalScale(20),
	},

	inputItem: {
		height: verticalScale(55),
		backgroundColor: theme.colors.white,
		borderRadius: moderateScale(6),
		paddingLeft: horizontalScale(20),
		paddingRight: horizontalScale(10),
		borderColor: '#f8f8fa',
	},
	smallTextStyle: {
		fontSize: moderateScale(12),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	smallTextTrueStyle: {
		fontSize: moderateScale(12),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		color: theme.colors.white,
	},
	arrowImgStyle: {
		marginLeft: horizontalScale(14),
		alignSelf: 'center',
	},
	arrowStyle: {
		tintColor: theme.colors.darkGray,
	},
	textStlye: {
		color: theme.colors.darkGray,
		fontSize: moderateScale(15),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	paragraph: {
		fontSize: moderateScale(18),
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
	},
})
