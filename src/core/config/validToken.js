import jwtDecode from 'jwt-decode'

/*
 * 토큰 검증 함수
 */
export function validAccessToken(accessToken) {
	if (!accessToken) {
		return false
	}

	// jwt를 decode해서 payload를 추출한다.
	const decodePayload = jwtDecode(accessToken, {
		payload: true,
	})
	// exp가 UNIX Time으로 나오기 때문에 변환을 해준다.
	const exp = new Date(decodePayload.exp * 1000).getTime()
	const now = new Date().getTime()
	return now < exp ? true : false
}
