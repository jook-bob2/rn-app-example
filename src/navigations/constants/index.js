// FLOW Constants
const flowList = ['AUTH_STACK_FLOW', 'MAIN_TAB_FLOW', 'SEARCH_TAB_FLOW', 'MY_CHABAP_TAB_FLOW']

// AUTH_STACK_FLOW Constants
const authSackList = [
	'ON_BOARDING_SCREEN', // 첫 화면
	'SIGN_IN_SCREEN', // 로그인
	'SIGN_UP_SELECTION_SCREEN', // 회원가입 선택 페이지
	'CORP_SIGN_UP_TERMS_SCREEN', // 법인회원 이용약관 페이지
	'CORP_SIGN_UP_CORP_INPUT_SCREEN', // 법인회원 정보 입력 페이지
	'CORP_SIGN_UP_MANAGER_INPUT_SCREEN', // 담당자 정보 입력 페이지
	'PERSON_SIGN_UP_TERMS_SCREEN', // 개인 회원가입 약관동의
	'PERSON_SIGN_UP_ADDR_SCREEN', // 개인 회원가입 주소 찾기
	'PERSON_SIGN_UP_PERSON_INPUT_SCREEN', // 개인 회원정보 입력
	'CORP_SIGN_UP_VERIFIED_SCREEN', // 법인 회원가입 휴대폰 인증
	'CORP_SIGN_UP_CAR_INPUT_SCREEN', // 법인 회원가입 차량정보 입력
	'CORP_SIGN_UP_CAR_ADD_INPUT_SCREEN', // 법인 회원가입 차량정보 추가 입력
	'CORP_SIGN_UP_CARD_INPUT_SCREEN', // 법인 회원가입 카드정보 입력
	'PERSON_SIGN_UP_VERIFIED_SCREEN', // 개인 회원가입 휴대폰 인증
	'PERSON_SIGN_UP_CAR_INPUT_SCREEN', // 개인 회원가입 차량정보 입력
	'PERSON_SIGN_UP_CAR_ADD_INPUT_SCREEN', //  개인 회원가입 차량정보 추가 입력
	'PERSON_SIGN_UP_CARD_INPUT_SCREEN', // 개인 회원가입 카드정보 입력
	'ADDRESS_FIND_SCREEN', //주소 찾기
	'PERSON_NICE_CERT_WEBVIEW_SCREEN', // 나이스 웹뷰
	'CORP_NICE_CERT_WEBVIEW_SCREEN', // 나이스 웹뷰
	'NICE_CERT_SUCCESS_SCREEN', // 나이스 인증 성공 화면
	'ID_VERIFIED_SCREEN', // 유저 아이디 찾기 인증
	'PWD_VERIFIED_SCREEN', // 유저 비밀번호 찾기 인증
	'FIND_ID_SCREEN', //유저 아이디 찾기
	'FIND_PASSWORD_SCREEN', // 비밀번호 찾기
	'FIND_PASSWORD_BY_EMAIL_SCREEN', //아이디 유무 확인
]

// MAIN_TAB_FLOW Constants
const mainTabList = ['MAIN_SCREEN'] // 메인

// SEARCH_TAB_FLOW Constants
const searchTabList = [
	'CHARGING_CAR_SELECT_SCREEN', // 충천차량 선택
	'CHARGING_STATION_SEARCH_SCREEN', // 차밥주기 검색
	'CHARGING_STATION_MAP_SCREEN', // 차밥주기 맵
	'CHARGING_STATION_NEAR_SCREEN', // 근처 차밥 충전소
	'CHARGING_STATION_DETAIL_SCREEN', // 충전소 상세정보
	'CHARGING_STATION_POPULAR_SCREEN', // 인기 차밥 충전소
	'BOOKMARK_LIST_SCREEN', // 즐겨찾기 목록
	'BOOKMARK_DETAIL_SCREEN', // 즐겨찾기 상세
	'BOOKMARK_MODIFY_SCREEN', // 즐겨찾기 수정
	'BOOKMARK_CHARGING_STATION_MAP_SCREEN', //즐겨찾기 맵
]

// MY_CHABAP_TAB_FLOW Constants
const myChabapTabList = [
	'INICIS_WPAY_PAYMENT_WEBVIEW_SCREEN', // 이니시스 WPAY 카드 결제 웹뷰
	'INICIS_WPAY_CARD_REG_WEBVIEW_SCREEN', // 이니시스 WPAY 카드 등록 웹뷰
	'INICIS_WPAY_SIGN_UP_WEBVIEW_SCREEN', // 이니시스 WPAY 회원가입 웹뷰
	'INICIS_PAYMENT_WEBVIEW_SCREEN', // 이니시스 결제 웹뷰
	'INICIS_PAYMENT_RESULT_SCREEN', // 이니시스 결제 결과
	'MY_CHABAP_MAIN_SCREEN', // 차밥주기 메인
	'MY_CHABAP_CHARGE_HISTORY_SCREEN', // 이용 내역
	'MY_CHABAP_CHARGE_HISTORY_DETAIL_SCREEN', // 이용 상세 내역
	'MY_CHABAP_GIVING_AGAIN_SCREEN', // 다시 차밥 주기
	'MY_CHABAP_MODIFY_RESERVATION_SCREEN', // 예약 수정
	'MY_CHABAP_USAGE_DETAIL_SCREEN', // 이용정보
	'MY_CHABAP_PAYMENT_SCREEN', // 결제하기
	'MY_CHABAP_CAR_MANAGEMENT_SCREEN', // 차량 관리
	'MY_CHABAP_ADD_FAMILY_SCREEN', // 식구 추가하기
	'MY_CHABAP_FAMILY_TERMS_SCREEN', // 차밥 식구 이용약관
	'MY_CHABAP_SHARED_SCREEN', // 식구 공유받기
	'MY_CHABAP_SHARE_REQUEST_SCREEN', // 공유 요청
	'NOTICE_MAIN_SCREEN', // 공지 메인
	'NOTICE_LIST_SCREEN', // 공지 리스트
	'NOTICE_LIST_PART_SCREEN', // 공지사항, 이벤트 부분
	'NOTICE_EVENT_SCREEN', // 이벤트
	'NOTICE_ALARM_SCREEN', // 알림
	'ADDRESS_FIND_SCREEN', //주소 찾기
	'NOTICE_LIST_DETAILS_SCREEN', // 공지사항 상세보기
	'NOTICE_ALARM_DETAILS_SCREEN', // 알림 상세보기
	'NOTICE_EVENT_GUIDE', // 이벤트 그룹
	'CHABAP_GUIDE_SCREEN', // 차밥 안내
	'MY_INFO_ADDRESS_SEARCH_SCREEN', // 주소 검색
	'MY_INFO_CHANGE_CARD_INFO_SCREEN', // 결제 수단 관리
	'MY_INFO_CAR_MNGT_SCREEN', // 차량 정보 관리
	'MY_INFO_CHANGE_CAR_INFO_SCREEN', // 차량 정보 수정
	'MY_INFO_CHANGE_PASSWORD_SCREEN', // 비밀번호 변경
	'MY_INFO_CHANGE_NEW_PASSWORD_SCREEN', //새 비밀번호 변경
	'MY_INFO_MAIN_SCREEN', // 회원정보 메인
	'MY_INFO_MODIFY_SCREEN', // 회원정보 수정
	'FAQ_LIST_SCREEN', // FAQ
	'INQUIRY_LIST_SCREEN', // 문의내역
	'INQUIRY_WRITE_SCREEN', // 1:1 문의하기
	'SERVICE_CENTER_MAIN_SCREEN', // 고객센터 메인
	'SETTING_MAIN_SCREEN', // 설정 메인
	'PRIVACY_NOTICE_SCREEN', // 개인정보 취급방침
	'TERMS_USE_SCREEN', // 이용정보
	'EVENT_ALARM_SCREEN', // 혜택 알림 설정
	'CORP_MODIFY_NICE_CERT_WEBVIEW_SCREEN', //법인 나이스 인증
	'PERSON_MODIFY_NICE_CERT_WEBVIEW_SCREEN', //개인 나이스 인증
	'NICE_CERT_SUCCESS_SCREEN', // 나이스 인증 성공 화면
	'PERSON_SIGN_IN_CAR_INPUT_SCREEN', // 개인 차량 등록
	'CORP_SIGN_IN_CAR_INPUT_SCREEN', // 법인 차량 등록
]

// snake case to pascal case
function snakeToPascal(str) {
	let newStr = ''
	let isUpper = false
	for (let i = 0; i < str.length; i++) {
		if (i === 0) {
			newStr += str[i].toUpperCase()
		} else if (str[i] === '_' && i < str.length) {
			newStr += str[i + 1].toUpperCase()
			isUpper = true
		} else if (!isUpper) {
			newStr += str[i].toLowerCase()
		} else {
			isUpper = false
		}
	}
	return newStr
}

// constants 만듦
function createConstants(list = []) {
	let obj = {}
	for (let i = 0; i < list.length; i++) {
		obj = {
			...obj,
			[list[i]]: snakeToPascal(list[i]),
		}
	}

	return obj
}

export default {
	...createConstants(flowList),
	...createConstants(authSackList),
	...createConstants(mainTabList),
	...createConstants(searchTabList),
	...createConstants(myChabapTabList),
}
