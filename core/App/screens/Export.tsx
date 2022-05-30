/* eslint-disable */
import { useAgent } from '@aries-framework/react-hooks'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Clipboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { DirectoryPickerResponse, DocumentPickerResponse } from 'react-native-document-picker'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import Button, { ButtonType } from '../components/buttons/Button'
import { ToastType } from '../components/toast/BaseToast'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { testIdWithKey } from '../utils/testable'
const RNFS = require('react-native-fs')

interface PinCreateProps {
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

const ExportWallet: React.FC<PinCreateProps> = ({ setAuthenticated }) => {
  const [loading, setLoading] = useState(false)
  const [, dispatch] = useStore()
  const { t } = useTranslation()
  const { ColorPallet } = useTheme()
  const { agent } = useAgent()

  const [randomWords, setRandomWords] = useState('')

  const [result, setResult] = React.useState<
    Array<DocumentPickerResponse> | DirectoryPickerResponse | undefined | null
  >()

  const style = StyleSheet.create({
    container: {
      backgroundColor: ColorPallet.brand.primaryBackground,
      margin: 20,
      flex: 1,
      justifyContent: 'flex-end',
    },
    root: {
      flex: 1,
    },
  })

  React.useEffect(() => {
    generateRandomWords()
  }, [])

  const copyToClipboard = () => {
    Clipboard.setString(randomWords);
    Toast.show({
      type: ToastType.Success,
      text1: 'Notification',
      text2: 'Copied to clipboard',
      visibilityTime: 1500,
      position: 'bottom',
    })
  }

  const keywords = [
    'diagram',
    'clothes',
    'jealous',
    'trouble',
    'undress',
    'graphic',
    'scatter',
    'liberty',
    'harvest',
    'freedom',
    'trolley',
    'extinct',
    'density',
    'terrace',
    'glacier',
    'stomach',
    'reptile',
    'capital',
    'gravity',
    'recycle',
    'lighter',
    'drawing',
    'country',
    'support',
    'collect',
    'pyramid',
    'compact',
    'journal',
    'arrange',
    'relieve',
    'elegant',
    'limited',
    'present',
    'crevice',
    'nervous',
    'manager',
    'recover',
    'opposed',
    'private',
    'inspire',
    'section',
    'welcome',
    'laborer',
    'brother',
    'referee',
    'clique',
    'height',
    'ribbon',
    'banana',
    'injury',
    'leader',
    'redeem',
    'orange',
    'grudge',
    'sample',
    'ballot',
    'avenue',
    'ignore',
    'deport',
    'filter',
    'linger',
    'spring',
    'single',
    'energy',
    'ground',
    'master',
    'pigeon',
    'foster',
    'origin',
    'rocket',
    'heaven',
    'result',
    'praise',
    'elapse',
    'studio',
    'action',
    'tiptoe',
    'bucket',
    'member',
    'scream',
    'spread',
    'stress',
    'latest',
    'church',
    'refund',
    'bounce',
    'suburb',
    'staff',
    'small',
    'trait',
    'arrow',
    'young',
    'wrist',
    'glass',
    'suite',
    'sight',
    'check',
    'cower',
    'stain',
    'tease',
    'cross',
    'video',
    'crude',
    'smile',
    'tower',
    'enter',
    'river',
    'cycle',
    'tiger',
    'write',
    'stake',
    'world',
    'bride',
    'rumor',
    'flock',
    'eject',
    'snarl',
    'obese',
    'sheet',
    'glide',
    'leash',
    'motif',
    'train',
    'store',
    'disco',
    'tribe',
    'other',
    'jelly',
    'cruel',
    'right',
    'leave',
    'chair',
    'round',
    'smart',
    'clean',
    'quest',
    'strip',
    'owner',
    'sense',
    'entry',
    'study',
    'dash',
    'goat',
    'cake',
    'sign',
    'sigh',
    'snub',
    'bean',
    'nest',
    'bury',
    'grip',
    'rise',
    'deer',
    'mist',
    'seed',
    'ruin',
    'feed',
    'oven',
    'mill',
    'mine',
    'jest',
    'unit',
    'plot',
    'damn',
    'crop',
    'tidy',
    'rest',
    'gown',
    'bare',
    'harm',
    'food',
    'loan',
    'list',
    'deal',
    'cage',
    'duck',
    'knit',
    'draw',
    'step',
    'help',
    'case',
    'mold',
    'bulb',
    'acid',
    'scan',
    'wage',
    'soft',
    'wash',
    'fold',
    'sock',
    'warn',
    'lace',
    'seat',
    'pony',
    'mole',
    'form',
  ]

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }

  const generateRandomWords = () => {
    const max = keywords.length - 1
    let paraphrase = ''

    for (let i = 0; i < 15; i++) {
      paraphrase += keywords[getRandomInt(max)] + ' '
    }
    console.log("paraphrase", paraphrase.trim())
    setRandomWords(paraphrase.trim())
  }
  const exportWallet = async () => {
    const backupKey = randomWords
    const random = Math.floor(Math.random() * 10000)
    const backupWalletName = `backup-${random}`
    const path = `${RNFS.ExternalStorageDirectoryPath}/${backupWalletName}`

    console.log('newAgent.wallet', agent.wallet.export, path, agent.config.walletConfig)

    agent.wallet
      .export({ path: path, key: backupKey })
      .then((res) => {
        Toast.show({
          type: ToastType.Success,
          text1: 'Wallet exported successfully',
          text2: path,
          visibilityTime: 3000,
          position: 'bottom',
        })
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  return (
    <SafeAreaView style={style.root}>
      {loading ? <ActivityIndicator /> : null}

      <View style={{ margin: 10 }}>
        <View style={{ backgroundColor: '#343434', padding: 20 }}>
          <Text style={{ fontSize: 30, lineHeight: 50 }}>{randomWords}</Text>
        </View>
        <TouchableOpacity activeOpacity={0.5} style={{ marginTop: 10 }} onPress={() => copyToClipboard()}>
          <Text>Copy to clipboard</Text>
        </TouchableOpacity>
      </View>

      <View style={[style.container]}>
        <TouchableOpacity activeOpacity={0.5} style={{ marginBottom: 20 }} onPress={() => generateRandomWords()}>
          <Text>Generate Again</Text>
        </TouchableOpacity>
        <Button
          styles={{}}
          disabled={loading}
          title={'Export wallet'}
          accessibilityLabel={t('PinCreate.Create')}
          testID={testIdWithKey('Create')}
          buttonType={ButtonType.Primary}
          onPress={()=> exportWallet()}
        />
      </View>
    </SafeAreaView>
  )
}

export default ExportWallet
