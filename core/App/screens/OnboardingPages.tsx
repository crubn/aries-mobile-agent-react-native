import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

import IndisiLogo from '../assets/img/indisi-logo-yellow-blue.svg'
import Slider1 from '../assets/img/slider-image-1.svg'
import Slider2 from '../assets/img/slider-image-2.svg'
import Slider3 from '../assets/img/slider-image-3.svg'
import Slider4 from '../assets/img/slider-image-4.svg'
import Slider5 from '../assets/img/slider-image-5.svg'
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
      height: 70,
      width: 70,
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

const guides: Array<{ image: any; title: string; body: string }> = [
  {
    image: <Slider1 />,
    title: 'Control your Identity',
    body: 'Take control of your identity and define the way you want it to be used.',
  },
  {
    image: <Slider2 />,
    title: 'Scan to Connect',
    body: 'Quickly connect with other organizations and users to exchange information. Simply Scan the QR code to continue',
  },
  {
    image: <Slider3 />,
    title: 'Secure Wallet',
    body: 'Completely own your credentials by saving them securely on your phone.',
  },
  {
    image: <Slider4 />,
    title: 'Instant Verification',
    body: 'Prove your identity to Organizations by sharing only the necessary information. Simple and Hassle-free.',
  },
  {
    image: <Slider5 />,
    title: 'Privacy at its core',
    body: 'Keep your identity safe and protected from any exploits. Indisi wallet provide the safe space for all your credentials.',
  },
]

const createPageWith = (image: string, title: string, body: string, OnboardingTheme: any) => {
  const styles = createStyles(OnboardingTheme)
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flexDirection: 'row', margin: 20, alignItems: 'center', display: 'flex' }}>
        <View style={{ marginTop: 15 }}>
          <IndisiLogo />
        </View>
        <Text style={styles.appName}>indisi</Text>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ flex: 0.1 }}>
          <Text style={[styles.headerText, { fontSize: 20 }]} testID={testIdWithKey('HeaderText')}>
            {title}
          </Text>
        </View>
        <View style={{ flex: 0.5 }}>{image}</View>
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
