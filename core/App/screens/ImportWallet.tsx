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
import { StyleSheet } from 'react-native'
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

  const getPath = (fileName: string) => `${RNFS.ExternalStorageDirectoryPath}/aries-edge-agent/${fileName}`

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
          // { path: `/data/user/0/com.ariesbifold/files/backup-2679`, key: 'someBackupKey' }
          { path: getPath(fileName), key: 'backupkey' }
        )
        .then(async (res: Object) => {
          dispatch({
            type: DispatchAction.DID_SHOW_IMPORT_WALLET,
          })
          await newAgent.wallet.initialize({ id: 'wallet4', key: '123' })
          Toast.show({
            type: ToastType.Success,
            text1: 'Wallet Imported Successfully',
            text2: '',
            visibilityTime: 3000,
            position: 'bottom',
          })
          const wsTransport = new WsOutboundTransport()
          const httpTransport = new HttpOutboundTransport()

          newAgent.registerOutboundTransport(wsTransport)
          newAgent.registerOutboundTransport(httpTransport)

          await newAgent.initialize()
          
          setAgent(newAgent) // -> This will set the agent in the global provider
          // setAgentInitDone(true)

          // saveData(newAgent)

          dispatch({ type: DispatchAction.LOADING_DISABLED })
        })
        .catch((err: Object) => {
          console.log(err)
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

  return (
    <SafeAreaView style={[style.container]}>
      <Button
        title={'Import Wallet'}
        accessibilityLabel={t('PinCreate.Create')}
        testID={testIdWithKey('Create')}
        buttonType={ButtonType.Primary}
        // onPress={() => {
        //   importWallet()
        // }}
        onPress={async () => {
          try {
            const pickerResult = await DocumentPicker.pickSingle({
              presentationStyle: 'fullScreen',
              copyTo: 'cachesDirectory',
            })
            console.log(pickerResult)
            importWallet(pickerResult.name)
            setResult([pickerResult])
          } catch (e) {
            handleError(e)
          }
        }}
      />
    </SafeAreaView>
  )
}

export default ImportWallet

// import * as React from 'react'
// import { useEffect } from 'react'
// import { Button, StyleSheet, Text, View } from 'react-native'
// import DocumentPicker, {
//   DirectoryPickerResponse,
//   DocumentPickerResponse,
//   isInProgress,
//   types
// } from 'react-native-document-picker'

// export default function App() {
//   const [result, setResult] = React.useState<
//     Array<DocumentPickerResponse> | DirectoryPickerResponse | undefined | null
//   >()

//   useEffect(() => {
//     console.log(JSON.stringify(result, null, 2))
//   }, [result])

//   const handleError = (err: unknown) => {
//     if (DocumentPicker.isCancel(err)) {
//       console.warn('cancelled')
//       // User cancelled the picker, exit any dialogs or menus and move on
//     } else if (isInProgress(err)) {
//       console.warn('multiple pickers were opened, only the last will be considered')
//     } else {
//       throw err
//     }
//   }

//   return (
//     <View style={styles.container}>
//       <Button
//         title="open picker for single file selection"
//         onPress={async () => {
//           try {
//             const pickerResult = await DocumentPicker.pickSingle({
//               presentationStyle: 'fullScreen',
//               copyTo: 'cachesDirectory',
//             })
//             setResult([pickerResult])
//           } catch (e) {
//             handleError(e)
//           }
//         }}
//       />
//       <Button
//         title="open picker for multi file selection"
//         onPress={() => {
//           DocumentPicker.pickMultiple().then(setResult).catch(handleError)
//         }}
//       />
//       <Button
//         title="open picker for multi selection of word files"
//         onPress={() => {
//           DocumentPicker.pick({
//             allowMultiSelection: true,
//             type: [types.doc, types.docx],
//           })
//             .then(setResult)
//             .catch(handleError)
//         }}
//       />
//       <Button
//         title="open picker for single selection of pdf file"
//         onPress={() => {
//           DocumentPicker.pick({
//             type: types.pdf,
//           })
//             .then(setResult)
//             .catch(handleError)
//         }}
//       />
//       <Button
//         title="releaseSecureAccess"
//         onPress={() => {
//           DocumentPicker.releaseSecureAccess([])
//             .then(() => {
//               console.warn('releaseSecureAccess: success')
//             })
//             .catch(handleError)
//         }}
//       />
//       <Button
//         title="open directory picker"
//         onPress={() => {
//           DocumentPicker.pickDirectory().then(setResult).catch(handleError)
//         }}
//       />

//       <Text selectable>Result: {JSON.stringify(result, null, 2)}</Text>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   box: {
//     width: 60,
//     height: 60,
//     marginVertical: 20,
//   },
// })
