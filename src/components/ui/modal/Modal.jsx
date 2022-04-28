import { useAlert } from '@/core/store/common/providers/AlertProvider'
import React, { memo } from 'react'
import { Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import Button from '../button/Button'
import SmallText from '../text/SmallText'
import styled from 'styled-components/native'
import { theme } from '@/theme'
import Paragraph from '../text/Paragraph'
import { useConfirm } from '@/core/store/common/providers/ConfirmProvider'
import { verticalScale, horizontalScale, moderateScale } from '@/theme/scaling'
import { useError } from '@/core/store/common/providers/ErrorProvider'

const Contents = styled.View`
	${theme.common.flexCenterColumn}
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 9999;
	background-color: rgba(0, 0, 0, 0.1);
`

const Wrap = styled.View`
	background-color: ${theme.colors.white};
	padding: ${moderateScale(24)}px;
	justify-content: center;
	align-items: center;
	border-radius: ${moderateScale(10)}px;
`

const TitleView = styled.View`
	width: 100%;
	background-color: ${theme.colors.white};
	justify-content: flex-start;
	align-items: flex-start;
`

const ContentView = styled.View`
	margin-bottom: ${moderateScale(16)}px;
`

const ButtonView = styled.View`
	margin-top: ${verticalScale(24)}px;
	justify-content: center;
	align-items: center;
	flex-direction: row;
`

const Overlay = styled.View`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 1;
	background-color: rgba(0, 0, 0, 0.4);
`

function Alert() {
	const { alertState, closeAlert } = useAlert()

	return (
		<Modal transparent={true} visible={alertState.isOpen} animationIn="slideInLeft" animationOut="slideOutRight">
			<Contents style={styles.shadow}>
				<Wrap>
					{alertState.title && (
						<TitleView>
							<Paragraph>{alertState.title}</Paragraph>
						</TitleView>
					)}
					<SmallText
						style={{
							...styles.centerText,
							// paddingTop: moderateScale(15),
							// paddingLeft: moderateScale(30),
							// paddingRight: moderateScale(30),
							// paddingBottom: moderateScale(20),
						}}
					>
						{typeof alertState.msg === 'function' ? <alertState.msg /> : alertState.msg}
					</SmallText>
					<ButtonView>
						<Button
							style={{
								...styles.confirmBtn,
								width: moderateScale(100),
								height: moderateScale(38),
							}}
							onPress={() => {
								if (alertState.onPress) {
									return new Promise((resolve) => {
										closeAlert()
										resolve(alertState.onPress('resolve'))
									})
								}
								return closeAlert()
							}}
						>
							<SmallText style={styles.text}>확인</SmallText>
						</Button>
					</ButtonView>
				</Wrap>
			</Contents>
		</Modal>
	)
}

function Confirm() {
	const { confirmState, closeConfirm } = useConfirm()

	return (
		<Modal transparent={true} visible={confirmState.isOpen}>
			<Contents style={styles.shadow}>
				<Wrap>
					{confirmState.title && (
						<TitleView>
							<Paragraph>{confirmState.title}</Paragraph>
						</TitleView>
					)}
					<ContentView>
						<SmallText style={styles.centerText}>
							{typeof confirmState.msg === 'function' ? <confirmState.msg /> : confirmState.msg}
						</SmallText>
					</ContentView>
					<ButtonView style={{ justifyContent: 'space-between' }}>
						<Button
							style={styles.closeBtn}
							onPress={() => {
								return new Promise((reject) => {
									closeConfirm()
									reject(confirmState.onPress(false))
								})
							}}
						>
							{!confirmState.cancelButtonName ? (
								<SmallText style={styles.closeText}>취소</SmallText>
							) : (
								<SmallText style={styles.closeText}>{confirmState.cancelButtonName}</SmallText>
							)}
						</Button>
						<Button
							style={{ ...styles.confirmBtn, marginLeft: horizontalScale(10) }}
							onPress={() => {
								return new Promise((resolve) => {
									closeConfirm()
									resolve(confirmState.onPress(true))
								})
							}}
						>
							{!confirmState.confirmButtonName ? (
								<SmallText style={styles.text}>확인</SmallText>
							) : (
								<SmallText style={styles.text}>{confirmState.confirmButtonName}</SmallText>
							)}
						</Button>
					</ButtonView>
				</Wrap>
			</Contents>
		</Modal>
	)
}

function Common({ children, setClose, visible, animationType, transparent, onShow }) {
	return (
		<Modal
			transparent={transparent ? transparent : true}
			visible={visible}
			onRequestClose={setClose}
			onShow={onShow}
			animationType={animationType ? animationType : 'none'}
		>
			<TouchableWithoutFeedback onPress={setClose}>
				<Overlay />
			</TouchableWithoutFeedback>
			{children}
		</Modal>
	)
}

function Error() {
	const { errorState, closeError } = useError()
	return (
		<Modal transparent={true} visible={errorState.isOpen} animationIn="slideInLeft" animationOut="slideOutRight">
			<Contents style={styles.shadow}>
				<Wrap>
					{errorState.title && (
						<TitleView>
							<Paragraph>{errorState.code}</Paragraph>
						</TitleView>
					)}
					<SmallText
						style={{
							...styles.centerText,
							// paddingTop: moderateScale(15),
							// paddingLeft: moderateScale(30),
							// paddingRight: moderateScale(30),
							// paddingBottom: moderateScale(20),
						}}
					>
						{typeof errorState.msg === 'function' ? <errorState.msg /> : errorState.msg}
					</SmallText>
					<ButtonView>
						<Button
							style={styles.closeBtn}
							onPress={() => {
								return new Promise((reject) => {
									closeError()
									reject(errorState.onPress(false))
								})
							}}
						>
							<SmallText style={styles.closeText}>닫기</SmallText>
						</Button>
						<Button
							style={{ ...styles.confirmBtn, marginLeft: horizontalScale(10) }}
							onPress={() => {
								return new Promise((resolve) => {
									closeError()
									resolve(errorState.onPress(true))
								})
							}}
						>
							<SmallText style={styles.text}>재요청</SmallText>
						</Button>
					</ButtonView>
				</Wrap>
			</Contents>
		</Modal>
	)
}

const styles = StyleSheet.create({
	closeBtn: {
		maxWidth: moderateScale(120),
		backgroundColor: theme.colors.darkGray,
	},
	confirmBtn: {
		maxWidth: moderateScale(120),
		backgroundColor: theme.colors.turquoise,
	},
	shadow: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: verticalScale(1),
		},
		shadowOpacity: 0.15,
		shadowRadius: moderateScale(1.15),
		elevation: 1,
	},
	closeText: {
		color: theme.colors.white,
		fontSize: moderateScale(14),
	},
	text: {
		color: theme.colors.white,
		fontSize: moderateScale(14),
	},
	centerText: {
		textAlign: 'center',
	},
})

export default { Alert: memo(Alert), Confirm: memo(Confirm), Common: memo(Common), Error: memo(Error) }
