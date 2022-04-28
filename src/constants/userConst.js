const AUTHORIZATION = 'Authorization' // 인증
const FORBIDDEN_OCCURRED = 'Forbidden has occurred.' // 403 에러
const UNAUTHORIZED = 'Unauthorized' // 401 에러
const UNKNOWN_ERROR = 'An unknown error has occurred.' // 알 수 없는 에러
const BAD_REQUEST = 'Bad request' // 400 에러
const UNAUTHORIZED_CODE = 'ESVC005' // 401 서버 익셉션 에러
const USER_CORPORATION = 'CORP' // 법인 회원
const USER_PERSONAL = 'PERSON' // 개인 회원
const USER_FIND_PWD = 'PASSWORD' //비밀번호 찾기
const USER_FIND_ID = 'ID' //아이디 찾기
const USER_PERSONAL_MODIFY = 'PERSON_HP_REAUTH' //개인 정보 휴대폰 재인증
const CORP_PERSONAL_MODIFY = 'CORP_HP_REAUTH' //법인 정보  휴대폰 재인증
const USER_PERSONAL_EV = 'PERSON_EV' //개인 차량 등록
const USER_CORPORATION_EV = 'CORP_EV' //법인 차량 등록
export default {
	AUTHORIZATION,
	FORBIDDEN_OCCURRED,
	UNAUTHORIZED,
	UNKNOWN_ERROR,
	BAD_REQUEST,
	UNAUTHORIZED_CODE,
	USER_CORPORATION,
	USER_PERSONAL,
	USER_FIND_PWD,
	USER_FIND_ID,
	USER_PERSONAL_MODIFY,
	CORP_PERSONAL_MODIFY,
	USER_PERSONAL_EV,
	USER_CORPORATION_EV,
}
