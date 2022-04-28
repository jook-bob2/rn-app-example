import React, { useEffect, useRef, useState } from 'react'
import { useUser } from '@/core/store/common/providers/UserProvider'
import styled from 'styled-components/native'
import { theme } from '@/theme'
import { useConfirm } from '@/core/store/common/providers/ConfirmProvider'
import Button from '../ui/button/Button'
import { storageUtil } from '@/utils/storageUtil'
import ImagePicker from 'react-native-image-crop-picker'
import { Image, View } from 'react-native'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import NaverMapView, { Align, Marker } from '@/map'
import useLocPermission from '@/hooks/useLocPermission'
import useGeolocation from '@/hooks/useGeolocation'
import { nmapOpen } from '@/map/navigationOpen'

const Container = styled.ScrollView`
	flex: 1;
	padding: 20px;
`

const Contents = styled.View`
	flex: 1;
`

const Text = styled.Text`
	font-size: 20px;
	font-family: ${theme.fonts.spoqaHanSansNeo.medium};
`

export default function Test() {
	const { userState } = useUser()
	const { $confirm } = useConfirm()
	const [email, setEmail] = useState('')
	const [imageList, setImageList] = useState([])
	const { $alert } = useAlert()
	const mapView = useRef(null)
	const [enableLayerGroup, setEnableLayerGroup] = useState(true)
	const { onCheckLocationPermission } = useLocPermission()
	const { getLocation } = useGeolocation()
	const [loc, setLoc] = useState({
		latitude: 0,
		longitude: 0,
	})

	useEffect(() => {
		onCheckLocationPermission().then((res) => {
			if (res) {
				getLocation().then((res2) => {
					if (res2.code === 200) {
						setLoc({
							latitude: res2.latitude,
							longitude: res2.longitude,
						})
					}
				})
			}
		})
	}, [])

	useEffect(() => {
		console.log(
			storageUtil
				.getItem({ key: 'token' })
				.then((result) => {
					setEmail(result?.data?.email)
				})
				.catch((err) => {
					console.log(err)
				}),
		)
	}, [])

	return (
		<Container>
			<Text>테스트 스크린</Text>
			<Contents>
				<NaverMapView
					ref={mapView}
					style={{ width: '100%', height: '100%' }}
					showsMyLocationButton={true}
					center={{ ...loc, zoom: 16 }}
					onTouch={(e) => console.warn('onTouch', JSON.stringify(e.nativeEvent))}
					onCameraChange={(e) => console.warn('onCameraChange', JSON.stringify(e))}
					onMapClick={(e) => console.warn('onMapClick', JSON.stringify(e))}
					useTextureView
				>
					<Marker
						coordinate={loc}
						onClick={() => {
							console.warn('onClick! p0')
							mapView.current.setLayerGroupEnabled('bike', enableLayerGroup)
							mapView.current.setLayerGroupEnabled('transit', enableLayerGroup)
							setEnableLayerGroup(!enableLayerGroup)
						}}
						caption={{ text: 'this station name', align: Align.Bottom }}
					/>
					{/* <Marker
						coordinate={P0}
						onClick={() => {
							console.warn('onClick! p0')
							// mapView.current.setLayerGroupEnabled(LayerGroup.LAYER_GROUP_BICYCLE, enableLayerGroup);
							// mapView.current.setLayerGroupEnabled(LayerGroup.LAYER_GROUP_TRANSIT, enableLayerGroup);
							setEnableLayerGroup(!enableLayerGroup)
						}}
						caption={{ text: 'test caption', align: Align.Left }}
					/>
					<Marker coordinate={P1} pinColor="blue" zIndex={1000} onClick={() => console.warn('onClick! p1')} />
					<Marker
						coordinate={P2}
						pinColor="red"
						zIndex={100}
						alpha={0.5}
						onClick={() => console.warn('onClick! p2')}
					/>
					<Marker
						coordinate={P4}
						onClick={() => console.warn('onClick! p4')}
						image={require('@assets/icons/marker.png')}
						width={48}
						height={48}
					/>
					<Path coordinates={[P0, P1]} onClick={() => console.warn('onClick! path')} width={10} />
					<Polyline coordinates={[P1, P2]} onClick={() => console.warn('onClick! polyline')} />
					<Circle
						coordinate={P0}
						color={'rgba(255,0,0,0.3)'}
						radius={200}
						onClick={() => console.warn('onClick! circle')}
					/>
					<Polygon
						coordinates={[P0, P1, P2]}
						color={`rgba(0, 0, 0, 0.5)`}
						onClick={() => console.warn('onClick! polygon')}
					/>
					<Marker coordinate={P5} onClick={() => console.warn('onClick! p0')} width={96} height={96}>
						<View style={{ backgroundColor: 'rgba(255,0,0,0.2)', borderRadius: 80 }}>
							<View
								style={{
									backgroundColor: 'rgba(0,0,255,0.3)',
									borderWidth: 2,
									borderColor: 'black',
									flexDirection: 'row',
								}}
							>
								<Image
									source={require('@assets/icons/marker.png')}
									style={{
										width: 32,
										height: 32,
										backgroundColor: 'rgba(0,0,0,0.2)',
										resizeMode: 'stretch',
										borderWidth: 2,
										borderColor: 'black',
									}}
									fadeDuration={0}
								/>
								<Text>Image</Text>
							</View>
							<ImageBackground
								source={require('@assets/icons/marker.png')}
								style={{ width: 64, height: 64 }}
							>
								<Text>image background</Text>
							</ImageBackground>
						</View>
					</Marker> */}
				</NaverMapView>
				<Text>토큰 : {userState.token}</Text>
				<Text>이름 : {userState.name}</Text>
				<Text>이메일 : {userState.email}</Text>
				<Text>저장소 : {email}</Text>
				<Button
					onPress={() => {
						$confirm({
							title: '컨펌 테스트',
							msg: '메세지',
							onPress: (result) => {
								if (result === 'resolve') {
									console.log('resolve')
								} else {
									console.log('reject')
								}
							},
						})
					}}
				>
					<Text>컨펌</Text>
				</Button>
				{imageList.length > 0 &&
					imageList.map((image, index) => (
						<View
							key={index}
							style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
						>
							{/* <Text>{imageList[0]?.data}</Text> */}
							{/* <Image source={{ uri: `data:${imageList[0]?.mime};base64,${imageList[0]?.data}` }} /> */}
							<Image
								source={{
									// uri: `data:${image.mime};base64,${image.data}`,
									uri: `${image.path}`,
									width: 86,
									height: 80,
								}}
							/>
						</View>
					))}
				<Button
					onPress={() => {
						ImagePicker.openPicker({
							width: 300,
							height: 400,
							cropping: true,
							multiple: true,
							mediaType: 'photo',
						}).then((img) => {
							// image response data
							// [
							// {"creationDate": "1344462930", "cropRect": null, "data": null, "duration": null, "exif": null, "filename": "IMG_0005.JPG", "height": 2002, "localIdentifier": "ED7AC36B-A150-4C38-BB8C-B6D696F4F2ED/L0/001", "mime": "image/jpeg", "modificationDate": "1441224148", "path": "/Users/starlabs/Library/Developer/CoreSimulator/Devices/A63C98A4-87C3-4842-9087-DFB307B3C755/data/Containers/Data/Application/7629F7A7-022B-49BF-81BF-D3F4DBFA8390/tmp/react-native-image-crop-picker/DE363710-4677-4F3D-B6DE-D82AE875DDD5.jpg", "size": 1852262, "sourceURL": "file:///Users/starlabs/Library/Developer/CoreSimulator/Devices/A63C98A4-87C3-4842-9087-DFB307B3C755/data/Media/DCIM/100APPLE/IMG_0005.JPG", "width": 3000},
							// {"creationDate": "1255122560", "cropRect": null, "data": null, "duration": null, "exif": null, "filename": "IMG_0002.JPG", "height": 2848, "localIdentifier": "B84E8479-475C-4727-A4A4-B77AA9980897/L0/001", "mime": "image/jpeg", "modificationDate": "1441224147", "path": "/Users/starlabs/Library/Developer/CoreSimulator/Devices/A63C98A4-87C3-4842-9087-DFB307B3C755/data/Containers/Data/Application/7629F7A7-022B-49BF-81BF-D3F4DBFA8390/tmp/react-native-image-crop-picker/F281E2DF-00C7-456E-9C75-EF8362DB4D57.jpg", "size": 2604768, "sourceURL": "file:///Users/starlabs/Library/Developer/CoreSimulator/Devices/A63C98A4-87C3-4842-9087-DFB307B3C755/data/Media/DCIM/100APPLE/IMG_0002.JPG", "width": 4288},
							// {"creationDate": "1299975445", "cropRect": null, "data": null, "duration": null, "exif": null, "filename": "IMG_0001.JPG", "height": 2848, "localIdentifier": "106E99A1-4F6A-45A2-B320-B0AD4A8E8473/L0/001", "mime": "image/jpeg", "modificationDate": "1441224147", "path": "/Users/starlabs/Library/Developer/CoreSimulator/Devices/A63C98A4-87C3-4842-9087-DFB307B3C755/data/Containers/Data/Application/7629F7A7-022B-49BF-81BF-D3F4DBFA8390/tmp/react-native-image-crop-picker/5968CCE5-E994-43D4-972A-74192D00ABAE.jpg", "size": 1896240, "sourceURL": "file:///Users/starlabs/Library/Developer/CoreSimulator/Devices/A63C98A4-87C3-4842-9087-DFB307B3C755/data/Media/DCIM/100APPLE/IMG_0001.JPG", "width": 4288}
							// ]
							const newImageList = imageList.concat(img)
							if (img.length > 0) {
								// 파일용량 30메가 제한, 파일등록 3개까지 가능
								if (newImageList.length > 3) {
									$alert('사진은 3개까지 등록 가능합니다.')
									return
								}
								for (const i of img) {
									if (i.size > 31457280) {
										$alert('사진 용량은 30mb를 초과할 수 없습니다.')
										return
									}
								}
							}

							setImageList(newImageList)
						})
					}}
				>
					<Text>이미지 업로드 버튼</Text>
				</Button>
				<Button
					onPress={() => {
						storageUtil.setItem({ key: 'token', value: userState }).then((result) => {
							setEmail(result.email)
						})
					}}
				>
					<Text>스토리지 버튼</Text>
				</Button>
				<Button
					onPress={async () => {
						await nmapOpen({
							slat: 37.464007,
							slng: 126.9522394,
							sname: '집',
							dlat: 37.5209436,
							dlng: 127.1230074,
						})
						// await kakaoMapOpen({ sp: '37.537229,127.005515', ep: '37.4979502,127.0276368' })
						// await tMapOpen({ rGoName: '집', rGoX: 126.9522394, rGoY: 37.464007 })
					}}
				>
					<Text>내비게이션 열기</Text>
				</Button>
				<Button
					onPress={() => {
						storageUtil.removeItem({ key: 'token' }).then(() => {
							setEmail('')
						})
					}}
				>
					<Text>토큰 삭제 버튼</Text>
				</Button>
			</Contents>
		</Container>
	)
}
