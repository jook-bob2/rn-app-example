import MyInfoChangeNewPassword from '@/components/myInfo/MyInfoChangeNewPassword'
import Header from '@/components/ui/Header'
import { setOptions } from '@/navigations/config'
import constants from '@/navigations/constants'
import InicisPaymentResultScreen from '@/screens/myChabap/InicisPaymentResultScreen'
import InicisPaymentWebviewScreen from '@/screens/myChabap/InicisPaymentWebviewScreen'
import InicisWpayCardRegWebviewScreen from '@/screens/myChabap/InicisWpayCardRegWebviewScreen'
import InicisWpayPaymentWebviewScreen from '@/screens/myChabap/InicisWpayPaymentWebviewScreen'
import InicisWpaySignUpWebviewScreen from '@/screens/myChabap/InicisWpaySignUpWebviewScreen'
import MyChabapAddFamilyScreen from '@/screens/myChabap/MyChabapAddFamilyScreen'
import MyChabapCarManagementScreen from '@/screens/myChabap/MyChabapCarManagementScreen'
import MyChabapCarShareRequestScreen from '@/screens/myChabap/MyChabapCarShareRequestScreen'
import MyChabapChargeHistoryDetailScreen from '@/screens/myChabap/MyChabapChargeHistoryDetailScreen'
import MyChabapChargeHistoryScreen from '@/screens/myChabap/MyChabapChargeHistoryScreen'
import MyChabapFamilyTermsScreen from '@/screens/myChabap/MyChabapFamilyTermsScreen'
import MyChabapGivingAgainScreen from '@/screens/myChabap/MyChabapGivingAgainScreen'
import MyChabapMainScreen from '@/screens/myChabap/MyChabapMainScreen'
import MyChabapModifyReservationScreen from '@/screens/myChabap/MyChabapModifyReservationScreen'
import MyChabapPaymentScreen from '@/screens/myChabap/MyChabapPaymentScreen'
import MyChabapSharedScreen from '@/screens/myChabap/MyChabapSharedScreen'
import MyChabapUsageDetailScreen from '@/screens/myChabap/MyChabapUsageDetailScreen'
import MyInfoAddressSearchScreen from '@/screens/myInfo/MyInfoAddressSearchScreen'
import MyInfoCarMngtScreen from '@/screens/myInfo/MyInfoCarMngtScreen'
import MyInfoChangeCardInfoScreen from '@/screens/myInfo/MyInfoChangeCardInfoScreen'
import MyInfoChangeCarInfoScreen from '@/screens/myInfo/MyInfoChangeCarInfoScreen'
import MyInfoChangePasswordScreen from '@/screens/myInfo/MyInfoChangePasswordScreen'
import MyInfoMainScreen from '@/screens/myInfo/MyInfoMainScreen'
import MyInfoModifyScreen from '@/screens/myInfo/MyInfoModifyScreen'
import MyInfoVerifyCorpScreen from '@/screens/myInfo/MyInfoVerifyCorpScreen'
import MyInfoVerifyPersonScreen from '@/screens/myInfo/MyInfoVerifyPersonScreen'
import ChabapGuideScreen from '@/screens/notice/ChabapGuideScreen'
import NoticeAlarmDetailsScreen from '@/screens/notice/NoticeAlarmDetailsScreen'
import NoticeAlarmScreen from '@/screens/notice/NoticeAlarmScreen'
import NoticeEventScreen from '@/screens/notice/NoticeEventScreen'
import NoticeListDetailsScreen from '@/screens/notice/NoticeListDetailsScreen'
import NoticeListPartScreen from '@/screens/notice/NoticeListPartScreen'
import NoticeListScreen from '@/screens/notice/NoticeListScreen'
import NoticeMainScreen from '@/screens/notice/NoticeMainScreen'
import FAQListScreen from '@/screens/serviceCenter/FAQListScreen'
import InquiryListScreen from '@/screens/serviceCenter/InquiryListScreen'
import InquiryWriteScreen from '@/screens/serviceCenter/InquiryWriteScreen'
import ServiceCenterMainScreen from '@/screens/serviceCenter/ServiceCenterMainScreen'
import EventAlarmScreen from '@/screens/setting/EventAlarmScreen'
import PrivacyNoticeScreen from '@/screens/setting/PrivacyNoticeScreen'
import SettingMainScreen from '@/screens/setting/SettingMainScreen'
import TermsUseScreen from '@/screens/setting/TermsUseScreen'
import AddressFindScreen from '@/screens/user/AddressFindScreen'
import CorpSignInCarInputScreen from '@/screens/user/CorpSignInCarInputScreen'
import NiceCertSuccessScreen from '@/screens/user/NiceCertSuccessScreen'
import PersonSignInCarInputScreen from '@/screens/user/PersonSignInCarInputScreen'

const {
	INICIS_WPAY_PAYMENT_WEBVIEW_SCREEN,
	INICIS_WPAY_CARD_REG_WEBVIEW_SCREEN,
	INICIS_WPAY_SIGN_UP_WEBVIEW_SCREEN,
	INICIS_PAYMENT_WEBVIEW_SCREEN,
	INICIS_PAYMENT_RESULT_SCREEN,
	MY_CHABAP_MAIN_SCREEN,
	MY_CHABAP_CHARGE_HISTORY_SCREEN,
	MY_CHABAP_CHARGE_HISTORY_DETAIL_SCREEN,
	MY_CHABAP_GIVING_AGAIN_SCREEN,
	MY_CHABAP_MODIFY_RESERVATION_SCREEN,
	MY_CHABAP_USAGE_DETAIL_SCREEN,
	MY_CHABAP_PAYMENT_SCREEN,
	NOTICE_MAIN_SCREEN,
	NOTICE_LIST_SCREEN,
	NOTICE_LIST_PART_SCREEN,
	NOTICE_EVENT_SCREEN,
	NOTICE_ALARM_SCREEN,
	NOTICE_LIST_DETAILS_SCREEN,
	NOTICE_ALARM_DETAILS_SCREEN,
	CHABAP_GUIDE_SCREEN,
	MY_INFO_ADDRESS_SEARCH_SCREEN,
	MY_INFO_CHANGE_CARD_INFO_SCREEN,
	MY_INFO_CHANGE_CAR_INFO_SCREEN,
	MY_INFO_CHANGE_PASSWORD_SCREEN,
	MY_INFO_MAIN_SCREEN,
	MY_INFO_MODIFY_SCREEN,
	MY_INFO_CAR_MNGT_SCREEN,
	FAQ_LIST_SCREEN,
	INQUIRY_LIST_SCREEN,
	INQUIRY_WRITE_SCREEN,
	SERVICE_CENTER_MAIN_SCREEN,
	SETTING_MAIN_SCREEN,
	PRIVACY_NOTICE_SCREEN,
	TERMS_USE_SCREEN,
	MY_CHABAP_CAR_MANAGEMENT_SCREEN,
	MY_CHABAP_ADD_FAMILY_SCREEN,
	MY_CHABAP_FAMILY_TERMS_SCREEN,
	MY_CHABAP_SHARED_SCREEN,
	MY_CHABAP_SHARE_REQUEST_SCREEN,
	ADDRESS_FIND_SCREEN,
	EVENT_ALARM_SCREEN,
	MY_INFO_CHANGE_NEW_PASSWORD_SCREEN,
	PERSON_MODIFY_NICE_CERT_WEBVIEW_SCREEN,
	CORP_MODIFY_NICE_CERT_WEBVIEW_SCREEN,
	NICE_CERT_SUCCESS_SCREEN,
	PERSON_SIGN_IN_CAR_INPUT_SCREEN,
	CORP_SIGN_IN_CAR_INPUT_SCREEN,
} = constants

export default [
	{
		component: InicisWpayPaymentWebviewScreen,
		name: INICIS_WPAY_PAYMENT_WEBVIEW_SCREEN,
		options: { headerShown: false },
	},
	{
		component: InicisWpayCardRegWebviewScreen,
		name: INICIS_WPAY_CARD_REG_WEBVIEW_SCREEN,
		options: { headerShown: false },
	},
	{
		component: InicisWpaySignUpWebviewScreen,
		name: INICIS_WPAY_SIGN_UP_WEBVIEW_SCREEN,
		options: { headerShown: false },
	},
	{
		component: InicisPaymentResultScreen,
		name: INICIS_PAYMENT_RESULT_SCREEN,
		options: { headerShown: false },
	},
	{
		component: InicisPaymentWebviewScreen,
		name: INICIS_PAYMENT_WEBVIEW_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '이니시스 결제', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: MyChabapMainScreen,
		name: MY_CHABAP_MAIN_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '마이차밥', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: MyChabapChargeHistoryScreen,
		name: MY_CHABAP_CHARGE_HISTORY_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '이용내역', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: MyChabapChargeHistoryDetailScreen,
		name: MY_CHABAP_CHARGE_HISTORY_DETAIL_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '상세내역', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: MyChabapGivingAgainScreen,
		name: MY_CHABAP_GIVING_AGAIN_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '다시 차밥 주기', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: MyChabapModifyReservationScreen,
		name: MY_CHABAP_MODIFY_RESERVATION_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '예약수정', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: MyChabapUsageDetailScreen,
		name: MY_CHABAP_USAGE_DETAIL_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '이용내역', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: MyChabapPaymentScreen,
		name: MY_CHABAP_PAYMENT_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '이용금액 결제', tabShown: false, isBack: true, isNotification: true },
		}),
	},

	{
		component: MyChabapCarManagementScreen,
		name: MY_CHABAP_CAR_MANAGEMENT_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '차량공유 관리', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: MyChabapAddFamilyScreen,
		name: MY_CHABAP_ADD_FAMILY_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '식구 추가하기', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: MyChabapFamilyTermsScreen,
		name: MY_CHABAP_FAMILY_TERMS_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '차밥공유 이용약관', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: MyChabapSharedScreen,
		name: MY_CHABAP_SHARED_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '식구 공유받기', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: MyChabapCarShareRequestScreen,
		name: MY_CHABAP_SHARE_REQUEST_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '차량공유 요청하기', tabShown: false, isBack: true, isNotification: false },
		}),
	},
	{
		component: NoticeMainScreen,
		name: NOTICE_MAIN_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '공지사항', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: NoticeListPartScreen,
		name: NOTICE_LIST_PART_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '공지사항', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: NoticeListDetailsScreen,
		name: NOTICE_LIST_DETAILS_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '공지사항 상세보기', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: NoticeAlarmScreen,
		name: NOTICE_ALARM_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '알림', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: NoticeAlarmDetailsScreen,
		name: NOTICE_ALARM_DETAILS_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '알림', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: NoticeEventScreen,
		name: NOTICE_EVENT_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '이벤트', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: NoticeListScreen,
		name: NOTICE_LIST_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '차밥공지', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: ChabapGuideScreen,
		name: CHABAP_GUIDE_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '차밥 이용안내', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: MyInfoAddressSearchScreen,
		name: MY_INFO_ADDRESS_SEARCH_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '주소 검색', tabShown: true, isBack: true, isNotification: true },
		}),
	},
	{
		component: MyInfoChangeCardInfoScreen,
		name: MY_INFO_CHANGE_CARD_INFO_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '결제수단 관리', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: MyInfoChangeCarInfoScreen,
		name: MY_INFO_CHANGE_CAR_INFO_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '차량정보 수정', tabShown: false, isBack: true, isNotification: false },
		}),
	},
	{
		component: MyInfoChangePasswordScreen,
		name: MY_INFO_CHANGE_PASSWORD_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '비밀번호 확인', tabShown: false, isBack: true, isNotification: false },
		}),
	},
	{
		component: MyInfoChangeNewPassword,
		name: MY_INFO_CHANGE_NEW_PASSWORD_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '새 비밀번호 변경', tabShown: false, isBack: true, isNotification: false },
		}),
	},
	{
		index: 15,
		component: MyInfoMainScreen,
		name: MY_INFO_MAIN_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '회원정보', tabShown: false, isBack: true, isNotification: false },
		}),
	},
	{
		component: MyInfoModifyScreen,
		name: MY_INFO_MODIFY_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '회원정보 수정', tabShown: false, isBack: true, isNotification: false },
		}),
	},
	{
		component: MyInfoCarMngtScreen,
		name: MY_INFO_CAR_MNGT_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '차량정보 관리', tabShown: false, isBack: true, isNotification: false },
		}),
	},
	{
		component: FAQListScreen,
		name: FAQ_LIST_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: 'FAQ', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: InquiryListScreen,
		name: INQUIRY_LIST_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '문의내역', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: InquiryWriteScreen,
		name: INQUIRY_WRITE_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '1:1 문의하기', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: ServiceCenterMainScreen,
		name: SERVICE_CENTER_MAIN_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '고객센터', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: SettingMainScreen,
		name: SETTING_MAIN_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '설정', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: PrivacyNoticeScreen,
		name: PRIVACY_NOTICE_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '개인정보 취급방침', tabShown: true, isBack: true, isNotification: true },
		}),
	},
	{
		component: TermsUseScreen,
		name: TERMS_USE_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '이용약관', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: AddressFindScreen,
		name: ADDRESS_FIND_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '주소검색', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: EventAlarmScreen,
		name: EVENT_ALARM_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '혜택 알림 설정', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	//나이스 인증
	{
		component: MyInfoVerifyPersonScreen,
		name: PERSON_MODIFY_NICE_CERT_WEBVIEW_SCREEN,
		options: { headerShown: false },
	},
	//나이스 인증
	{
		component: MyInfoVerifyCorpScreen,
		name: CORP_MODIFY_NICE_CERT_WEBVIEW_SCREEN,
		options: { headerShown: false },
	},
	//나이스 인증
	{
		component: NiceCertSuccessScreen,
		name: NICE_CERT_SUCCESS_SCREEN,
		options: { headerShown: false },
	},
	//차량등록 개인
	{
		component: PersonSignInCarInputScreen,
		name: PERSON_SIGN_IN_CAR_INPUT_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '차량 등록', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	//차량등록 법인
	{
		component: CorpSignInCarInputScreen,
		name: CORP_SIGN_IN_CAR_INPUT_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '차량 등록', tabShown: false, isBack: true, isNotification: true },
		}),
	},
]
