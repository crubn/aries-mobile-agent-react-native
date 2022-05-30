/* eslint-disable */
import {
  Agent,
  AutoAcceptCredential,
  ConsoleLogger,
  HttpOutboundTransport,
  LogLevel,
  MediatorPickupStrategy,
  WsOutboundTransport
} from '@aries-framework/core'
import { useAgent } from '@aries-framework/react-hooks'
import { agentDependencies } from '@aries-framework/react-native'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { Config } from 'react-native-config'
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isInProgress
} from 'react-native-document-picker'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import indyLedgers from '../../configs/ledgers/indy'
import Button, { ButtonType } from '../components/buttons/Button'
import { ToastType } from '../components/toast/BaseToast'
import { DispatchAction } from '../contexts/reducers/store'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { Screens } from '../types/navigators'
import { testIdWithKey } from '../utils/testable'

  interface PinCreateProps {
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  }
  
  const WalletSetup: React.FC<PinCreateProps> = ({ setAuthenticated, setAgent, navigation }) => {
    const [pin, setPin] = useState('')
    const [pinTwo, setPinTwo] = useState('')
    const [loading, setLoading] = useState(false)
    const [, dispatch] = useStore()
    const { t } = useTranslation()
    const { ColorPallet } = useTheme()
    const { agent } = useAgent()

    console.log("navigation", navigation)
      
    const [result, setResult] = React.useState<
      Array<DocumentPickerResponse> | DirectoryPickerResponse | undefined | null
    >()
  
    const style = StyleSheet.create({
      container: {
        backgroundColor: ColorPallet.brand.primaryBackground,
        margin: 20,
        flex: 1,
        justifyContent: 'flex-end',
      },
    })
    const handleError = (err: unknown) => {
      if (DocumentPicker.isCancel(err)) {
        console.warn('cancelled')
        // User cancelled the picker, exit any dialogs or menus and move on
      } else if (isInProgress(err)) {
        console.warn('multiple pickers were opened, only the last will be considered')
      } else {
        throw err
      }
    }
    const [agentInitDone, setAgentInitDone] = useState(false)
    const [initAgentInProcess, setInitAgentInProcess] = useState(false)

  
    const createWallet = async () => {
      if (initAgentInProcess) {
        return
      }
  
      // TODO: Show loading indicator here
      dispatch({ type: DispatchAction.LOADING_ENABLED })
      setLoading(true)
  
      //Flag to protect the init process from being duplicated
      setInitAgentInProcess(true)
  
      try {
        const newAgent = new Agent(
          {
            label: 'Aries Bifold',
            mediatorConnectionsInvite: Config.MEDIATOR_URL,
            mediatorPickupStrategy: MediatorPickupStrategy.Implicit,
            walletConfig: { id: 'wallet4', key: '123' },
            autoAcceptConnections: true,
            autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
            logger: new ConsoleLogger(LogLevel.trace),
            indyLedgers,
            connectToIndyLedgersOnStartup: false,
          },
          agentDependencies
        )
        dispatch({
          type: DispatchAction.DID_SHOW_IMPORT_WALLET,
        })
  
        const wsTransport = new WsOutboundTransport()
        const httpTransport = new HttpOutboundTransport()
  
        newAgent.registerOutboundTransport(wsTransport)
        newAgent.registerOutboundTransport(httpTransport)
  
        await newAgent.initialize()
        setAgent(newAgent) // -> This will set the agent in the global provider
        setAgentInitDone(true)
        setLoading(false)

        dispatch({ type: DispatchAction.LOADING_DISABLED })
      } catch (e: unknown) {
        Toast.show({
          type: ToastType.Error,
          text1: t('Global.Failure'),
          text2: (e as Error)?.message || t('Error.Unknown'),
          visibilityTime: 2000,
          position: 'bottom',
        })
      }
  
      setInitAgentInProcess(false)
    }

    return (
      <SafeAreaView style={[style.container]}>
        {loading ? <ActivityIndicator /> : null}
  
        <Button
          disabled={loading}
          styles={{ marginBottom: 10 }}
          title={'Create new wallet'}
          accessibilityLabel={t('PinCreate.Create')}
          testID={testIdWithKey('Create')}
          buttonType={ButtonType.Primary}
          onPress={() => createWallet()}
        />
        <Button
          styles={{}}
          disabled={loading}
          title={'Import Wallet'}
          accessibilityLabel={t('PinCreate.Create')}
          testID={testIdWithKey('Create')}
          buttonType={ButtonType.Primary}
          onPress={() => navigation.navigate(Screens.ImportWallet)}
          />
      </SafeAreaView>
    )
  }
  
  export default WalletSetup
  