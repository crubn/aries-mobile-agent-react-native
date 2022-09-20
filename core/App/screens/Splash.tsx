import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useMemo } from 'react'
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { LocalStorageKeys } from '../constants'
import { DispatchAction } from '../contexts/reducers/store'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { AuthenticateStackParams, Screens } from '../types/navigators'
import IndisiLogo from '../assets/img/indisi-logo-splash-screen.svg'
// import PoweredByCrubn from '../assets/img/powered-by-crubn.svg'

import {
  Onboarding as StoreOnboardingState,
  Preferences as PreferencesState,
  Privacy as PrivacyState
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

/*
  To customize this splash screen set the background color of the
  iOS and Android launch screen to match the background color of
  of this view.
*/

const Splash: React.FC = () => {
  const [, dispatch] = useStore()
  const navigation = useNavigation<StackNavigationProp<AuthenticateStackParams>>()
  const { ColorPallet, Assets } = useTheme()
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: ColorPallet.brand.splashBackground,
    },
    row1: {
      flex: 0.9,
      justifyContent: 'center',
      alignItems: 'center',
    },
    row2: {
      // flex: 0.2,
      // justifyContent: 'center',
      // alignItems: 'center',
    },
    logo: {
      height: 80,
      width: 80,
    },
    appName: {
      color: 'white',
      fontSize: 64,
      marginTop: 10,
      fontFamily: 'Avenir-Medium',
    },
    poweredByImage: {
      width: 150,
      height: 100,
      resizeMode: 'contain',
    },
    statusBar: {
      color: ColorPallet.brand.splashBackground,
    },
  })

  useMemo(() => {
    async function init() {
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
            navigation.navigate(Screens.EnterPin)
          } else {
            // If onboarding was interrupted we need to pickup from where we left off.
            const destination = resumeOnboardingAt(onboardingState)
            // @ts-ignore
            navigation.navigate({ name: destination })
          }
          return
        }
        // We have no onboarding state, starting from step zero.
        navigation.navigate(Screens.Onboarding)
      } catch (error) {
        // TODO:(am add error handling here)
      }
    }
    setTimeout(() => {
      init()
    }, 2000)
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={styles.statusBar.color} barStyle="light-content" />
      <View style={styles.row1}>
        {/* <Image
          source={{
            uri: 'https://i.ibb.co/s2zRb6N/Vector.png',
          }}
          style={styles.logo}
        /> */}
        <IndisiLogo />
        <Text style={styles.appName}>indisi</Text>
      </View>
      {/* <View style={styles.row2}> */}
      <Image source={{ uri: 'https://i.ibb.co/ZNGsTx9/Group-1780.png' }} style={styles.poweredByImage} />
      {/* <PoweredByCrubn style={{ width: "100px" }} /> */}
      {/* </View> */}
    </SafeAreaView>
  )
}

export default Splash
