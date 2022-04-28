import ServiceCenterInquiryList from '@/components/serviceCenter/ServiceCenterInquiryList'
import React from 'react'
import AuthContainer from '../AuthContainer'

export default function InquiryListScreen() {
	return (
		<AuthContainer>
			<ServiceCenterInquiryList />
		</AuthContainer>
	)
}
