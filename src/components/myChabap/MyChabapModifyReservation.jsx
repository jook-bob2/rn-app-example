import React from 'react'
import styled from 'styled-components/native'
import { theme } from '@/theme'
import { StyleSheet, View } from 'react-native'
import SmallText from '../ui/text/SmallText'
import { verticalScale, horizontalScale, moderateScale } from '@theme/scaling'

const Container = styled.View`
	flex: 1;
	padding: ${moderateScale(18)}px;
`

const ScrollView = styled.ScrollView``

const Wrap = styled.View`
	padding: ${verticalScale(8)}px ${horizontalScale(12)}px;
`

const Contents = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: ${verticalScale(5)}px ${horizontalScale(12)}px;
`

const SetTimeButton = styled.TouchableOpacity`
	align-items: center;
	justify-content: center;
	padding: ${moderateScale(5)}px;
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(22)}px;
	border-color: ${theme.colors.turquoise};
	background-color: ${theme.colors.turquoise};
`

const CancelButton = styled.TouchableOpacity`
	flex: 0.3;
	align-items: center;
	justify-content: center;
	padding: ${moderateScale(12)}px;
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(22)}px;
	border-color: ${theme.colors.disabled};
	background-color: ${theme.colors.disabled};
`

const UpdateButton = styled.TouchableOpacity`
	flex: 0.65;
	align-items: center;
	justify-content: center;
	padding: ${moderateScale(12)}px;
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(22)}px;
	border-color: ${theme.colors.turquoise};
	background-color: ${theme.colors.turquoise};
`

const ResultView = styled.View`
	justify-content: space-between;
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(22)}px;
	border-color: ${theme.colors.disabled};
	padding: ${verticalScale(8)}px ${horizontalScale(12)}px;
	margin-top: ${verticalScale(14)}px;
`

export default function MyChabapModifyReservation() {
	return (
		<Container>
			<ScrollView>
				<Wrap>
					<Contents>
						<SmallText>충전소 명</SmallText>
						<SmallText style={styles.boldText}>역삼 차밥충전소</SmallText>
					</Contents>
					<Contents>
						<SmallText>충전소 주소</SmallText>
						<SmallText style={styles.boldText}>서울시 강남구 테헤란로 25길 6-9</SmallText>
					</Contents>
					<Contents>
						<SmallText>상세 주소</SmallText>
						<SmallText style={styles.boldText}>석암빌딩 9층</SmallText>
					</Contents>
					<Contents>
						<SmallText>충전소 번호</SmallText>
						<SmallText style={styles.boldText}>A-1</SmallText>
					</Contents>
					<Contents>
						<SmallText>충전소 ID</SmallText>
						<SmallText style={styles.boldText}>123456789</SmallText>
					</Contents>
				</Wrap>

				<View style={{ borderBottomWidth: 1, borderColor: theme.colors.disabled }} />

				<Wrap>
					<Contents>
						<View
							style={{
								flex: 0.55,
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between',
							}}
						>
							<SmallText style={styles.boldText}>이용시간</SmallText>
							<SmallText>총 N시간 N분 이용</SmallText>
						</View>
						<View style={{ flex: 0.15 }}>
							<SetTimeButton>
								<SmallText style={[styles.buttonText, { fontSize: 12 }]}>변경</SmallText>
							</SetTimeButton>
						</View>
					</Contents>
				</Wrap>

				<View style={{ borderBottomWidth: 1, borderColor: theme.colors.disabled }} />

				<Wrap>
					<Contents>
						<SmallText>결제 방법</SmallText>
						<SmallText>1234*******123*</SmallText>
					</Contents>
					<Contents>
						<SmallText>결제 일시</SmallText>
						<SmallText>2022.01.18 11:41:51</SmallText>
					</Contents>
				</Wrap>

				<View style={{ borderBottomWidth: 1, borderColor: theme.colors.disabled }} />

				<Wrap>
					<Contents>
						<SmallText>충전기 전력량</SmallText>
						<SmallText>14kWh</SmallText>
					</Contents>
					<Contents>
						<SmallText>단가</SmallText>
						<SmallText>400원 / kWh</SmallText>
					</Contents>
					<Contents>
						<SmallText>충전 금액</SmallText>
						<SmallText>5,600원 / kWh</SmallText>
					</Contents>
				</Wrap>

				<View style={{ borderBottomWidth: 1, borderColor: theme.colors.disabled }} />

				<ResultView>
					<Contents>
						<SmallText>전력량</SmallText>
						<SmallText>14kWh</SmallText>
					</Contents>
					<Contents>
						<SmallText>단가</SmallText>
						<SmallText>400원 / kWh</SmallText>
					</Contents>
					<Contents>
						<SmallText>총 결제 금액</SmallText>
						<SmallText>5,600원 / kWh</SmallText>
					</Contents>
				</ResultView>
			</ScrollView>

			<Wrap>
				<Contents>
					<CancelButton style={styles.shadow}>
						<SmallText style={styles.buttonText}>예약취소</SmallText>
					</CancelButton>
					<UpdateButton style={styles.shadow}>
						<SmallText style={styles.buttonText}>수정완료</SmallText>
					</UpdateButton>
				</Contents>
			</Wrap>
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
		color: theme.colors.placeholder,
	},
	buttonText: {
		fontWeight: 'bold',
		color: 'white',
	},
})
