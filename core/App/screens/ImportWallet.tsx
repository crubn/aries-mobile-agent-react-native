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
import { ActivityIndicator, Clipboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
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
import { testIdWithKey } from '../utils/testable'

const RNFS = require('react-native-fs')

interface PinCreateProps {
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

const ImportWallet: React.FC<PinCreateProps> = ({ setAuthenticated, setAgent }) => {
  const [pin, setPin] = useState('')
  const [pinTwo, setPinTwo] = useState('')
  const [loading, setLoading] = useState(false)
  const [, dispatch] = useStore()
  const { t } = useTranslation()
  const { ColorPallet } = useTheme()
  const { agent } = useAgent()

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
    root: {
      flex: 1,
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
  const [copiedText, setCopiedText] = useState('')
  const [paraphrase, setParaphrase] = useState('')

  const getPath = (fileName: string) => `${RNFS.ExternalStorageDirectoryPath}/${fileName}`

  const importWallet = async (fileName: string) => {
    // TODO: Show loading indicator here
    dispatch({ type: DispatchAction.LOADING_ENABLED })

    //Flag to protect the init process from being duplicated
    setInitAgentInProcess(true)

    try {
      const newAgent = new Agent(
        {
          label: 'Aries Bifold',
          mediatorConnectionsInvite: Config.MEDIATOR_URL,
          mediatorPickupStrategy: MediatorPickupStrategy.Implicit,
          // walletConfig: { id: 'wallet4', key: '123' },
          autoAcceptConnections: true,
          autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
          logger: new ConsoleLogger(LogLevel.trace),
          indyLedgers,
          connectToIndyLedgersOnStartup: false,
        },
        agentDependencies
      )
      console.log('getPath(path)', getPath(fileName))

      await newAgent.wallet
        .import(
          { id: 'wallet4', key: '123' },
          {
            path: getPath(fileName),
            key: paraphrase,
          }
        )
        .then(async (res: Object) => {
          await newAgent.wallet.initialize({ id: 'wallet4', key: '123' })
          const wsTransport = new WsOutboundTransport()
          const httpTransport = new HttpOutboundTransport()

          newAgent.registerOutboundTransport(wsTransport)
          newAgent.registerOutboundTransport(httpTransport)

          await newAgent.initialize()

          setAgent(newAgent) // -> This will set the agent in the global provider
          // setAgentInitDone(true)

          // saveData(newAgent)
          setLoading(false)
          Toast.show({
            type: ToastType.Success,
            text1: 'Wallet Imported Successfully',
            text2: getPath(fileName),
            visibilityTime: 3000,
            position: 'bottom',
          })
          dispatch({ type: DispatchAction.LOADING_DISABLED })
          dispatch({
            type: DispatchAction.DID_SHOW_IMPORT_WALLET,
          })
        })
        .catch((err: Object) => {
          console.log(err)
          setLoading(false)
          Toast.show({
            type: ToastType.Error,
            text1: 'Error',
            text2: 'Please use correct paraphrase',
            visibilityTime: 3000,
            position: 'bottom',
          })
        })
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

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString()
    setParaphrase(text)
  }

  const paraphraseInput = () => {
    return (
      <View style={{ margin: 10 }}>
        <View style={{ backgroundColor: '#343434', padding: 20 }}>
          <TextInput
            value={paraphrase}
            onChangeText={(text) => {
              setParaphrase(text)
            }}
            multiline
            style={{ fontSize: 30, lineHeight: 50 }}
          />
        </View>
        <TouchableOpacity activeOpacity={0.5} style={{ marginTop: 10 }} onPress={() => fetchCopiedText()}>
          <Text>Paste from clipboard</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={style.root}>
      {loading ? <ActivityIndicator /> : null}

      {paraphraseInput()}

      <View style={style.container}>
        {result ? <Text style={{ marginBottom: 20 }}>Imported file: - {getPath(result[0].name)}</Text> : null}
        <Button
          styles={{}}
          disabled={loading}
          title={loading ? 'Importing Wallet from Backup File' : 'Import Backup File'}
          accessibilityLabel={t('PinCreate.Create')}
          testID={testIdWithKey('Create')}
          buttonType={ButtonType.Primary}
          onPress={async () => {
            try {
              if (paraphrase.split(' ').length === 15) {
                setResult(null)
                setLoading(true)
                const pickerResult = await DocumentPicker.pickSingle({
                  presentationStyle: 'fullScreen',
                  copyTo: 'cachesDirectory',
                })
                console.log(pickerResult)
                setResult([pickerResult])
                importWallet(pickerResult.name)
              } else {
                Toast.show({
                  type: ToastType.Error,
                  text1: 'Please enter 15 letter paraphrase',
                  text2: '',
                  visibilityTime: 2000,
                  position: 'bottom',
                })
              }
            } catch (e) {
              handleError(e)
            }
          }}
        />
      </View>
    </SafeAreaView>
  )
}

export default ImportWallet
