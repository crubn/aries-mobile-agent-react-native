import { useNavigation } from '@react-navigation/core'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowDimensions, Vibration, View, StyleSheet, Text, ImageBackground } from 'react-native'
import { BarCodeReadEvent, RNCamera } from 'react-native-camera'
import Icon from 'react-native-vector-icons/MaterialIcons'

import IndisiLogo from '../../assets/img/indisi-logo-for-dark.svg'
import { useTheme } from '../../contexts/theme'
import { QrCodeScanError } from '../../types/error'

import QRScannerClose from './QRScannerClose'
import QRScannerTorch from './QRScannerTorch'

interface Props {
  handleCodeScan: (event: BarCodeReadEvent) => Promise<void>
  error?: QrCodeScanError | null
  enableCameraOnError?: boolean
}

const CameraViewContainer: React.FC<{ portrait: boolean }> = ({ portrait, children }) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: portrait ? 'column' : 'row',
        alignItems: 'center',
        // backgroundColor: '#2d2d2d',
      }}
    >
      {children}
    </View>
  )
}

const QRScanner: React.FC<Props> = ({ handleCodeScan, error, enableCameraOnError }) => {
  const navigation = useNavigation()
  const [cameraActive, setCameraActive] = useState(true)
  const [torchActive, setTorchActive] = useState(false)
  const { width, height } = useWindowDimensions()
  const portraitMode = height > width
  const { t } = useTranslation()
  const invalidQrCodes = new Set<string>()
  const { ColorPallet, TextTheme } = useTheme()
  const styles = StyleSheet.create({
    container: {
      height: '100%',
      width: '100%',
      // backgroundColor: ColorPallet.grayscale.black,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#2d2d2d',
    },
    viewFinder: {
      width: 250,
      height: 250,
      borderRadius: 0,
      borderWidth: 5,
      borderColor: '#176DFF',
    },
    viewFinderContainer: {
      flex: 0.8,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      color: ColorPallet.grayscale.white,
      padding: 4,
    },
    appName: {
      color: '#202B67',
      fontSize: 35,
      marginTop: 10,
      fontFamily: 'Avenir-Medium',
      marginLeft: 20,
    },
    logo: {
      height: 40,
      width: 40,
      marginTop: 10,
    },
    cameraContainer: {
      marginTop: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rnCamera: {
      height: 280,
      width: 280,
      overflow: 'hidden',
    },
    imageBackground: {
      height: 300,
      width: 300,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
  })
  return (
    <View style={styles.container}>
      <QRScannerClose onPress={() => navigation.goBack()}></QRScannerClose>

      <View style={styles.cameraContainer}>
        <Text
          style={[
            TextTheme.caption,
            {
              color: ColorPallet.grayscale.white,
              height: 30,
              fontFamily: 'Avenir-Medium',
            },
          ]}
        >
          Scan QR Code to continue
        </Text>
        <ImageBackground source={{ uri: 'https://i.ibb.co/B3p37qj/Rectangle-59-1.png' }} style={styles.imageBackground}>
          <RNCamera
            style={styles.rnCamera}
            type={RNCamera.Constants.Type.back}
            flashMode={torchActive ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
            captureAudio={false}
            androidCameraPermissionOptions={{
              title: t('QRScanner.PermissionToUseCamera'),
              message: t('QRScanner.WeNeedYourPermissionToUseYourCamera'),
              buttonPositive: t('QRScanner.Ok'),
              buttonNegative: t('Global.Cancel'),
            }}
            barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
            onBarCodeRead={(event: BarCodeReadEvent) => {
              if (invalidQrCodes.has(event.data)) {
                return
              }
              if (error?.data === event?.data) {
                invalidQrCodes.add(error.data)
                if (enableCameraOnError) {
                  return setCameraActive(true)
                }
              }
              if (cameraActive) {
                Vibration.vibrate()
                handleCodeScan(event)
                return setCameraActive(false)
              }
            }}
          />
        </ImageBackground>
      </View>

      <CameraViewContainer portrait={portraitMode}>
        <View style={styles.errorContainer}>
          {error ? (
            <>
              <Icon style={styles.icon} name="cancel" size={30}></Icon>
              <Text style={[TextTheme.caption, { color: ColorPallet.grayscale.white }]}>{error.message}</Text>
            </>
          ) : (
            <Text style={[TextTheme.caption, { color: ColorPallet.grayscale.white, height: 30, margin: 4 }]}></Text>
          )}
        </View>
        <View style={styles.viewFinderContainer}>
          <IndisiLogo />
        </View>
        <QRScannerTorch active={torchActive} onPress={() => setTorchActive(!torchActive)} />
      </CameraViewContainer>
    </View>
  )
}

export default QRScanner
