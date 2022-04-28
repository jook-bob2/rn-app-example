import ResponsiveImg from '@/components/ui/image/ResponsiveImg'
import { useUserEvContext } from '@/core/store/api/providers/UserEvApiProvider'
import { useConnector } from '@/core/store/common/providers/ConnectorStatusProvider'
import constants from '@/navigations/constants'
import { useNavigation } from '@react-navigation/core'
import { horizontalScale, moderateScale } from '@theme/scaling'
import React from 'react'
import { Dimensions, Platform, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import CarSelectionModal from '../modal/CarSelectionModal'

const { MY_CHABAP_TAB_FLOW, MY_INFO_CAR_MNGT_SCREEN } = constants

const win = Dimensions.get('window')
const imageHeight = win.height

const EvImage = styled.Image`
	width: ${moderateScale(350)}px;
	height: ${moderateScale(175)}px;
`

const ImageView = styled.View`
	align-items: center;
	padding-left: ${horizontalScale(16)}px;
	padding-right: ${horizontalScale(16)}px;
`

const EmptyView = styled.View`
	width: 100%;
	height: ${Platform.OS === 'ios' ? imageHeight / 3.54 : imageHeight / 3.25}px;
`

export default function MainMyChabapUncharged({ parents, carSelectModalData }) {
	const { Contents } = parents
	const { navigate } = useNavigation()
	const { loading: connLoading } = useConnector()
	const { state: evState } = useUserEvContext()
	const { data: userEvListData, loading: userEvListLoading } = evState.userEvList
	const evList = userEvListData?.data || []

	return (
		<Contents>
			{evList.length > 0 ? (
				<>
					<CarSelectionModal carSelectModalData={carSelectModalData} />
					<ImageView>
						<EvImage
							source={{
								uri: evList[0]?.evUrl,
							}}
						/>
					</ImageView>
				</>
			) : userEvListLoading || connLoading ? (
				<EmptyView></EmptyView>
			) : (
				<TouchableOpacity
					onPress={() =>
						navigate(MY_CHABAP_TAB_FLOW, {
							screen: MY_INFO_CAR_MNGT_SCREEN,
						})
					}
				>
					{Platform.OS === 'ios' ? (
						<ResponsiveImg source={require('@assets/images/empty_car_ios.png')} width={358} height={240} />
					) : (
						<ResponsiveImg
							source={require('@assets/images/empty_car_android.png')}
							width={320}
							height={201}
						/>
					)}
				</TouchableOpacity>
			)}
		</Contents>
	)
}
