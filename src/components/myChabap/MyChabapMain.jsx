import Paragraph from '@/components/ui/text/Paragraph'
import { useUser } from '@/core/store/common/providers/UserProvider'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { useNavigation } from '@react-navigation/core'
import { horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import React from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import styled from 'styled-components/native'
import ResponsiveImg from '../ui/image/ResponsiveImg'
import SmallText from '../ui/text/SmallText'
import Subtitle from '../ui/text/Subtitle'
import Row from '../ui/view/Row'

const Container = styled.View`
	flex: 1;
	background-color: #f8f8fa;
	padding: ${moderateScale(18)}px;
`

const UserInfoView = styled.View`
	flex: 1;
	justify-content: center;
	margin: ${verticalScale(5)}px ${horizontalScale(2.5)}px;
	padding: ${moderateScale(10)}px;
`

const NonUserInfoView = styled.TouchableOpacity`
	flex: 1;
	justify-content: center;
	margin: ${verticalScale(5)}px ${horizontalScale(2.5)}px;
	padding: ${moderateScale(10)}px;
`

const ScrollView = styled.ScrollView`
	flex: 1;
`

const RowContents = styled.View`
	flex-direction: row;
	flex: 0.2;
`

const ColumnContents = styled.ScrollView`
	flex: 0.8;
`

const Contents = styled.TouchableOpacity`
	justify-content: center;
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(8)}px;
	border-color: ${theme.colors.white};
	margin: ${moderateScale(5)}px;
	padding: ${moderateScale(13)}px;
`

const ImageView = styled.View`
	margin-bottom: ${verticalScale(10)}px;
`
const TextView = styled.View`
	margin-bottom: ${verticalScale(15)}px;
`

const BannerView = styled.View`
	align-items: center;
	justify-content: center;
	border-radius: ${moderateScale(8)}px;
	margin: ${moderateScale(5)}px;
`

const Image = styled.Image`
	width: ${moderateScale(38)}px;
	height: ${moderateScale(38)}px;
`

const ArrowImage = styled.Image`
	width: ${moderateScale(18)}px;
	height: ${moderateScale(18)}px;
	tint-color: ${theme.colors.disabled};
`

const ContentsView = styled.View`
	flex-direction: row;
	justify-content: space-between;
	padding: 0 ${moderateScale(5)}px;
`

const Footer = styled.View`
	margin: ${verticalScale(25)}px ${horizontalScale(8)}px ${verticalScale(50)}px;
	border-top-width: ${horizontalScale(1)}px;
	border-top-color: ${theme.colors.lightGray};
`

const FooterInfoView = styled.View`
	margin-top: ${verticalScale(24)}px;
`

const {
	AUTH_STACK_FLOW,
	MY_CHABAP_TAB_FLOW,
	SEARCH_TAB_FLOW,
	SIGN_IN_SCREEN,
	BOOKMARK_LIST_SCREEN,
	// NOTICE_MAIN_SCREEN,
	// MY_INFO_MAIN_SCREEN,
	CHABAP_GUIDE_SCREEN,
	NOTICE_LIST_SCREEN,
	NOTICE_EVENT_SCREEN,
	SETTING_MAIN_SCREEN,
	SERVICE_CENTER_MAIN_SCREEN,
	MY_CHABAP_CHARGE_HISTORY_SCREEN,
	MY_CHABAP_CAR_MANAGEMENT_SCREEN,
	// MY_CHABAP_FAMILY_TERMS_SCREEN,
} = constants

// const { SHARE_TYPE_SHARED } = shareConst

export default function MyChabapMain() {
	const { userState } = useUser()
	const { navigate } = useNavigation()
	// const { $confirm } = useConfirm()
	// const { $alert } = useAlert()
	// useFocusEffect(
	// 	useCallback(() => {
	// 		$confirm({
	// 			msg: '이차밥 님으로 부터 차밥식구로 공유되었습니다.\n\n공유 받으시겠습니까?',
	// 			cancelButtonName: '닫기',
	// 			confirmButtonName: '공유받기',
	// 			onPress: (result) => {
	// 				if (result)
	// 					navigate(MY_CHABAP_TAB_FLOW, {
	// 						screen: MY_CHABAP_FAMILY_TERMS_SCREEN,
	// 						params: { shareType: SHARE_TYPE_SHARED },
	// 					})
	// 			},
	// 		})
	// 	}, []),
	// )

	return (
		<Container>
			<ScrollView showsVerticalScrollIndicator={false}>
				{userState.isLoggined ? (
					<UserInfoView>
						<Paragraph style={styles.boldText}>{userState.name}님</Paragraph>
						<View style={{ margin: moderateScale(5) }} />
						<SmallText style={{ color: theme.colors.subtitle }}>{userState.email}</SmallText>
					</UserInfoView>
				) : (
					<NonUserInfoView onPress={() => navigate(AUTH_STACK_FLOW, { screen: SIGN_IN_SCREEN })}>
						<Row>
							<Paragraph style={styles.boldText}>로그인 해주세요</Paragraph>
							<ArrowImage source={require('@assets/icons/arrow_next.png')} />
						</Row>
						<View style={{ margin: moderateScale(5) }} />
						<SmallText style={{ color: theme.colors.subtitle }}>로그인 후 이용 가능합니다.</SmallText>
					</NonUserInfoView>
				)}

				<RowContents>
					<Contents
						style={{ ...styles.shadow, flex: 1 }}
						onPress={() =>
							navigate(SEARCH_TAB_FLOW, { screen: BOOKMARK_LIST_SCREEN, params: { useModal: false } })
						}
					>
						<ImageView>
							<Image source={require('@assets/icons/star.png')} />
						</ImageView>
						<TextView>
							<SmallText style={styles.contentsText}>즐겨찾는</SmallText>
							<SmallText style={styles.contentsText}>위치</SmallText>
						</TextView>
						{/* <ImageView>
						<Image source={require('@assets/icons/bookmark_rank.png')} tintColor={theme.colors.turquoise} />
					</ImageView> */}
					</Contents>
					<Contents
						style={{ ...styles.shadow, flex: 1 }}
						onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: MY_CHABAP_CAR_MANAGEMENT_SCREEN })}
					>
						<ImageView>
							<Image source={require('@assets/icons/car.png')} />
						</ImageView>
						<TextView>
							<SmallText style={styles.contentsText}>차량공유</SmallText>
							<SmallText style={styles.contentsText}>관리</SmallText>
						</TextView>
						{/* <ImageView>
						<Image source={require('@assets/icons/car.png')} tintColor={theme.colors.turquoise} />
					</ImageView> */}
					</Contents>
					<Contents
						style={{ ...styles.shadow, flex: 0.6 }}
						onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: SETTING_MAIN_SCREEN })}
					>
						<ImageView>
							<Image source={require('@assets/icons/setting.png')} />
						</ImageView>
						<TextView>
							<SmallText style={styles.contentsText}>설정</SmallText>
							<SmallText style={styles.contentsText}>{''}</SmallText>
						</TextView>
						{/* <ImageView>
						<Image source={require('@assets/icons/settings.png')} tintColor={theme.colors.turquoise} />
					</ImageView> */}
					</Contents>
				</RowContents>

				<ColumnContents>
					{/* Banner */}
					<BannerView>
						{Platform.OS === 'android' ? (
							<ResponsiveImg
								width={294}
								height={95}
								source={require('@assets/images/banner_android.png')}
							/>
						) : (
							<ResponsiveImg width={336} height={95} source={require('@assets/images/banner_ios.png')} />
						)}
					</BannerView>

					<Contents
						style={styles.shadow}
						onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: MY_CHABAP_CHARGE_HISTORY_SCREEN })}
					>
						<ContentsView>
							<SmallText style={styles.contentsText}>이용내역</SmallText>
							<ArrowImage source={require('@assets/icons/arrow_next.png')} />
						</ContentsView>
					</Contents>
					<Contents
						style={styles.shadow}
						onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: NOTICE_EVENT_SCREEN })}
					>
						<ContentsView>
							<SmallText style={styles.contentsText}>이벤트</SmallText>
							<ArrowImage source={require('@assets/icons/arrow_next.png')} />
						</ContentsView>
					</Contents>
					<Contents
						style={styles.shadow}
						onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: CHABAP_GUIDE_SCREEN })}
						ß
					>
						<ContentsView>
							<SmallText style={styles.contentsText}>차밥 이용안내</SmallText>
							<ArrowImage source={require('@assets/icons/arrow_next.png')} />
						</ContentsView>
					</Contents>
					{/* <Contents
					style={styles.shadow}
					onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: MY_INFO_MAIN_SCREEN })}
				>
					<ContentsView>
						<SmallText>회원정보</SmallText>
						<Image source={require('@assets/icons/arrow_next.png')} />
					</ContentsView>
				</Contents> */}
					<Contents
						style={styles.shadow}
						onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: SERVICE_CENTER_MAIN_SCREEN })}
					>
						<ContentsView>
							<SmallText style={styles.contentsText}>고객센터</SmallText>
							<ArrowImage source={require('@assets/icons/arrow_next.png')} />
						</ContentsView>
					</Contents>
					<Contents
						style={styles.shadow}
						onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: NOTICE_LIST_SCREEN })}
					>
						<ContentsView>
							<SmallText style={styles.contentsText}>공지사항</SmallText>
							<ArrowImage source={require('@assets/icons/arrow_next.png')} />
						</ContentsView>
					</Contents>
				</ColumnContents>

				<Footer>
					<FooterInfoView>
						<Subtitle
							style={{
								fontSize: moderateScale(17),
								marginBottom: verticalScale(10),
								color: theme.colors.darkGray,
							}}
						>
							주식회사 차밥
						</Subtitle>
						<Row style={{ justifyContent: 'space-between' }}>
							<SmallText style={styles.footerContentText}>대표자 : 정봉기</SmallText>
							<SmallText style={styles.footerContentText}>사업자등록번호 : 767-87-02058</SmallText>
						</Row>
						<SmallText style={styles.footerContentText}>
							주소 : 서울특별시 성동구 아차산로 17, 1205호(성수동1가, 서울숲엘타워)
						</SmallText>
						<SmallText style={styles.footerContentText}>대표 전화 : 070-7774-5929</SmallText>
						<SmallText style={styles.footerContentText}>메일 : chabap@chabap.com</SmallText>
						<SmallText
							style={{
								fontSize: moderateScale(14),
								color: theme.colors.darkGray,
							}}
						>
							Copyright 2021 © ChaBap Corp. All Rights Reserved
						</SmallText>
					</FooterInfoView>
				</Footer>
			</ScrollView>
		</Container>
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
	boldText: {
		fontWeight: 'bold',
		fontSize: moderateScale(20),
	},
	contentsText: {
		color: theme.colors.subtitle,
		fontSize: moderateScale(15),
	},
	footerContentText: {
		marginBottom: verticalScale(8),
		fontSize: moderateScale(15),
		color: theme.colors.darkGray,
	},
	icon: {
		...Platform.select({
			android: {
				borderRadius: moderateScale(99),
			},
		}),
	},
})
