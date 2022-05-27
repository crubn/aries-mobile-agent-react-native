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
import { agentDependencies } from '@aries-framework/react-native'
import { useNavigation } from '@react-navigation/core'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PermissionsAndroid } from 'react-native'
import { Config } from 'react-native-config'
import Toast from 'react-native-toast-message'
import indyLedgers from '../../configs/ledgers/indy'
import { ToastType } from '../components/toast/BaseToast'
import { useConfiguration } from '../contexts/configuration'
import { DispatchAction } from '../contexts/reducers/store'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import Onboarding from '../screens/Onboarding'
import { createCarouselStyle } from '../screens/OnboardingPages'
import PinCreate from '../screens/PinCreate'
import PinEnter from '../screens/PinEnter'
import { StateFn } from '../types/fn'
import { AuthenticateStackParams, Screens, Stacks } from '../types/navigators'
import ConnectStack from './ConnectStack'
import ContactStack from './ContactStack'
import { createDefaultStackOptions } from './defaultStackOptions'
import DeliveryStack from './DeliveryStack'
import NotificationStack from './NotificationStack'
import SettingStack from './SettingStack'
import TabStack from './TabStack'

const RNFS = require('react-native-fs')

interface RootStackProps {
  setAgent: React.Dispatch<React.SetStateAction<Agent | undefined>>
}

const RootStack: React.FC<RootStackProps> = (props: RootStackProps) => {
  const { setAgent } = props
  const [state, dispatch] = useStore()
  const { t } = useTranslation()
  const navigation = useNavigation<StackNavigationProp<AuthenticateStackParams>>()

  const [authenticated, setAuthenticated] = useState(false)
  const [agentInitDone, setAgentInitDone] = useState(false)
  const [initAgentInProcess, setInitAgentInProcess] = useState(false)

  const theme = useTheme()
  const defaultStackOptions = createDefaultStackOptions(theme)
  const OnboardingTheme = theme.OnboardingTheme
  const { pages, terms, splash } = useConfiguration()

  const onTutorialCompleted = () => {
    dispatch({
      type: DispatchAction.DID_COMPLETE_TUTORIAL,
    })
    navigation.navigate(Screens.Terms)
  }

  const initAgent = async () => {
    if (initAgentInProcess) {
      return
    }

    // TODO: Show loading indicator here
    dispatch({ type: DispatchAction.LOADING_ENABLED })

    //Flag to protect the init process from being duplicated
    setInitAgentInProcess(true)

    const saveData = async (newAgent) => {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ])
      } catch (err) {
        console.warn(err)
      }
      const readGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
      const writeGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
      if (!readGranted || !writeGranted) {
        console.log('Read and write permissions have not been granted')
        return
      }
      // // const path = RNFS.ExternalStorageDirectoryPath + '/Test'
      // // RNFS.mkdir(path)
      // const backupKey = 'someBackupKey'
      // const random = Math.floor(Math.random() * 10000)
      // const backupWalletName = `backup-${random}`
      // const path1 = `${RNFS.DocumentDirectoryPath}/${backupWalletName}`

      // // const path2 = '/storage/emulated/0/com.ariesbifold/files/' + backupWalletName

      // console.log('newAgent.wallet', newAgent.wallet.export, path1)

      // // newAgent.wallet
      // //   .export({
      // //     path: path1,
      // //     key: backupKey,
      // //   })
      // //   .then((res) => {
      // //     console.log('newAgent.wallet', res)
      // //   })
      // //   .catch((err) => {
      // //     console.log('newAgent.wallet error', err)
      // //   })
      // await newAgent.wallet.export({ path: path1, key: backupKey })
    }

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

      // const imp = await newAgent.wallet.import(
      //   { id: 'wallet4', key: '123' },
      //   // { path: `/data/user/0/com.ariesbifold/files/backup-2679`, key: 'someBackupKey' }
      //   { path: `/storage/emulated/0/backup-7693`, key: 'someBackupKey' }
      // )
      // console.log('import', imp)
      // await newAgent.wallet.initialize({ id: 'wallet4', key: '123' })

      const wsTransport = new WsOutboundTransport()
      const httpTransport = new HttpOutboundTransport()

      newAgent.registerOutboundTransport(wsTransport)
      newAgent.registerOutboundTransport(httpTransport)

      await newAgent.initialize()
      setAgent(newAgent) // -> This will set the agent in the global provider
      setAgentInitDone(true)

      // saveData(newAgent)

      dispatch({ type: DispatchAction.LOADING_DISABLED })

      // const bobBasicMessageRepository = newAgent.injectionContainer.resolve(BasicMessageRepository)

      // const basicMessageRecord = new BasicMessageRecord({
      //   id: 'wallet4',
      //   connectionId: 'connId',
      //   content: 'hello',
      //   role: BasicMessageRole.Receiver,
      //   sentTime: 'sentIt',
      // })

      // await bobBasicMessageRepository.save(basicMessageRecord)

      // if (!newAgent.config.walletConfig) {
      //   console.log('No wallet config on bobAgent')
      // }

      const backupKey = 'backupkey'
      const random = Math.floor(Math.random() * 10000)
      const backupWalletName = `backup-${random}`
      const path1 = `${RNFS.ExternalStorageDirectoryPath}/${backupWalletName}`
      const path2 = `${RNFS.ExternalStorageDirectoryPath}/${backupWalletName}`

      console.log('newAgent.wallet', newAgent.wallet.export, path1, newAgent.config.walletConfig)

      await newAgent.wallet.export({ path: path1, key: backupKey })

      // await newAgent.wallet.delete()

      // const imp = await newAgent.wallet.import(
      //   { id: 'wallet4', key: '123' },
      //   { path: `/data/user/0/com.ariesbifold/files/${backupWalletName}`, key: backupKey }
      // )
      // console.log('import', imp)
      // await newAgent.wallet.initialize({ id: 'wallet4', key: '123' })
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

  useEffect(() => {
    if (authenticated && !agentInitDone) {
      initAgent()
    }
  }, [authenticated])

  const [files, setFiles] = useState([])
  const [fileData, setFileData] = useState()

  const getFileContent = async (path) => {
    const reader = await RNFS.readDir(path)
    setFiles(reader)
  }

  const readFile = async (path) => {
    const response = await RNFS.readFile(path)
    console.log('-----fileData-----', response)
    setFileData(response) //set the value of response to the fileData Hook.
  }

  useEffect(() => {
    getFileContent(RNFS.DocumentDirectoryPath) //run the function on the first render.
    // readFile('/data/user/0/com.ariesbifold/files/backup-3239')
  }, [])

  console.log('files', files)

  const authStack = (setAuthenticated: StateFn) => {
    const Stack = createStackNavigator()

    return (
      <Stack.Navigator initialRouteName={Screens.Splash} screenOptions={{ ...defaultStackOptions, headerShown: false }}>
        <Stack.Screen name={Screens.EnterPin}>
          {(props) => <PinEnter {...props} setAuthenticated={setAuthenticated} />}
        </Stack.Screen>
      </Stack.Navigator>
    )
  }

  const mainStack = () => {
    const Stack = createStackNavigator()

    return (
      <Stack.Navigator initialRouteName={Screens.Splash} screenOptions={{ ...defaultStackOptions, headerShown: false }}>
        <Stack.Screen name={Stacks.TabStack} component={TabStack} />
        <Stack.Screen name={Stacks.ConnectStack} component={ConnectStack} options={{ presentation: 'modal' }} />
        <Stack.Screen name={Stacks.SettingStack} component={SettingStack} />
        <Stack.Screen name={Stacks.ContactStack} component={ContactStack} />
        <Stack.Screen name={Stacks.NotificationStack} component={NotificationStack} />
        <Stack.Screen name={Stacks.ConnectionStack} component={DeliveryStack} />
      </Stack.Navigator>
    )
  }

  const onboardingStack = (setAuthenticated: StateFn) => {
    const Stack = createStackNavigator()
    const carousel = createCarouselStyle(OnboardingTheme)
    return (
      <Stack.Navigator initialRouteName={Screens.Splash} screenOptions={{ ...defaultStackOptions, headerShown: false }}>
        <Stack.Screen name={Screens.Splash} component={splash} />
        <Stack.Screen
          name={Screens.Onboarding}
          options={() => ({
            title: t('Screens.Onboarding'),
            headerTintColor: OnboardingTheme.headerTintColor,
            headerShown: true,
            gestureEnabled: false,
            headerLeft: () => false,
          })}
        >
          {(props) => (
            <Onboarding
              {...props}
              nextButtonText={'Next'}
              previousButtonText={'Back'}
              pages={pages(onTutorialCompleted, OnboardingTheme)}
              style={carousel}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name={Screens.Terms}
          options={() => ({
            title: t('Screens.Terms'),
            headerTintColor: OnboardingTheme.headerTintColor,
            headerShown: true,
            headerLeft: () => false,
            rightLeft: () => false,
          })}
          component={terms}
        />
        <Stack.Screen name={Screens.CreatePin}>
          {(props) => <PinCreate {...props} setAuthenticated={setAuthenticated} />}
        </Stack.Screen>
      </Stack.Navigator>
    )
  }

  if (state.onboarding.didAgreeToTerms && state.onboarding.didCompleteTutorial && state.onboarding.didCreatePIN) {
    return authenticated ? mainStack() : authStack(setAuthenticated)
  }

  return onboardingStack(setAuthenticated)
}

export default RootStack
