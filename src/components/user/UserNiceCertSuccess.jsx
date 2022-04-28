import userConst from '@/constants/userConst'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { utils } from '@/utils/regularExp'
import { getNiceCertResponse } from '@api/userApi'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/core'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components/native'
import Paragraph from '../ui/text/Paragraph'

const Container = styled.View`
	${theme.common.flexCenterColumn};
	background-color: ${theme.colors.white};
`

const {
	PERSON_SIGN_UP_PERSON_INPUT_SCREEN,
	CORP_SIGN_UP_MANAGER_INPUT_SCREEN,
	FIND_ID_SCREEN,
	FIND_PASSWORD_SCREEN,
	MY_INFO_MODIFY_SCREEN,
	MY_CHABAP_TAB_FLOW,
} = constants
const { USER_PERSONAL, USER_CORPORATION, USER_FIND_ID, USER_FIND_PWD, USER_PERSONAL_MODIFY, CORP_PERSONAL_MODIFY } =
	userConst

export default function UserNiceCertSuccess() {
	const { params } = useRoute()
	const { replace } = useNavigation()
	const [authComplete, setAuthComplete] = useState(false)

	useFocusEffect(
		useCallback(() => {
			const { tokenVersionId, encData, integrityValue, iv, key } = params
			const isBase64 = utils.regEx.isBase64(decodeURIComponent(decodeURIComponent(encData)))
			if (isBase64) {
				getNiceCertResponse({
					tokenVersionId: decodeURIComponent(decodeURIComponent(tokenVersionId)),
					encData: decodeURIComponent(decodeURIComponent(encData)),
					integrityValue: decodeURIComponent(decodeURIComponent(integrityValue)),
					iv: decodeURIComponent(decodeURIComponent(iv)),
					key: decodeURIComponent(decodeURIComponent(key)),
				})
					.then((res) => {
						if (res.code === 'SUCCESS') {
							// const reqType = res.data.receivedata.reqType
							const receivedata =
								res.data && res.data?.receivedata ? JSON.parse(res.data.receivedata) : null

							const reqType = receivedata?.reqType || null
							const reqParams = receivedata?.params || null
							const resData = res.data

							//console.log('req type => ', reqType)
							console.log('req reqParams => ', reqParams)

							if (reqType === USER_PERSONAL) {
								setAuthComplete(true)
								replace(PERSON_SIGN_UP_PERSON_INPUT_SCREEN, {
									reponseData: resData,
									alarmFlag: reqParams.alarmFlag,
								})
							} else if (reqType === USER_CORPORATION) {
								setAuthComplete(true)
								replace(CORP_SIGN_UP_MANAGER_INPUT_SCREEN, {
									reponseData: resData,
									alarmFlag: reqParams.alarmFlag,
								})
							} else if (reqType === USER_FIND_ID) {
								setAuthComplete(true)
								replace(FIND_ID_SCREEN, { reponseData: resData })
							} else if (reqType === USER_FIND_PWD) {
								const birth = resData.birthdate
								const year = birth.substr(0, 4)
								const month = birth.substr(4, 2)
								const date = birth.substr(6, 2)
								const findReqInfo = {
									// email: params.findPasswd.email,
									email: reqParams.email,
									hp: resData.mobileno,
									birthdate: year + '-' + month + '-' + date,
									name: resData.name,
								}
								setAuthComplete(true)
								replace(FIND_PASSWORD_SCREEN, { findPasswd: findReqInfo })
								// 회원 수정일때
							} else if (reqType === USER_PERSONAL_MODIFY) {
								setAuthComplete(true)

								const responseData = {
									name: resData.name,
									hp: resData.mobileno,
									email: reqParams.personalData.email,
									addr1: reqParams.personalData.addr1,
									addr2: reqParams.personalData.addr2,
									userTypeCd: reqParams.personalData.userTypeCd,
									verifyFlag: reqParams.personalData.verifyFlag,
								}

								replace(MY_CHABAP_TAB_FLOW, {
									screen: MY_INFO_MODIFY_SCREEN,
									params: { personalData: responseData },
								})
								//replace(MY_CHABAP_TAB_FLOW, { screen: MY_INFO_MODIFY_SCREEN, params: responseData })
								// 법인 수정일때
							} else if (reqType === CORP_PERSONAL_MODIFY) {
								setAuthComplete(true)
								const responseData = {
									name: resData.name,
									hp: resData.mobileno,
									email: reqParams.personalData.email,
									addr1: reqParams.personalData.addr1,
									addr2: reqParams.personalData.addr2,
									userTypeCd: reqParams.personalData.userTypeCd,
									verifyFlag: reqParams.personalData.verifyFlag,
								}
								replace(MY_CHABAP_TAB_FLOW, {
									screen: MY_INFO_MODIFY_SCREEN,
									params: { personalData: responseData },
								})
								//goBack(MY_INFO_MODIFY_SCREEN)
							}
						}
					})
					.catch((err) => {
						console.log(err)
					})
			}
		}, []),
	)

	return (
		<Container>
			{!authComplete ? (
				<Paragraph>인증이 요청 중입니다.</Paragraph>
			) : (
				<Paragraph>인증이 완료 되었습니다.</Paragraph>
			)}
		</Container>
	)
}
