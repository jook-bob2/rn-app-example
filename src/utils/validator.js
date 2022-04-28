import { utils } from '@util/regularExp'

// 이메일 검증
export const emailValidator = (email) => {
	// const re = /\S+@\S+\.\S+/

	if (!email || email.length <= 0) return 'E-mail을 입력해 주세요.'
	if (!utils.regEx.email(email)) return 'E-mail 주소가 맞는지 확인해 주세요.'

	return ''
}

// 비밀번호 검증
export const passwordValidator = (password) => {
	if (!password || password.length <= 0) return '비밀번호를 입력해 주세요.'
	if (!utils.regEx.password(password)) return '비밀번호를 형식에 맞게 입력해 주세요.'

	return ''
}

// 비밀번호 확인 검증
export const passwordCheckValidator = (password, passwordCheck) => {
	if (!passwordCheck || passwordCheck.length <= 0) return '비밀번호 학인란을 입력해 주세요.'
	if (password !== passwordCheck) return '비밀번호가 일치하지 않습니다.'

	return ''
}
// 회원 가입시 비밀번호 확인 검증
export const passwordJoinValidator = (password) => {
	if (!password || password.length <= 0) return '비밀번호를 입력해 주세요.'
	if (!utils.regEx.password(password)) return '8~16자 영문 대/소문자, 숫자, 특수문자를 혼합하여 사용해주세요.'

	return ''
}

// 이름 검증
export const nameValidator = (name) => {
	if (!name || name.length <= 0) return '이름을 입력해 주세요.'

	return ''
}
// 차량 검증
export const carNumberValidator = (number) => {
	if (!number || number.length <= 0) return '이름을 입력해 주세요.'
	if (!utils.regEx.carNumber(number)) return '잘못된 차량 번호입니다.'
	return ''
}

// 휴대폰 번호 검증
export const PhoneNumberValidator = (number) => {
	if (!number || number.length <= 0) return '휴대폰 번호를 입력해 주세요.'
	if (!utils.regEx.phoneNo(number)) return '잘못된 휴대폰 번호입니다.'

	return ''
}

// 닉네임 검증
export const nicknameValidator = (nickname) => {
	if (!nickname || nickname.length <= 0) return '닉네임을 1 ~ 10 자로 입력해 주세요.'
	if (!utils.regEx.nickName(nickname))
		return '            특수문자 #~()@%_,.&-/ \n 이외의 특수문자는 사용하실수없습니다.'
	return ''
}

//상세 주소검증
export const detailAddrValidator = (detailAddr) => {
	if (!detailAddr || detailAddr.length <= 0) return '주소는 1 ~ 20 자로 입력해 주세요.'
	if (!utils.regEx.detailAddr(detailAddr))
		return '            특수문자 #~()@%_,.&-/* \n 이외의 특수문자는 사용하실수없습니다.'
	return ''
}

// 비밀번호 검증
export const sharePasswdValidator = (password) => {
	if (!password || password.length <= 0) return '비밀번호를 입력해 주세요.'
	if (password.length !== 4) return '비밀번호를 4 자리로 입력해 주세요.'
	if (!utils.regEx.number(password)) return '숫자만 입력해 주세요.'

	return ''
}

export const corpNumberValidator = (corpRegNum) => {
	if (!corpRegNum || corpRegNum.length <= 0) return '사업자 번호를 입력해주세요'
	if (!utils.regEx.corpRegNum(corpRegNum)) return '존제하지 않는 사업자 번호입니다'
	return ''
}
