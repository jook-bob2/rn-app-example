import { Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window')

// 내가 개발 테스트 한 모바일의 실제 가로 세로 상수값 기입
const guidelineBaseWidth = 411.42857142857144
const guidelineBaseHeight = 797.7142857142857
const guideScale = Math.sqrt(guidelineBaseWidth * guidelineBaseHeight)

const scale = Math.sqrt(width * height) / guideScale
const horiPer = width / guidelineBaseWidth
const vertiPer = height / guidelineBaseHeight

// 세로 길이에만 영향을 주는 값
const verticalScale = (size) => horiPer * size
// 가로 길이에만 영향을 주는 값
const horizontalScale = (size) => vertiPer * size
// 글자 크기나, 여튼 대각선으로 가로세로 동일한 비율로 변화하는 값
const moderateScale = (size) => scale * size

// 기기별 총 높이/너비
const device = {
	height: Dimensions.get('screen').height,
	width: Dimensions.get('screen').width,
}

export { moderateScale, verticalScale, horizontalScale, device }
