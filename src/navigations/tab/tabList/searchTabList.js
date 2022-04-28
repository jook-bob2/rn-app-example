import BookmarkChargingSationMap from '@/components/bookmark/BookmarkChargingSationMap'
import Header from '@/components/ui/Header'
import { setOptions } from '@/navigations/config'
import constants from '@/navigations/constants'
import BookmarkDetailScreen from '@/screens/bookmark/BookmarkDetailScreen'
import BookmarkListScreen from '@/screens/bookmark/BookmarkListScreen'
import BookmarkModifyScreen from '@/screens/bookmark/BookmarkModifyScreen'
import ChargingCarSelectScreen from '@/screens/chargingStation/ChargingCarSelectScreen'
import ChargingStationDetailScreen from '@/screens/chargingStation/ChargingStationDetailScreen'
import ChargingStationMapScreen from '@/screens/chargingStation/ChargingStationMapScreen'
import ChargingStationNearScreen from '@/screens/chargingStation/ChargingStationNearScreen'
import ChargingStationPopularScreen from '@/screens/chargingStation/ChargingStationPopularScreen'
import ChargingStationSearchScreen from '@/screens/chargingStation/ChargingStationSearchScreen'

const {
	CHARGING_CAR_SELECT_SCREEN,
	CHARGING_STATION_SEARCH_SCREEN,
	CHARGING_STATION_MAP_SCREEN,
	BOOKMARK_DETAIL_SCREEN,
	BOOKMARK_LIST_SCREEN,
	BOOKMARK_MODIFY_SCREEN,
	BOOKMARK_CHARGING_STATION_MAP_SCREEN,
	CHARGING_STATION_NEAR_SCREEN,
	CHARGING_STATION_DETAIL_SCREEN,
	CHARGING_STATION_POPULAR_SCREEN,
} = constants

export default [
	{
		component: ChargingCarSelectScreen,
		name: CHARGING_CAR_SELECT_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '충전차량 선택', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: ChargingStationSearchScreen,
		name: CHARGING_STATION_SEARCH_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '차밥 존 선택', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: ChargingStationMapScreen,
		name: CHARGING_STATION_MAP_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '차밥 존 상세보기', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: ChargingStationNearScreen,
		name: CHARGING_STATION_NEAR_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '근처 차밥 충전소', tabShown: false, isBack: true, isNotification: false },
		}),
	},
	{
		component: ChargingStationDetailScreen,
		name: CHARGING_STATION_DETAIL_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '충전소 상세정보', tabShown: false, isBack: true, isNotification: false },
		}),
	},
	{
		component: ChargingStationPopularScreen,
		name: CHARGING_STATION_POPULAR_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '인기 차밥 충전소', tabShown: false, isBack: true, isNotification: false },
		}),
	},
	{
		component: BookmarkListScreen,
		name: BOOKMARK_LIST_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '즐겨찾기', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: BookmarkDetailScreen,
		name: BOOKMARK_DETAIL_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '즐겨찾기 주소 검색', tabShown: false, isBack: true, isNotification: true },
		}),
	},
	{
		component: BookmarkModifyScreen,
		name: BOOKMARK_MODIFY_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '우리집 수정', tabShown: false, isBack: true, isNotification: false },
		}),
	},
	{
		component: BookmarkChargingSationMap,
		name: BOOKMARK_CHARGING_STATION_MAP_SCREEN,
		options: setOptions({
			CustomHeader: Header,
			options: { title: '주소 검색', tabShown: false, isBack: true, isNotification: false },
		}),
	},
]
