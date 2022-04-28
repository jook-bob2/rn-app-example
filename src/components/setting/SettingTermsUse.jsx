import React, { useCallback, useEffect, useState } from 'react'
import { Animated, Easing, StyleSheet, View } from 'react-native'
import Paragraph from '../ui/text/Paragraph'
import styled from 'styled-components/native'
import { theme } from '@/theme'
import { horizontalScale, moderateScale, verticalScale } from '@/theme/scaling'
import Left from '../ui/view/Left'
import Right from '../ui/view/Right'
import SmallText from '../ui/text/SmallText'
import { useFocusEffect } from '@react-navigation/core'
import { ArrowDownSvg, ArrowUpSvg } from '@util/svgUtil'
import { useTermsContext } from '@/core/store/api/providers/TermsApiProvider'

const Container = styled.ScrollView`
	background-color: ${theme.colors.background};
`

const Wrap = styled.View`
	padding: ${verticalScale(16)}px ${horizontalScale(24)}px;
`

const ItemView = styled.View``

const Pressable = styled.Pressable`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: ${verticalScale(13)}px ${horizontalScale(16)}px;
	background-color: ${theme.colors.white};
	border-width: ${moderateScale(1)}px;
	border-color: ${theme.colors.background};
	border-radius: ${moderateScale(5)}px;
`

const Line = styled.View`
	position: absolute;
	width: 100%;
	top: ${({ top }) => verticalScale(top)}px;
	border-bottom-width: ${moderateScale(1)}px;
	border-bottom-color: ${theme.colors.line};
`

function ArrowDownImg() {
	return <ArrowDownSvg width={moderateScale(10)} height={moderateScale(6)} />
}

function ArrowUpImg() {
	return <ArrowUpSvg width={moderateScale(10)} height={moderateScale(6)} />
}

export default function SettingTermsUse() {
	const [accordionList, setAccordionList] = useState([])

	const { state: termsState } = useTermsContext()
	const usageList = termsState.termsList.data?.data || []

	useFocusEffect(
		useCallback(() => {
			setAccordionList(
				usageList.map((u) => {
					return { ...u, isOpen: false, animated: new Animated.Value(0) }
				}),
			)
		}, [usageList]),
	)

	useEffect(() => {
		setAnimatedStart()
	}, [accordionList])

	const setAnimatedStart = useCallback(() => {
		accordionList.forEach((acc) => {
			Animated.timing(acc.animated, {
				toValue: acc.isOpen ? 250 : 0,
				duration: 1000,
				easing: Easing.linear,
				useNativeDriver: true,
			}).start()
		})
	}, [accordionList])

	function handlePressAccordion(id) {
		setAccordionList(
			accordionList.map((a) => {
				if (a.id === id) {
					return { ...a, isOpen: !a.isOpen }
				}
				return { ...a }
			}),
		)
	}

	const moveToastToggle = (index) => {
		return accordionList[index].animated.interpolate({
			inputRange: [-25, 25],
			outputRange: [-25, 0],
			extrapolate: 'clamp',
		})
	}

	const animationStyles = (index) => {
		return [{ translateY: moveToastToggle(index) }]
	}

	return (
		<Container
			nestedScrollEnabled={true}
			showsVerticalScrollIndicator={false}
			showsHorizontalScrollIndicator={false}
		>
			<Wrap>
				{accordionList.map((acc, index) => (
					<View style={{ padding: moderateScale(4) }} key={acc.id}>
						<ItemView>
							<Pressable onPress={() => handlePressAccordion(acc.id)}>
								<Left>
									<Paragraph style={styles.paraText}>{acc.subject}</Paragraph>
								</Left>
								<Right>{acc.isOpen ? <ArrowUpImg /> : <ArrowDownImg />}</Right>
							</Pressable>

							{acc.isOpen && (
								<>
									<Line top={45} />
									<Animated.ScrollView
										style={[
											[
												{
													backgroundColor: theme.colors.white,
													padding: moderateScale(16),
												},
												{ transform: animationStyles(index) },
											],
										]}
										nestedScrollEnabled={true}
										snapToEnd={false}
										keyboardDismissMode="interactive"
										scrollEventThrottle={16}
										directionalLockEnabled
										showsVerticalScrollIndicator={false}
										showsHorizontalScrollIndicator={false}
									>
										<SmallText>{acc.content}</SmallText>
									</Animated.ScrollView>
								</>
							)}
						</ItemView>
					</View>
				))}
			</Wrap>
		</Container>
	)
}

const styles = StyleSheet.create({
	paraText: {
		fontSize: moderateScale(16),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
})
