// import React from 'react'
// import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
// import styled from 'styled-components/native'
// import { useUser } from '@/core/store/common/providers/UserProvider'
// import { theme } from '@/theme'

// const ImageBackground = styled.ImageBackground`
// 	flex: 1;
// 	width: 100%;
// `

// const ProfileView = styled.View`
// 	${theme.common.flexCenterColumn}
// 	padding: 20px;
// `

// const NameText = styled.Text`
// 	font-size: 20px;
// 	font-family: ${theme.fonts.spoqaHanSansNeo.bold};
// `

// const ImageView = styled.View`
// 	align-self: center;
// 	justify-content: center;
// 	padding: 30px 0px 10px 0px;
// `

// const Image = styled.Image`
// 	width: 130px;
// 	height: 130px;
// 	border-radius: 65.5px;
// `

// const LineView = styled.View`
// 	border: solid 1px gray;
// `

// const DrawerItemView = styled.View`
// 	top: 10px;
// `

// const Icon = styled.Image`
// 	width: 30px;
// 	height: 30px;
// `

// const labelStyle = { fontSize: 18, color: `${theme.colors.onSurface}`, fontFamily: `${theme.fonts.spoqaHanSansNeo.bold}` }

// export default function CustomDrawerContent(props) {
// 	const navigation = props?.navigation
// 	const {
// 		userState: { name },
// 	} = useUser()

// 	const { initUserInfo } = useUser()

// 	function handlePressLogout() {
// 		initUserInfo()
// 		navigation.navigate('SignInScreen')
// 		// auth()
// 		// 	.signOut()
// 		// 	.then(() => {
// 		// 		console.log('로그아웃 되었습니다.')
// 		// 		initUserInfo()
// 		// 		navigation.closeDrawer()
// 		// 		navigation.navigate('SignInScreen')
// 		// 	})
// 		// 	.catch((err) => console.log(err))
// 	}

// 	return (
// 		<ImageBackground
// 			source={require('@assets/images/background.jpeg')}
// 			resizeMode="stretch"
// 			imageStyle={{ opacity: 0.3 }}>
// 			<DrawerContentScrollView {...props}>
// 				{name && (
// 					<ProfileView>
// 						<NameText>{name}</NameText>
// 						<ImageView>
// 							<Image source={require('@assets/images/karina.jpeg')} />
// 						</ImageView>
// 					</ProfileView>
// 				)}

// 				<LineView />

// 				<DrawerItemView>
// 					<DrawerItem
// 						label="메인"
// 						icon={() => <Icon source={require('@assets/icons/home.png')} />}
// 						labelStyle={labelStyle}
// 						onPress={() => navigation.navigate('MainTabFlow', { screen: 'MainScreen' })}
// 					/>
// 					<DrawerItem
// 						label="프로필"
// 						labelStyle={labelStyle}
// 						icon={() => <Icon source={require('@assets/icons/profile.png')} />}
// 						onPress={() => navigation.navigate('MainTabFlow', { screen: 'MyProfileScreen' })}
// 					/>
// 					<DrawerItem
// 						label="박스오피스"
// 						labelStyle={labelStyle}
// 						icon={() => <Icon source={require('@assets/icons/movie.png')} />}
// 						onPress={() => navigation.navigate('MainTabFlow', { screen: 'BoxOfficeListScreen' })}
// 					/>
// 					<DrawerItem
// 						label="구글지도"
// 						labelStyle={labelStyle}
// 						icon={() => <Icon source={require('@assets/icons/movie.png')} />}
// 						onPress={() => navigation.navigate('GoogleMapDrawerFlow', { screen: 'GoogleMapTabFlow' })}
// 					/>

// 					<DrawerItem
// 						label="로그아웃"
// 						labelStyle={labelStyle}
// 						icon={() => <Icon source={require('@assets/icons/signout.png')} />}
// 						onPress={handlePressLogout}
// 					/>
// 				</DrawerItemView>
// 			</DrawerContentScrollView>
// 		</ImageBackground>
// 	)
// }
