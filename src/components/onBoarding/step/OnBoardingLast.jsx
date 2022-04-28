import Button from '@/components/ui/button/Button'
import Logo from '@/components/ui/Logo'
import Paragraph from '@/components/ui/text/Paragraph'
import SmallText from '@/components/ui/text/SmallText'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { moderateScale, verticalScale } from '@/theme/scaling'
import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { Platform, Pressable, StyleSheet } from 'react-native'
import styled from 'styled-components/native'

const { MAIN_TAB_FLOW, AUTH_STACK_FLOW, SIGN_UP_SELECTION_SCREEN, MAIN_SCREEN, SIGN_IN_SCREEN } = constants

const Container = styled.View`
	flex: 1;
	background-color: ${theme.colors.turquoise};
	justify-content: space-between;
`

const Header = styled.View`
	flex: 1;
	/* padding-top: ${verticalScale(158)}px; */
	align-items: center;
	justify-content: center;
`

const Contents = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
	padding-bottom: ${Platform.OS === 'ios' ? verticalScale(20) : verticalScale(40)}px;
`

const Line = styled.View`
	padding: ${moderateScale(5)}px;
`

export default function OnBoardingLast() {
	const { replace, navigate } = useNavigation()

	return (
		<Container>
			<Header>
				<Logo
					width={moderateScale(60)}
					height={moderateScale(76)}
					source={require('@assets/icons/logo_on_boarding.png')}
				/>
				<Line />
				<Paragraph style={{ ...styles.white, fontSize: moderateScale(18) }}>
					{'우리 Cha, Bap은 먹었니?'}
				</Paragraph>
			</Header>
			<Contents>
				<Button
					style={styles.joinBtn}
					onPress={() => navigate(AUTH_STACK_FLOW, { screen: SIGN_UP_SELECTION_SCREEN })}
				>
					<SmallText
						style={{
							...styles.buttonFontSize,
							color: theme.colors.turquoise,
							fontFamily: theme.fonts.spoqaHanSansNeo.bold,
						}}
					>
						차밥 시작하기
					</SmallText>
				</Button>

				<Line />

				<Button style={styles.mainBtn} onPress={() => replace(MAIN_TAB_FLOW, { screen: MAIN_SCREEN })}>
					<SmallText style={{ ...styles.buttonFontSize, color: theme.colors.white }}>둘러보기</SmallText>
				</Button>

				<Pressable
					style={styles.loginBtn}
					onPress={() => navigate(AUTH_STACK_FLOW, { screen: SIGN_IN_SCREEN })}
				>
					<SmallText style={{ ...styles.buttonFontSize, color: theme.colors.white }}>
						이미 회원이신가요?
					</SmallText>
				</Pressable>
			</Contents>
		</Container>
	)
}

const styles = StyleSheet.create({
	joinBtn: {
		backgroundColor: theme.colors.white,
	},
	white: {
		color: theme.colors.white,
	},
	mainBtn: {
		borderWidth: moderateScale(2),
		borderColor: theme.colors.white,
	},
	loginBtn: {
		paddingTop: moderateScale(24),
		borderBottomWidth: moderateScale(2),
		borderBottomColor: theme.colors.white,
	},
	buttonFontSize: {
		fontSize: moderateScale(16),
	},
})
