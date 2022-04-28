export const utils = {
	regEx: {
		email: (param) => {
			return /^[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(param)
		},
		image: (param) => {
			return /\.(png|jpe?g|gif)(\?.*)?$/.test(param)
		},
		number: (param) => {
			return /[0-9]/g.test(param)
		},
		password: (param) => {
			// 대/소문자 상관없이 8~15자까지 기호를 포함
			return /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/.test(param)
		},
		phoneNo: (param) => {
			// 지역번호, 서울번호, 핸드폰번호
			return /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)([0-9]{4})$/.test(param)
		},
		accountId: (param) => {
			// 호스팅 계정 아이디
			return /^[a-z0-9]{4,16}$/.test(param)
		},
		phoneNo2: (param) => {
			// 호스팅 관리자 전화번호
			return /^[0-9]{10,11}$/.test(param)
		},
		domain: (param) => {
			// 호스팅 도메인
			return /^([0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}(:[0-9]+)?(\/\S*)?$/.test(param)
		},
		specialChar: (param) => {
			return /[^(\\{\\}\\/?,;:|*~`!^\\+<>@\\#$%&\\\\=\\'\\")]$/.test(param)
		},
		isBase64: (str) => {
			return /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/.test(str)
		},
		carNumber: (str) => {
			//차량
			return /\d{2,3}[가-힣]{1}\d{4}$/.test(str)
		},
		detailAddr: (str) => {
			//상세 주소
			return /^[a-zA-Z가-힣#~()@*%_,.&-/]{1,20}$/.test(str)
		},

		nickName: (str) => {
			//별칭
			return /^[a-zA-Z가-힣#~()@%_,.&-/]{1,10}$/.test(str)
		},

		corpRegNum: (str) => {
			let key = [1, 3, 7, 1, 3, 7, 1, 3, 5]
			let j = 0
			// const numberMap = str.map()
			if (str.length !== 10) {
				return false
			}
			let sum = 0

			for (let i = 0; i < 9; i++) {
				j = parseInt(str.substring(i), 10)

				sum += j * key[i]
			}

			sum += (parseInt(str.substring(8), 10) * 5) / 10

			const checkNum = (10 - (sum % 10)) % 10

			//사업자 번호
			return checkNum === parseInt(str.substring(9), 10)
		},
	},
	stringCount: {
		/**
		 * 글자 수 제어
		 * 영문 1byte, 한글 3byte 인식
		 * params : str(문자열)
		 * return : byte(byte count)
		 * */
		threeByteCount: (str) => {
			return str
				.split('')
				.map((s) => s.charCodeAt(0))
				.reduce((prev, c) => prev + (c === 10 ? 3 : c >> 7 ? 3 : 1), 0)
		},
		/**
		 * 글자 수 제어
		 * 영문 1byte, 한글 2byte 인식
		 * params : str(문자열)
		 * return : byte(byte count)
		 * */
		twoByteCount: (str) => {
			return str
				.split('')
				.map((s) => s.charCodeAt(0))
				.reduce((prev, c) => prev + (c === 10 ? 2 : c >> 7 ? 2 : 1), 0)
		},
	},
	autoHypen: {
		/**
		 * 전화번호 자동 하이픈
		 * params : phoneNo(string)
		 * return : string
		 * */
		phone: (phoneNo) => {
			if (phoneNo) {
				return phoneNo
					.replace(/[^0-9]/g, '')
					.replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, '$1-$2-$3')
					.replace('--', '-')
			}
			return phoneNo
		},
	},
	format: {
		/**
		 * 카드번호 포멧
		 * params : cardNo1(string), cardNo2(string)
		 * return : string
		 * */
		card: (cardNo1, cardNo2) => {
			if (cardNo1 && cardNo2) {
				let format1 = ''
				let format2 = ''
				let cardEnd = ''

				const cardEndCnt = cardNo2.substring(4, cardNo2.length).length

				for (let i = 0; i < cardEndCnt; i++) {
					cardEnd += '*'
				}

				format1 = `${cardNo1.substring(0, 4)}-${cardNo1.substring(4, 8)}`
				format2 = `****-${cardEnd}`

				return `${format1}-${format2}`
			}

			return ''
		},
		/**
		 * 숫자 포맷
		 */
		number: (number) => {
			return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
		},
		/**
		 * 숫자만 허용 포맷
		 */
		onlyNumber: (number) => {
			return number.toString().replace(/[^0-9]/g, '')
		},
	},
	getParam: (param, name, codingType) => {
		const query = param.split('&')

		for (let i = 0; i < query.length; i++) {
			if (query[i].includes(name)) {
				const value = query[i].substring(name.length + 1)

				if (codingType === 'encode') {
					return encodeURIComponent(value)
				}
				if (codingType === 'decode') {
					return decodeURIComponent(value)
				}

				return value
			}
		}
	},
}
