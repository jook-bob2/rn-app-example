/*
 * 게시판 그룹 코드
 */
export const GroupCd = {
	SERVICE_CENTER_TYPE_CD: 'SERVICE_CENTER_TYPE_CD', // 고객센터 유형 코드
	NOTICE_TYPE_CD: 'NOTICE_TYPE_CD', // 공지사항 유형 코드
}

/*
 * 고객센터 유형 코드
 */
export const ServiceCenterTypeCd = {
	INQUIRY: 'INQUIRY', // 1대1문의
	FAQ: 'FAQ', // FAQ
	BREAK_DOWN: 'BREAK_DOWN', // 고장신고
}

/*
 * 공지사항 유형 코드
 */
export const NoticeTypeCd = {
	NOTICE: 'NOTICE', // 공지사항
	ALARM: 'ALARM', // 알림
	EVENT: 'EVENT', // 이벤트
	COUPON: 'COUPON', // 쿠폰
}
