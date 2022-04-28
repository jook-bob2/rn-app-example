import Button from '@/components/ui/button/Button'
import TextInput from '@/components/ui/input/TextInput'
import Modal from '@/components/ui/modal/Modal'
import Paragraph from '@/components/ui/text/Paragraph'
import SmallText from '@/components/ui/text/SmallText'
import statusConst from '@/constants/statusConst'
import { theme } from '@/theme'
import { device, horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import { ExclamationGraySvg, ThunderRedSvg, ThunderSvg } from '@util/svgUtil'
import React from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import styled from 'styled-components/native'

const Container = styled.View`
	flex: 1;
	z-index: 1;
	top: ${Platform.OS === 'ios' ? verticalScale(100) : verticalScale(50)}px;
`
const Wrap = styled.View`
	margin: ${moderateScale(24)}px;
	padding: ${moderateScale(16)}px;
	border-radius: ${moderateScale(6)}px;
	background-color: ${theme.colors.white};
`

const TitleView = styled.View`
	flex: 1;
	padding: ${moderateScale(10)}px;
	padding-left: ${moderateScale(8)}px;
	/* margin: 0px ${horizontalScale(10)}px; */
	align-items: flex-start;

	border-bottom-color: ${theme.colors.darkGray};
	margin-bottom: ${horizontalScale(15)}px;
`

const ItemView = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-bottom: ${verticalScale(8)}px;
	/* justify-content: center; */
`

const Feedback = styled.View`
	height: ${verticalScale((device.width - 50) / 4)}px;
`

const HeadView = styled.View`
	/* border-width: ${horizontalScale(2)}px;
	border-radius: ${moderateScale(5)}px;
	border-color: ${theme.colors.white}; */
	flex-direction: row;
`
const { CHARGEABLE, WAITING, INSPECTION } = statusConst
export default function BookmarkAddressModal({
	isAddressOpen,
	setIsAddressOpen,
	handleApplyPlaceName,
	title,
	subTitle,
	status,
	placeName,
	setPlaceName,
}) {
	//const [placeName, setPlaceName] = useState('')

	return (
		<>
			{/* <KeyboardAvoidingView style={{ flex: 1 }}> */}
			{/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
			<Modal.Common
				transparent={true}
				visible={isAddressOpen}
				// setClose={() => setIsAddressOpen(false)}
				animationType="fade"
			>
				<Feedback />
				<Container>
					<Wrap>
						<HeadView>
							{status === CHARGEABLE ? (
								<ThunderSvg
									style={{ ...theme.shadow(1.5), ...styles.icon }}
									width={moderateScale(42)}
									height={moderateScale(42)}
								/>
							) : status === WAITING ? (
								<ThunderRedSvg
									style={{ ...theme.shadow(1.5), ...styles.icon }}
									width={moderateScale(42)}
									height={moderateScale(42)}
								/>
							) : status === INSPECTION ? (
								<ExclamationGraySvg
									style={{ ...theme.shadow(1.5), ...styles.icon }}
									width={moderateScale(42)}
									height={moderateScale(42)}
								/>
							) : null}
							<TitleView>
								<Paragraph style={styles.valueTitle}>{title}</Paragraph>
								<SmallText style={styles.addrText}>{subTitle}</SmallText>
							</TitleView>
						</HeadView>
						<TextInput
							isShadow={false}
							style={styles.textInputStyle}
							placeholder={'주소 명칭을 입력하세요.'}
							placeholderTextColor={theme.colors.disabled}
							value={placeName}
							type={'text'}
							maxLength={10}
							autoCapitalize="none"
							onChangeText={(text) => setPlaceName(text)}
							setRemoveText={() => setPlaceName('')}
						/>

						<ItemView>
							<View style={{ justifyContent: 'flex-start' }}>
								<Button
									style={styles.cancelBtn}
									labelStyle={styles.labelText}
									onPress={() => setIsAddressOpen(false)}
								>
									<SmallText style={styles.btnText}>취소</SmallText>
								</Button>
							</View>
							<View style={{ justifyContent: 'flex-end' }}>
								<Button
									style={{
										...styles.applyBtn,
										backgroundColor: placeName ? theme.colors.turquoise : theme.colors.disabled,
									}}
									labelStyle={styles.labelText}
									onPress={() => handleApplyPlaceName()}
								>
									<SmallText
										style={{
											...styles.btnText,
											color: placeName ? theme.colors.white : theme.colors.text,
										}}
									>
										등록하기
									</SmallText>
								</Button>
							</View>
						</ItemView>
					</Wrap>
				</Container>
				<Feedback />
			</Modal.Common>
			{/* </TouchableWithoutFeedback> */}
			{/* </KeyboardAvoidingView> */}
		</>
	)
}

const styles = StyleSheet.create({
	cancelBtn: {
		width: Platform.OS === 'ios' ? moderateScale(145) : moderateScale(165),
		backgroundColor: theme.colors.disabled,
		borderWidth: moderateScale(1),
		borderRadius: moderateScale(6),
		borderColor: theme.colors.disabled,
	},
	applyBtn: {
		width: Platform.OS === 'ios' ? moderateScale(145) : moderateScale(165),
		borderWidth: moderateScale(1),
		borderRadius: moderateScale(6),
		borderColor: theme.colors.disabled,
	},
	valueTitle: {
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		fontSize: moderateScale(18),
		marginBottom: verticalScale(8),
	},
	addrText: {
		fontSize: moderateScale(15),
		color: theme.colors.darkGray,
	},
	textInputStyle: {
		alignSelf: 'center',
		borderWidth: moderateScale(1),
		borderColor: theme.colors.line,
		borderRadius: moderateScale(5),
		marginBottom: horizontalScale(16),
	},
	btnText: {
		fontSize: moderateScale(14),
	},
	icon: {
		...Platform.select({
			android: {
				borderRadius: moderateScale(21),
			},
		}),
	},
})
