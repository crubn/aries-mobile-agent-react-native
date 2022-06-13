import React, { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Text } from 'react-native'
import TouchID from 'react-native-touch-id'

const optionalConfigObject = {
  title: 'Authentication Required', // Android
  imageColor: '#e00606', // Android
  imageErrorColor: '#ff0000', // Android
  sensorDescription: 'Touch sensor', // Android
  sensorErrorDescription: 'Failed', // Android
  cancelText: 'Enter PIN', // Android
  fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
  unifiedErrors: false, // use unified error messages (default false)
  passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
}

interface PinEnterProps {
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  setBioAuthEnabled: React.Dispatch<React.SetStateAction<boolean>>
}

const TouchIDAuth: React.FC<PinEnterProps> = ({ setAuthenticated, setBioAuthEnabled }) => {
  useEffect(() => {
    TouchID.isSupported(optionalConfigObject)
      .then(() => {
        // Success code
        TouchID.authenticate('Open App', optionalConfigObject)
          .then(() => {
            setAuthenticated(true)
          })
          .catch(() => setBioAuthEnabled(false))
      })
      .catch(() => {
        // Failure code
        setBioAuthEnabled(false)
      })
  }, [])
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Aries Bifold Locked</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '40%',
  },
  text: { fontSize: 24, fontWeight: '700' },
})

export default TouchIDAuth
