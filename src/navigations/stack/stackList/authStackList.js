import Header from '@/components/ui/Header'
import { setOptions } from '@/navigations/config'
import constants from '@/navigations/constants'
import OnBoardingScreen from '@/screens/onBoarding/OnBoardingScreen'
import AddressFindScreen from '@/screens/user/AddressFindScreen'
import CorpNiceCertWebviewScreen from '@/screens/user/CorpNiceCertWebviewScreen'
import CorpSignUpStepScreen from '@/screens/user/CorpSignUpStepScreen'
import FindIdScreen from '@/screens/user/FindIdScreen'
import FindPasswordScreen from '@/screens/user/FindPasswordScreen'
import NiceCertSuccessScreen from '@/screens/user/NiceCertSuccessScreen'
import PersonalNiceCertWebviewScreen from '@/screens/user/PersonNiceCertWebviewScreen'
import PersonSignUpStepScreen from '@/screens/user/PersonSignUpStepScreen'
import SignInScreen from '@/screens/user/SignInScreen'
import SignUpSelectionScreen from '@/screens/user/SignUpSelectionScreen'

const {
	ON_BOARDING_SCREEN,
	SIGN_IN_SCREEN,
	FIND_PASSWORD_SCREEN,
	SIGN_UP_SELECTION_SCREEN,
	CORP_SIGN_UP_TERMS_SCREEN,
	CORP_SIGN_UP_CORP_INPUT_SCREEN,
	CORP_SIGN_UP_MANAGER_INPUT_SCREEN,
	PERSON_SIGN_UP_TERMS_SCREEN,
	PERSON_SIGN_UP_ADDR_SCREEN,
	PERSON_SIGN_UP_PERSON_INPUT_SCREEN,
	CORP_SIGN_UP_VERIFIED_SCREEN,
	CORP_SIGN_UP_CAR_INPUT_SCREEN,
	CORP_SIGN_UP_CAR_ADD_INPUT_SCREEN,
	CORP_SIGN_UP_CARD_INPUT_SCREEN,
	PERSON_SIGN_UP_VERIFIED_SCREEN,
	PERSON_SIGN_UP_CAR_INPUT_SCREEN,
	PERSON_SIGN_UP_CAR_ADD_INPUT_SCREEN,
	PERSON_SIGN_UP_CARD_INPUT_SCREEN,
	ADDRESS_FIND_SCREEN,
	PERSON_NICE_CERT_WEBVIEW_SCREEN,
	CORP_NICE_CERT_WEBVIEW_SCREEN,
	NICE_CERT_SUCCESS_SCREEN,
	FIND_ID_SCREEN,
	PWD_VERIFIED_SCREEN,
	ID_VERIFIED_SCREEN,
	FIND_PASSWORD_BY_EMAIL_SCREEN,
} = constants

export default [
	{
		component: OnBoardingScreen,
		name: ON_BOARDING_SCREEN,
		options: { headerShown: false },
	},
	{
		component: SignInScreen,
		name: SIGN_IN_SCREEN,
		options: { headerShown: false },
	},

	{
		component: SignUpSelectionScreen,
		name: SIGN_UP_SELECTION_SCREEN,
		options: { headerShown: false },
	},
	{
		component: AddressFindScreen,
		name: ADDRESS_FIND_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '주소 검색', tabShown: false, isBack: true, isNotification: false },
		}),
	},
	/*비밀번호 찾기*/

	{
		component: FindPasswordScreen,
		name: FIND_PASSWORD_BY_EMAIL_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '비밀번호 찾기', tabShown: false, isBack: true, isNotification: false },
		}),
		params: { step: 0 },
	},
	{
		component: FindPasswordScreen,
		name: PWD_VERIFIED_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '개인회원 인증', tabShown: false, isBack: true, isNotification: false },
		}),
		params: { step: 1 },
	},
	{
		component: FindPasswordScreen,
		name: FIND_PASSWORD_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '비밀번호 변경', tabShown: false, isBack: true, isNotification: true },
		}),
		params: { step: 2 },
	},
	/*아이디 찾기*/
	{
		component: FindIdScreen,
		name: ID_VERIFIED_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '개인회원 인증', tabShown: false, isBack: true, isNotification: false },
		}),
		params: { step: 0 },
	},
	{
		component: FindIdScreen,
		name: FIND_ID_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '계정 찾기', tabShown: false, isBack: true, isNotification: true },
		}),
		params: { step: 1 },
	},

	/*
	 * 개인 회원 가입 스탭
	 */
	{
		component: PersonSignUpStepScreen,
		name: PERSON_SIGN_UP_TERMS_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '개인회원 이용약관', tabShown: false, isBack: true, isNotification: false },
		}),
		params: { step: 0 },
	},
	{
		component: PersonSignUpStepScreen,
		name: PERSON_SIGN_UP_VERIFIED_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '개인회원 인증', tabShown: false, isBack: true, isNotification: false },
		}),
		params: { step: 1 },
	},
	{
		component: PersonSignUpStepScreen,
		name: PERSON_SIGN_UP_PERSON_INPUT_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '개인 회원가입', tabShown: false, isBack: true, isNotification: false },
		}),
		params: { step: 2 },
	},
	{
		component: PersonSignUpStepScreen,
		name: PERSON_SIGN_UP_ADDR_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '개인 회원가입', tabShown: false, isBack: true, isNotification: false },
		}),
		params: { step: 3 },
	},
	{
		component: PersonSignUpStepScreen,
		name: PERSON_SIGN_UP_CAR_INPUT_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '차량등록', tabShown: false, isBack: true, isNotification: false },
		}),
		params: { step: 4 },
	},
	{
		component: PersonSignUpStepScreen,
		name: PERSON_SIGN_UP_CAR_ADD_INPUT_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '차량등록', tabShown: false, isBack: true, isNotification: false },
		}),
		params: { step: 5 },
	},
	{
		component: PersonSignUpStepScreen,
		name: PERSON_SIGN_UP_CARD_INPUT_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '카드등록', tabShown: false, isBack: true, isNotification: false },
		}),
		params: { step: 6 },
	},
	/*
	 * 법인 회원 가입 스탭
	 */
	{
		component: CorpSignUpStepScreen,
		name: CORP_SIGN_UP_TERMS_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '법인회원 이용약관', tabShown: false, isBack: true, isNotification: false },
		}),
		params: { step: 0 },
	},
	{
		component: CorpSignUpStepScreen,
		name: CORP_SIGN_UP_VERIFIED_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '법인회원 인증', tabShown: false, isBack: true, isNotification: false },
		}),
		params: { step: 1 },
	},
	{
		component: CorpSignUpStepScreen,
		name: CORP_SIGN_UP_MANAGER_INPUT_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '법인 회원가입', tabShown: false, isBack: true, isNotification: false },
		}),
		params: { step: 2 },
	},
	{
		component: CorpSignUpStepScreen,
		name: CORP_SIGN_UP_CORP_INPUT_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '법인 회원가입', tabShown: false, isBack: true, isNotification: false },
		}),
		params: { step: 3 },
	},
	{
		component: CorpSignUpStepScreen,
		name: CORP_SIGN_UP_CAR_INPUT_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '차량등록', tabShown: false, isBack: true, isNotification: false },
		}),
		params: { step: 4 },
	},
	{
		component: CorpSignUpStepScreen,
		name: CORP_SIGN_UP_CAR_ADD_INPUT_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '차량등록', tabShown: false, isBack: true, isNotification: false },
		}),
		params: { step: 5 },
	},
	{
		component: CorpSignUpStepScreen,
		name: CORP_SIGN_UP_CARD_INPUT_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '카드등록', tabShown: false, isBack: true, isNotification: false },
		}),
		params: { step: 6 },
	},
	{
		component: PersonalNiceCertWebviewScreen,
		name: PERSON_NICE_CERT_WEBVIEW_SCREEN,
		options: { headerShown: false },
	},
	{
		component: CorpNiceCertWebviewScreen,
		name: CORP_NICE_CERT_WEBVIEW_SCREEN,
		options: { headerShown: false },
	},
	{
		component: NiceCertSuccessScreen,
		name: NICE_CERT_SUCCESS_SCREEN,
		options: { headerShown: false },
	},
]
