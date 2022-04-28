import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import styled from 'styled-components/native'
import Paragraph from '@/components/ui/text/Paragraph'
import { theme } from '@/theme'
import { moderateScale, verticalScale } from '@/theme/scaling'
import { GET_TERMS_LIST } from '@/core/store/api/create/termsCreate'
import { useTermsContext } from '@/core/store/api/providers/TermsApiProvider'
import { GroupCd } from '@/constants/termsConst'

const Container = styled.View`
	flex: 1;
	background-color: #f8f8fa;
	padding-top: ${verticalScale(24)}px;
`

export default function ChargerInformation() {
	const { dispatch: termsDispatch } = useTermsContext()
	const [chargerList, setChargerList] = useState([])

	useEffect(() => {
		setChargerList()
		getChargerList()
	}, [])

	async function getChargerList() {
		try {
			const response = await GET_TERMS_LIST(termsDispatch, {
				grpCode: GroupCd.USAGE_GUIDE_CD,
			})
			const resData = response.data
			if (resData?.code === 'SUCCESS' && resData?.data) {
				const contents = resData.data
				setChargerList([contents[2]])
			}
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<Container>
			<FlatList
				style={styles.flatList}
				data={chargerList}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<View style={styles.View}>
						<Paragraph style={styles.Paragraph}>{item.subject}</Paragraph>
						<Text style={styles.Text}>{item.content}</Text>
					</View>
				)}
			/>
		</Container>
	)
}
const styles = StyleSheet.create({
	View: {
		flex: 1,
		width: '100%',
		marginBottom: verticalScale(16),
		backgroundColor: '#f8f8fa',
	},
	Paragraph: {
		marginBottom: moderateScale(10),
		fontSize: 17,
		color: '#191919',
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
	},
	Text: {
		color: '#191919',
		fontSize: 15,
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	ScrollView: {
		backgroundColor: '#f8f8fa',
	},
})
