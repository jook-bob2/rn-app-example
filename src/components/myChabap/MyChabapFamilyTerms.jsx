import { useNavigation, useRoute } from '@react-navigation/core'
import React, { useState } from 'react'
import styled from 'styled-components/native'
import { theme } from '@/theme'
import { StyleSheet, View } from 'react-native'
import SmallText from '../ui/text/SmallText'
import constants from '@/navigations/constants'
import shareConst from '@/constants/shareConst'
import { verticalScale, horizontalScale, moderateScale } from '@theme/scaling'
import { ArrowNextSvg } from '@util/svgUtil'
import { useAlert } from '@/core/store/common/providers/AlertProvider'

const { MY_CHABAP_TAB_FLOW, MY_CHABAP_SHARED_SCREEN } = constants
const { SHARE_TYPE_SHARED } = shareConst

const Container = styled.View`
	flex: 1;
	background-color: #f8f8fa;
	padding: ${verticalScale(20)}px ${horizontalScale(24)}px 0;
`

const ScrollView = styled.ScrollView``

const TopView = styled.View`
	flex: 0.2;
	justify-content: center;
	padding: ${verticalScale(5)}px ${horizontalScale(10)}px;
`

const TermsView = styled.View`
	flex: 0.6;
	padding: ${verticalScale(10)}px 0;
`

const AllCheckView = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(10)}px;
	border-color: ${theme.colors.white};
	padding: ${verticalScale(10)}px ${horizontalScale(12)}px;
	margin: ${verticalScale(12)}px 0;
`

const CheckView = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: ${verticalScale(10)}px ${horizontalScale(15)}px ${verticalScale(10)}px ${horizontalScale(12)}px;
`

const CheckBox = styled.TouchableOpacity`
	background-color: ${({ checked }) => (checked ? theme.colors.turquoise : theme.colors.white)};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(22)}px;
	border-color: ${({ checked }) => (checked ? theme.colors.white : theme.colors.disabled)};
	padding: ${moderateScale(7)}px;
`

const AllCheckImage = styled.Image`
	width: ${moderateScale(18)}px;
	height: ${moderateScale(18)}px;
	tint-color: ${({ checked }) => (checked ? theme.colors.white : theme.colors.disabled)};
`

const CheckImage = styled.Image`
	width: ${moderateScale(14)}px;
	height: ${moderateScale(14)}px;
	tint-color: ${({ checked }) => (checked ? theme.colors.white : theme.colors.disabled)};
`

const ButtonView = styled.View`
	padding: 0 ${horizontalScale(24)}px ${verticalScale(40)}px;
`

const Button = styled.TouchableOpacity`
	align-items: center;
	justify-content: center;
	background-color: ${theme.colors.turquoise};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(12)}px;
	border-color: ${theme.colors.turquoise};
	padding: ${moderateScale(20)}px;
`

export default function MyChabapFamilyTerms() {
	const { navigate } = useNavigation()
	const { $alert } = useAlert()
	const {
		params: { shareQueueId, userEvId, model },
	} = useRoute()

	const [termCheck, setTermCheck] = useState({
		allChecked: false,
		checked1: false,
		checked2: false,
		checked3: false,
		checked4: false,
		checked5: false,
	})

	function handlePressCheck(name, value) {
		if (name === 'allChecked') {
			setTermCheck({
				...termCheck,
				allChecked: value,
				checked1: value,
				checked2: value,
				checked3: value,
				checked4: value,
				checked5: value,
			})
		} else {
			setTermCheck({
				...termCheck,
				allChecked: value === false ? false : null,
				[name]: value,
			})
		}
	}

	function handleClickAgreeButton() {
		if (!termCheck.checked1) {
			$alert('필수 동의 항목을 체크해주세요.')
			return false
		}
		if (!termCheck.checked2) {
			$alert('필수 동의 항목을 체크해주세요.')
			return false
		}
		if (!termCheck.checked3) {
			$alert('필수 동의 항목을 체크해주세요.')
			return false
		}
		if (!termCheck.checked4) {
			$alert('필수 동의 항목을 체크해주세요.')
			return false
		}
		if (!termCheck.checked5) {
			$alert('필수 동의 항목을 체크해주세요.')
			return false
		}

		navigate(MY_CHABAP_TAB_FLOW, {
			screen: MY_CHABAP_SHARED_SCREEN,
			params: {
				shareType: SHARE_TYPE_SHARED,
				shareQueueId: shareQueueId,
				userEvId: userEvId,
				model: model,
			},
		})
	}

	return (
		<>
			<Container>
				<ScrollView showsVerticalScrollIndicator={false}>
					<TopView>
						<SmallText style={styles.mainText}>서비스 이용약관에</SmallText>
						<View style={{ margin: moderateScale(5) }} />
						<SmallText style={styles.mainText}>동의해주세요.</SmallText>
					</TopView>

					<TermsView>
						<AllCheckView style={styles.shadow}>
							<SmallText style={styles.boldText}>차밥 약관 모두 동의</SmallText>
							<CheckBox
								checked={termCheck.allChecked}
								onPress={() => handlePressCheck('allChecked', !termCheck.allChecked)}
							>
								<AllCheckImage
									checked={termCheck.allChecked}
									source={require('@assets/icons/check.png')}
								/>
							</CheckBox>
						</AllCheckView>

						<CheckView>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<SmallText style={{ marginRight: horizontalScale(10) }}>
									차밥 식구 이용약관 (필수)
								</SmallText>
								<ArrowNextSvg width={moderateScale(10)} height={moderateScale(10)} />
							</View>
							<CheckBox
								checked={termCheck.checked1}
								onPress={() => handlePressCheck('checked1', !termCheck.checked1)}
							>
								<CheckImage
									checked={termCheck.allChecked}
									source={require('@assets/icons/check.png')}
								/>
							</CheckBox>
						</CheckView>

						<CheckView>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<SmallText style={{ marginRight: horizontalScale(10) }}>
									개인정보 수집 및 이용동의 (필수)
								</SmallText>
								<ArrowNextSvg width={moderateScale(10)} height={moderateScale(10)} />
							</View>
							<CheckBox
								checked={termCheck.checked2}
								onPress={() => handlePressCheck('checked2', !termCheck.checked2)}
							>
								<CheckImage
									checked={termCheck.allChecked}
									source={require('@assets/icons/check.png')}
								/>
							</CheckBox>
						</CheckView>

						<CheckView>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<SmallText style={{ marginRight: horizontalScale(10) }}>
									개인정보 처리 및 위탁에 대한 동의 (필수)
								</SmallText>
								<ArrowNextSvg width={moderateScale(10)} height={moderateScale(10)} />
							</View>
							<CheckBox
								checked={termCheck.checked3}
								onPress={() => handlePressCheck('checked3', !termCheck.checked3)}
							>
								<CheckImage
									checked={termCheck.allChecked}
									source={require('@assets/icons/check.png')}
								/>
							</CheckBox>
						</CheckView>

						<CheckView>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<SmallText style={{ marginRight: horizontalScale(10) }}>
									차밥 위치기반 서비스에 대한 이용약관 (필수)
								</SmallText>
								<ArrowNextSvg width={moderateScale(10)} height={moderateScale(10)} />
							</View>
							<CheckBox
								checked={termCheck.checked4}
								onPress={() => handlePressCheck('checked4', !termCheck.checked4)}
							>
								<CheckImage
									checked={termCheck.allChecked}
									source={require('@assets/icons/check.png')}
								/>
							</CheckBox>
						</CheckView>

						<CheckView>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<SmallText style={{ marginRight: horizontalScale(10) }}>
									개인정보 제 3자 제공 동의 (필수)
								</SmallText>
								<ArrowNextSvg width={moderateScale(10)} height={moderateScale(10)} />
							</View>
							<CheckBox
								checked={termCheck.checked5}
								onPress={() => handlePressCheck('checked5', !termCheck.checked5)}
							>
								<CheckImage
									checked={termCheck.allChecked}
									source={require('@assets/icons/check.png')}
								/>
							</CheckBox>
						</CheckView>
					</TermsView>
				</ScrollView>
			</Container>

			<ButtonView>
				<Button onPress={() => handleClickAgreeButton()}>
					<SmallText style={styles.buttonText}>동의</SmallText>
				</Button>
			</ButtonView>
		</>
	)
}

const styles = StyleSheet.create({
	shadow: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: verticalScale(1),
		},
		shadowOpacity: 0.29,
		shadowRadius: moderateScale(0.5),
		elevation: 1,
	},
	mainText: {
		fontWeight: 'bold',
		fontSize: moderateScale(28),
	},
	boldText: {
		fontWeight: 'bold',
		fontSize: moderateScale(18),
	},
	buttonText: {
		color: theme.colors.white,
		fontWeight: 'bold',
		fontSize: moderateScale(16),
	},
})
