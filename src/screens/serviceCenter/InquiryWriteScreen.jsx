import ServiceCenterInquiryWrite from '@/components/serviceCenter/ServiceCenterInquiryWrite'
import React from 'react'
import AuthContainer from '../AuthContainer'

export default function InquiryWriteScreen() {
	return (
		<AuthContainer>
			<ServiceCenterInquiryWrite />
		</AuthContainer>
	)
}
