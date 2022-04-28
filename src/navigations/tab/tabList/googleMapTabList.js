import googleMapDrawerList from '@/navigations/drawer/drawerList/googleMapDrawerList'

const screens = []

export default [...googleMapDrawerList]
	.filter((value) => value.options.tabShown || value.params?.tabShown)
	.concat(screens)
