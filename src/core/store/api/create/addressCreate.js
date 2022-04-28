import { getAddress } from '@api/addressApi'
import { createContext } from 'react'
import { addressConstants } from '../costants/addressConstants'
import { createAsyncDispatcher } from '../utils/createAsyncDispatcher'
import { createAsyncHandler } from '../utils/createAsyncHandler'

// 컨텍스트를 생성함
export const AddressContext = createContext(null)

// 핸들러를 생성함.
export const userAddressSearchHandler = createAsyncHandler(addressConstants.GET_ADDRESS, 'userAddress')

// 액션을 핸들링하고, API 호출함.
export const GET_ADDRESS = createAsyncDispatcher(addressConstants.GET_ADDRESS, getAddress)
