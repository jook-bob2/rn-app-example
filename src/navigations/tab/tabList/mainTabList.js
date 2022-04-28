import Header from '@/components/ui/Header'
import { setOptions } from '@/navigations/config'
import MainScreen from '@/screens/main/MainScreen'
import constants from '@/navigations/constants'

const { MAIN_SCREEN } = constants

export default [
	{
		component: MainScreen,
		name: MAIN_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '', tabShown: true, isBack: false, isNotification: true },
		}),
	},
]
