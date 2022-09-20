import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

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
      fontFamily: 'Avenir-Medium',
    },
    carouselContainer: {
      ...OnboardingTheme.carouselContainer,
      flexDirection: 'column',
      backgroundColor: 'white',
    },
    pagerContainer: {
      flexShrink: 2,
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: 100,
      backgroundColor: 'white',
    },
    pagerDot: {
      ...OnboardingTheme.pagerDot,
      borderRadius: 20,
      width: 20,
    },
    pagerDotActive: {
      ...OnboardingTheme.pagerDotActive,
      borderRadius: 0,
      width: 10,
    },
    pagerDotInactive: {
      ...OnboardingTheme.pagerDotInactive,
      borderRadius: 20,
      width: 20,
    },
    pagerPosition: {
      // position: 'relative',
      // top: 10,
      marginTop: 100,
    },
    pagerNavigationButton: {
      ...OnboardingTheme.pagerNavigationButton,
      fontSize: 18,
      fontWeight: 'bold',
      color: '#202B67',
    },
  })
}

export const createStyles = (OnboardingTheme: any) => {
  return StyleSheet.create({
    headerText: {
      ...OnboardingTheme.headerText,
      fontFamily: 'Avenir-Medium',
    },
    bodyText: {
      ...OnboardingTheme.bodyText,
      flexShrink: 1,
      fontFamily: 'Avenir-Medium',
      // fontSize: 15,
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
      marginTop: 10,
    },
    appName: {
      color: '#202B67',
      fontSize: 35,
      marginTop: 10,
      fontFamily: 'Avenir-Medium',
      marginLeft: 20,
    },
  })
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
  return [...guides.map((g) => createPageWith(g.image, g.title, g.body, OnboardingTheme))]
}

export default OnboardingPages
