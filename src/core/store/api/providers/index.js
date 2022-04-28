import { AddressApiProvider } from './AddressApiProvider'
import { AlarmApiProvider } from './AlarmApiProvider'
import { BoardApiProvider } from './BoardApiProvider'
import { BoxOfficeApiProvider } from './BoxOfficeApiProvider'
import { ChargeQueueApiProvider } from './ChargeQueueApiProvider'
import { CommCodeApiProvider } from './CommCodeApiProvider'
import { ConnectorApiProvider } from './ConnectorApiProvider'
import { EvApiProvider } from './EvApiProvider'
import { InicisApiProvider } from './InicisApiProvider'
import { MessageApiProvider } from './MessageApiProvider'
import { PaymentApiProvider } from './PaymentApiProvider'
import { StationApiProvider } from './StationApiProvider'
import { UserApiProvider } from './UserApiProvider'
import { UserEvApiProvider } from './UserEvApiProvider'
import { UserFavoriteStationApiProvider } from './UserFavoriteStationApiProvider'
import { UserHistApiProvider } from './UserHistApiProvider'
import { PromotionApiProvider } from './PromotionApiProvider'
import { TermsApiProvider } from './TermsApiProvider'

export const apiProviderArray = [
	UserApiProvider,
	UserEvApiProvider,
	BoxOfficeApiProvider,
	CommCodeApiProvider,
	BoardApiProvider,
	AddressApiProvider,
	AlarmApiProvider,
	ConnectorApiProvider,
	UserFavoriteStationApiProvider,
	StationApiProvider,
	PaymentApiProvider,
	ChargeQueueApiProvider,
	UserHistApiProvider,
	MessageApiProvider,
	InicisApiProvider,
	EvApiProvider,
	PromotionApiProvider,
	TermsApiProvider,
].reverse()
