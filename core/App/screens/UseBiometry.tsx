import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View, Switch, StatusBar, Platform, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import Biometrics from '../assets/img/biometrics.svg'
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
      fontFamily: 'AvenirMedium',
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
      fontFamily: 'AvenirMedium',
      fontWeight: 'bold',
      fontSize: 20,
      color: '#444',
    },
    descriptionText: {
      fontFamily: 'AvenirMedium',
      fontSize: 18,
      color: '#444',
    },
    biometry: {
      height: 280,
      width: 280,
      resizeMode: 'cover',
    },
    laterText: {
      color: '#666',
      fontFamily: 'AvenirMedium',
      fontWeight: 'bold',
      marginTop: 50,
      textAlign: 'center',
      fontSize: 18,
    },
  })

  useEffect(() => {
    isBiometricsActive().then((result) => {
      setBiometryAvailable(result)
    })
  }, [])

  const continueTouched = async () => {
    console.warn("called")
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
      <StatusBar
        barStyle={Platform.OS === 'android' ? StatusBarStyles.Light : statusBarStyleForColor(ColorPallet.brand.primary)}
      />
      <View style={{ flexDirection: 'row', margin: 20 }}>
        <Image source={{ uri: 'https://i.ibb.co/pn8r7YP/Group-1690.png' }} style={styles.logo} />
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

      {/* <View style={{ flexGrow: 1 }}>
        <View style={{ alignItems: 'center' }}>
          <Biometrics style={[styles.image]} />
        </View>
        {biometryAvailable ? (
          <View>
            <Text style={[TextTheme.normal]}>{t('Biometry.EnabledText1')}</Text>
            <Text></Text>
            <Text style={[TextTheme.normal]}>
              {t('Biometry.EnabledText2')}
              <Text style={[TextTheme.normal, { fontWeight: 'bold' }]}> {t('Biometry.Warning')}</Text>
            </Text>
          </View>
        ) : (
          <View>
            <Text style={[TextTheme.normal]}>{t('Biometry.NotEnabledText1')}</Text>
            <Text></Text>
            <Text style={[TextTheme.normal]}>{t('Biometry.NotEnabledText2')}</Text>
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 30,
          }}
        >
          <View style={{ flexShrink: 1 }}>
            <Text style={[TextTheme.normal, { fontWeight: 'bold' }]}>{t('Biometry.UseToUnlock')}</Text>
          </View>
          <View style={{ justifyContent: 'center' }}>
            <Switch
              accessibilityLabel={t('Biometry.Toggle')}
              testID={testIdWithKey('ToggleBiometrics')}
              trackColor={{ false: ColorPallet.grayscale.lightGrey, true: ColorPallet.brand.primaryDisabled }}
              thumbColor={biometryEnabled ? ColorPallet.brand.primary : ColorPallet.grayscale.mediumGrey}
              ios_backgroundColor={ColorPallet.grayscale.lightGrey}
              onValueChange={toggleSwitch}
              value={biometryEnabled}
              disabled={!biometryAvailable}
            />
          </View>
        </View>
        <View style={{ flexGrow: 1, justifyContent: 'flex-end' }}>
          <Button
            title={'Continue'}
            accessibilityLabel={'Continue'}
            testID={testIdWithKey('Continue')}
            onPress={continueTouched}
            buttonType={ButtonType.Primary}
            disabled={!continueEnabled}
          />
        </View>
      </View> */}
    </SafeAreaView>
  )
}

export default UseBiometry
