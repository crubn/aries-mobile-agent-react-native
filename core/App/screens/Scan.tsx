//@ts-nocheck
import { Agent } from '@aries-framework/core'
import { useAgent } from '@aries-framework/react-hooks'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { BarCodeReadEvent } from 'react-native-camera'
import QRScanner from '../components/misc/QRScanner'
import { BifoldError, QrCodeScanError } from '../types/error'
import { ConnectStackParams, Screens, Stacks } from '../types/navigators'
import { isRedirection } from '../utils/helpers'



type ScanProps = StackScreenProps<ConnectStackParams>

const Scan: React.FC<ScanProps> = ({ navigation }) => {
  const { agent } = useAgent()
  const { t } = useTranslation()
  const [qrCodeScanError, setQrCodeScanError] = useState<QrCodeScanError | null>(null)

  const handleRedirection = async (url: string, agent?: Agent): Promise<void> => {
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      })
      const message = await res.json()
      await agent?.receiveMessage(message)
      navigation.getParent()?.navigate(Stacks.ConnectionStack, {
        screen: Screens.Connection,
        params: { threadId: message['@id'] },
      })
    } catch (err: unknown) {
      const error = new BifoldError(
        'Unable to accept connection',
        'There was a problem while accepting the connection redirection',
        1024.1
      )
      throw error
    }
  }

  const handleInvitation = async (url: string): Promise<void> => {
    console.log('agent', agent.connections, agent.connections.receiveInvitationFromUrl)
    try {
      const connectionRecord = await agent?.oob.receiveInvitationFromUrl(url, {
        autoAcceptConnection: true,
      })
      console.log('connection record', connectionRecord)
      if (!connectionRecord?.connectionRecord.id) {
        console.log('connectionRecord?.id)', connectionRecord?.id)
        throw new BifoldError(
          'Unable to accept connection',
          'There was a problem while accepting the connection.',
          1024.2
        )
      }
      //setConnectionId(connectionRecord.id)
      navigation.getParent()?.navigate(Stacks.ConnectionStack, {
        screen: Screens.Connection,
        params: { connectionId: connectionRecord.id },
      })
    } catch (err) {
      console.log('error from handleInvitation', err)
      const error = new BifoldError(
        'Unable to accept connection',
        'There was a problem while accepting the connection.',
        1024
      )
      throw error
    }
  }

  const handleCodeScan = async (event: BarCodeReadEvent) => {
    setQrCodeScanError(null)
    console.log('Scan.tsx', event)
    try {
      const url = event.data
      if (isRedirection(url)) {
        console.log('inside isRedirection')
        await handleRedirection(url, agent)
      } else {
        console.log('inside handleInvitation')
        await handleInvitation(url)
      }
    } catch (e: unknown) {
      console.log('e', e)
      const error = new QrCodeScanError(t('Scan.InvalidQrCode'), event.data)
      setQrCodeScanError(error)
    }
  }

  return <QRScanner handleCodeScan={handleCodeScan} error={qrCodeScanError} enableCameraOnError={true} />
}

export default Scan
