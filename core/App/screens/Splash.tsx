import {
  Agent,
  AutoAcceptCredential,
  ConsoleLogger,
  HttpOutboundTransport,
  LogLevel,
  MediatorPickupStrategy,
  WsOutboundTransport,
} from '@aries-framework/core'
import { agentDependencies } from '@aries-framework/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/core'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { Config } from 'react-native-config'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import indyLedgers from '../../configs/ledgers/indy'
import LoadingIndicator from '../components/animated/LoadingIndicator'
import { ToastType } from '../components/toast/BaseToast'
import { LocalStorageKeys } from '../constants'
import { useAuth } from '../contexts/auth'
import { DispatchAction } from '../contexts/reducers/store'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { Screens, Stacks } from '../types/navigators'
import { WalletSecret } from '../types/security'
import {
  Onboarding as StoreOnboardingState,
  Privacy as PrivacyState,
  Preferences as PreferencesState,
} from '../types/state'

const onboardingComplete = (state: StoreOnboardingState): boolean => {
  return state.didCompleteTutorial && state.didAgreeToTerms && state.didCreatePIN && state.didConsiderBiometry
}

const resumeOnboardingAt = (state: StoreOnboardingState): Screens => {
  if (state.didCompleteTutorial && state.didAgreeToTerms && state.didCreatePIN && !state.didConsiderBiometry) {
    return Screens.UseBiometry
  }

  if (state.didCompleteTutorial && state.didAgreeToTerms && !state.didCreatePIN) {
    return Screens.CreatePin
  }

  if (state.didCompleteTutorial && !state.didAgreeToTerms) {
    return Screens.Terms
  }

  return Screens.Onboarding
}

/**
 * To customize this splash screen set the background color of the
 * iOS and Android launch screen to match the background color of
 * of this view.
 */
const Splash: React.FC = () => {
  const { t } = useTranslation()
  const [store, dispatch] = useStore()
  const navigation = useNavigation()
  const { getWalletCredentials } = useAuth()
  const { ColorPallet } = useTheme()
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: ColorPallet.brand.primaryBackground,
    },
  })

  useEffect(() => {
    if (store.authentication.didAuthenticate) {
      return
    }

    const initOnboarding = async () => {
      try {
        const preferencesData = await AsyncStorage.getItem(LocalStorageKeys.Preferences)

        if (preferencesData) {
          const dataAsJSON = JSON.parse(preferencesData) as PreferencesState

          dispatch({
            type: DispatchAction.PREFERENCES_UPDATED,
            payload: [dataAsJSON],
          })
        }

        const privacyData = await AsyncStorage.getItem(LocalStorageKeys.Privacy)
        if (privacyData) {
          const dataAsJSON = JSON.parse(privacyData) as PrivacyState

          dispatch({
            type: DispatchAction.PRIVACY_UPDATED,
            payload: [dataAsJSON],
          })
        }

        const data = await AsyncStorage.getItem(LocalStorageKeys.Onboarding)
        if (data) {
          const onboardingState = JSON.parse(data) as StoreOnboardingState
          dispatch({ type: DispatchAction.ONBOARDING_UPDATED, payload: [onboardingState] })
          if (onboardingComplete(onboardingState)) {
            navigation.navigate(Screens.EnterPin as never)
          } else {
            // If onboarding was interrupted we need to pickup from where we left off.
            navigation.navigate(resumeOnboardingAt(onboardingState) as never)
          }
          return
        }
        // We have no onboarding state, starting from step zero.
        navigation.navigate(Screens.Onboarding as never)
      } catch (error) {
        // TODO:(am add error handling here)
      }
    }

    initOnboarding()
  }, [store.authentication.didAuthenticate])

  useEffect(() => {
    if (!store.authentication.didAuthenticate) {
      return
    }

    const initAgent = async (predefinedSecret?: WalletSecret | null): Promise<void> => {
      if (!predefinedSecret) {
        dispatch({ type: DispatchAction.LOADING_ENABLED })
      }

      try {
        const credentials = await getWalletCredentials()

        if (!credentials?.id || !credentials.key) {
          // Cannot find wallet id/secret
          return
        }

        const newAgent = new Agent(
          {
            label: 'Aries Bifold',
            mediatorConnectionsInvite: Config.MEDIATOR_URL,
            mediatorPickupStrategy: MediatorPickupStrategy.Implicit,
            walletConfig: { id: credentials.id, key: credentials.key },
            autoAcceptConnections: true,
            autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
            logger: new ConsoleLogger(LogLevel.trace),
            indyLedgers,
            connectToIndyLedgersOnStartup: true,
            autoUpdateStorageOnStartup: true,
          },
          agentDependencies
        )

        const wsTransport = new WsOutboundTransport()
        const httpTransport = new HttpOutboundTransport()

        newAgent.registerOutboundTransport(wsTransport)
        newAgent.registerOutboundTransport(httpTransport)

        await newAgent.initialize()
        dispatch({ type: DispatchAction.LOADING_DISABLED })
        navigation.navigate(Stacks.TabStack as never)
      } catch (e: unknown) {
        Toast.show({
          type: ToastType.Error,
          text1: t('Global.Failure'),
          text2: (e as Error)?.message || t('Error.Unknown'),
          visibilityTime: 2000,
          position: 'bottom',
        })
        return
      }
    }

    initAgent()
  }, [store.authentication.didAuthenticate])

  return (
    <SafeAreaView style={styles.container}>
      <LoadingIndicator />
    </SafeAreaView>
  )
}

export default Splash
