import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'
import TouchID from 'react-native-touch-id'

import { CheckBoxRow, SafeAreaScrollView } from '../components'
import { ToastType } from '../components/toast/BaseToast'
import { isBioAuthEnabled, storeIsBioAuthEnabled } from '../services/bioAuth.service'

const optionalConfigObject = {
  title: 'Authenticate to enable TouchID', // Android
  imageColor: '#e00606', // Android
  imageErrorColor: '#ff0000', // Android
  sensorDescription: 'Touch sensor', // Android
  sensorErrorDescription: 'Failed', // Android
  cancelText: 'Cancel', // Android
  fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
  unifiedErrors: false, // use unified error messages (default false)
  passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
}

const BioAuth = () => {
  const { t } = useTranslation()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    isBioAuthEnabled().then((val) => {
      setChecked(val)
    })
  }, [])

  const handleCheckToggle = async () => {
    if (checked) {
      await storeIsBioAuthEnabled(false)
      setChecked(false)
    } else {
      TouchID.isSupported(optionalConfigObject)
        .then(() => {
          // Success code
          TouchID.authenticate('Enable Touch ID', optionalConfigObject)
            .then(async () => {
              await storeIsBioAuthEnabled(!checked)
              setChecked((e) => !e)
            })
            .catch(() =>
              Toast.show({
                type: ToastType.Error,
                text1: t('BioAuth.Cancelled'),
                visibilityTime: 2000,
                position: 'bottom',
              })
            )
        })
        .catch(() => {
          // Failure code
          Toast.show({
            type: ToastType.Error,
            text1: t('BioAuth.Failure'),
            text2: t('Error.Unknown'),
            visibilityTime: 2000,
            position: 'bottom',
          })
        })
    }
  }

  return (
    <SafeAreaScrollView>
      <CheckBoxRow
        title={t('BioAuth.CheckInput')}
        accessibilityLabel={t('BioAuth.CheckInput')}
        // testID={testIdWithKey('IAgree')}
        checked={checked}
        onPress={handleCheckToggle}
      />
    </SafeAreaScrollView>
  )
}

export default BioAuth
