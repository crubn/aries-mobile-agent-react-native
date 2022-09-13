import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, StyleSheet, Text, View } from 'react-native'

import SecureImage from '../assets/img/secure-image.svg'
import Button, { ButtonType } from '../components/buttons/Button'
import { GenericFn } from '../types/fn'
import { testIdWithKey } from '../utils/testable'

import { OnboardingStyleSheet } from './Onboarding'

export const createCarouselStyle = (OnboardingTheme: any): OnboardingStyleSheet => {
  return StyleSheet.create({
    container: {
      ...OnboardingTheme.container,
      flex: 1,
      alignItems: 'center',
      backgroundColor: 'white',
      color: 'black',
      fontFamily: 'AvenirMedium',
    },
    carouselContainer: {
      ...OnboardingTheme.carouselContainer,
      flexDirection: 'column',
      backgroundColor: 'white',
    },
    pagerContainer: {
      flexShrink: 2,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 35,
      backgroundColor: 'white',
    },
    pagerDot: {
      ...OnboardingTheme.pagerDot,
      borderWidth: 1,
      borderStyle: 'solid',
    },
    pagerDotActive: {
      ...OnboardingTheme.pagerDotActive,
    },
    pagerDotInactive: {
      ...OnboardingTheme.pagerDotInactive,
    },
    pagerPosition: {
      position: 'relative',
      top: 0,
    },
    pagerNavigationButton: {
      ...OnboardingTheme.pagerNavigationButton,
      fontSize: 18,
      fontWeight: 'bold',
    },
  })
}

export const createStyles = (OnboardingTheme: any) => {
  return StyleSheet.create({
    headerText: {
      ...OnboardingTheme.headerText,
    },
    bodyText: {
      ...OnboardingTheme.bodyText,
      flexShrink: 1,
    },
    point: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 20,
      marginTop: 10,
      marginRight: 20,
      marginBottom: 10,
    },
    icon: {
      marginRight: 10,
    },
    logo: {
      height: 40,
      width: 40,
    },
    appName: {
      color: '#202B67',
      fontSize: 35,
      marginTop: 10,
      fontFamily: 'AvenirMedium',
      marginLeft: 20,
    },
  })
}

const createImageDisplayOptions = (OnboardingTheme: any) => {
  return {
    // ...OnboardingTheme.imageDisplayOptions,
    height: 100,
    width: 100,
  }
}

const customPages = (onTutorialCompleted: GenericFn, OnboardingTheme: any) => {
  const { t } = useTranslation()
  const styles = createStyles(OnboardingTheme)
  const imageDisplayOptions = createImageDisplayOptions(OnboardingTheme)
  return (
    <View style={{ backgroundColor: 'white' }}>
      <View style={{ alignItems: 'center' }}>
        <SecureImage {...imageDisplayOptions} />
      </View>
      <View style={{ marginLeft: 20, marginRight: 20, marginTop: 30 }}>
        <Text style={[styles.headerText, { fontSize: 18 }]} testID={testIdWithKey('HeaderText')}>
          Ornare suspendisse sed nisi lacus
        </Text>
        <Text style={[styles.bodyText, { marginTop: 20 }]} testID={testIdWithKey('BodyText')}>
          Enim facilisis gravida neque convallis a cras semper. Suscipit adipiscing bibendum est ultricies integer quis
          auctor elit sed.
        </Text>
      </View>
      <View style={{ marginTop: 'auto', marginBottom: 20, paddingHorizontal: 20 }}>
        <Button
          title={t('Global.GetStarted')}
          accessibilityLabel={t('Global.GetStarted')}
          testID={testIdWithKey('GetStarted')}
          onPress={onTutorialCompleted}
          buttonType={ButtonType.Primary}
        />
      </View>
    </View>
  )
}

const guides: Array<{ image: string; title: string; body: string }> = [
  {
    image: 'https://i.ibb.co/M8DNVmC/Profile-Interface-1.png',
    title: 'Control your Identity',
    body: 'Take control of your identity and define the way you want it to be used.',
  },
  {
    image: 'https://i.ibb.co/9nCmdDx/Mobile-payments-1.png',
    title: 'Scan to Connect',
    body: 'Quickly connect with other organizations and users to exchange information. Simply Scan the QR code to continue',
  },
  {
    image: 'https://i.ibb.co/pdFXr0W/Plain-credit-card-1.png',
    title: 'Secure Wallet',
    body: 'Completely own your credentials by saving them securely on your phone.',
  },
  {
    image: 'https://i.ibb.co/D90Sw5H/Verified-1.png',
    title: 'Instant Verification',
    body: 'Prove your identity to Organizations by sharing only the necessary information. Simple and Hassle-free.',
  },
  {
    image: 'https://i.ibb.co/2hCsqSJ/Security-1.png',
    title: 'Privacy at its core',
    body: 'Keep your identity safe and protected from any exploits. Indisi wallet provide the safe space for all your credentials.',
  },
]

const createPageWith = (image: string, title: string, body: string, OnboardingTheme: any) => {
  const styles = createStyles(OnboardingTheme)
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flexDirection: 'row', margin: 20 }}>
        <Image source={{ uri: 'https://i.ibb.co/pn8r7YP/Group-1690.png' }} style={styles.logo} />
        <Text style={styles.appName}>indisi</Text>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ flex: 0.1 }}>
          <Text style={[styles.headerText, { fontSize: 20 }]} testID={testIdWithKey('HeaderText')}>
            {title}
          </Text>
        </View>
        <View style={{ flex: 0.5 }}>
          <Image source={{ uri: image }} style={{ height: 250, width: 250 }} resizeMode="contain" />
        </View>
        <View style={{ flex: 0.2, margin: 20 }}>
          <Text style={[styles.bodyText]} testID={testIdWithKey('BodyText')}>
            {body}
          </Text>
        </View>
      </View>
    </View>
  )
}

const OnboardingPages = (onTutorialCompleted: GenericFn, OnboardingTheme: any): Array<Element> => {
  return [
    ...guides.map((g) => createPageWith(g.image, g.title, g.body, OnboardingTheme)),
    customPages(onTutorialCompleted, OnboardingTheme),
  ]
}

export default OnboardingPages
