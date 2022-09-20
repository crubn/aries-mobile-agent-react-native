import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View, Switch, StatusBar, Platform, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import IndisiLogo from '../assets/img/indisi-logo-yellow-blue.svg'
import Button, { ButtonType } from '../components/buttons/Button'
import { useAuth } from '../contexts/auth'
import { DispatchAction } from '../contexts/reducers/store'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { statusBarStyleForColor, StatusBarStyles } from '../utils/luminance'
import { testIdWithKey } from '../utils/testable'

const UseBiometry: React.FC = () => {
  const [, dispatch] = useStore()
  const { t } = useTranslation()
  const { convertToUseBiometrics, isBiometricsActive } = useAuth()
  const [biometryAvailable, setBiometryAvailable] = useState(false)
  const [biometryEnabled, setBiometryEnabled] = useState(false)
  const [continueEnabled, setContinueEnabled] = useState(true)
  const { ColorPallet, TextTheme } = useTheme()
  const styles = StyleSheet.create({
    container: {
      flexGrow: 2,
      flexDirection: 'column',
      paddingHorizontal: 25,
      backgroundColor: ColorPallet.brand.primaryBackground,
      color: 'black',
    },
    image: {
      minWidth: 200,
      minHeight: 200,
      marginBottom: 66,
    },
    logo: {
      height: 40,
      width: 40,
      marginTop: 10,
    },
    appName: {
      color: '#202B67',
      fontSize: 35,
      marginTop: 10,
      fontFamily: 'Avenir-Medium',
      marginLeft: 20,
    },
    headerView: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 40,
    },
    descriptionView: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 0,
    },
    headerText: {
      fontFamily: 'Avenir-Medium',
      fontWeight: 'bold',
      fontSize: 20,
      color: '#444',
    },
    descriptionText: {
      fontFamily: 'Avenir-Medium',
      fontSize: 17,
      color: '#444',
    },
    biometry: {
      height: 280,
      width: 280,
      resizeMode: 'cover',
    },
    laterText: {
      color: '#666',
      fontFamily: 'Avenir-Medium',
      fontWeight: 'bold',
      marginTop: 50,
      textAlign: 'center',
      fontSize: 15,
    },
  })

  useEffect(() => {
    isBiometricsActive().then((result) => {
      setBiometryAvailable(result)
    })
  }, [])

  const continueTouched = async () => {
    console.warn('called')
    setContinueEnabled(false)

    if (biometryEnabled) {
      await convertToUseBiometrics()
    }

    dispatch({
      type: DispatchAction.USE_BIOMETRY,
      payload: [biometryEnabled],
    })
  }

  const toggleSwitch = () => setBiometryEnabled((previousState) => !previousState)

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: 'row', margin: 20, alignItems: 'center', display: 'flex' }}>
        <View style={{ marginTop: 15 }}>
          <IndisiLogo />
        </View>
        <Text style={styles.appName}>indisi</Text>
      </View>
      <View style={styles.headerView}>
        <Text style={styles.headerText}>Use your Touch ID</Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image source={{ uri: 'https://i.ibb.co/1RSKxLs/Group-1784.png' }} style={styles.biometry} />
      </View>
      <View style={styles.descriptionView}>
        <Text style={styles.descriptionText}>
          Enable Biometric Authentication so you don't have to enter your passcode everytime
        </Text>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 80 }}>
        <Button
          onPress={() => {
            setBiometryEnabled(true)
            continueTouched()
          }}
          title={'Activate Touch ID'}
          testID={testIdWithKey('CreatePIN')}
          accessibilityLabel={t('PinCreate.CreatePIN')}
          buttonType={ButtonType.Primary}
        />
      </View>

      <Text onPress={() => continueTouched()} style={styles.laterText}>
        Maybe Later
      </Text>
    </SafeAreaView>
  )
}

export default UseBiometry
