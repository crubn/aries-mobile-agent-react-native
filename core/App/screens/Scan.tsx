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
    // try {
    // console.log('url', url)
    // const res = await fetch(url, {
    //   method: 'GET',
    //   headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // })
    // console.log('res', res)
    // const message = await res.json()
    // console.log('message', message)

    // fetch(url, {
    //   method: 'GET',
    //   headers: { accept: 'application/json', 'Content-Type': 'application/json' },
    // }).then((response) => {
    //   console.log('response', response, typeof response)
    //   response.json().then(async (message) => {
    //     // code that can access both here
    //     await agent?.receiveMessage(message)
    //     navigation.getParent()?.navigate(Stacks.ConnectionStack, {
    //       screen: Screens.Connection,
    //       params: { threadId: message['@id'] },
    //     })
    //   })

    const t = {
      '@type': 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/out-of-band/1.0/invitation',
      '@id': 'abe13fce-5873-4b35-ad0d-d2251dfba96a',
      services: [
        {
          id: '#inline',
          type: 'did-communication',
          recipientKeys: ['did:key:z6MkvnPKCFJERJ226LgWMzDgBKNJqzLRFnAeSV3o1Rz1pgAm'],
          serviceEndpoint: 'https://cloudagent.indisi.crubn.com/agent',
        },
      ],
      label: 'Invitation to Barry',
      handshake_protocols: ['did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0'],
    }
    await agent?.receiveMessage(t)
    navigation.getParent()?.navigate(Stacks.ConnectionStack, {
      screen: Screens.Connection,
      params: { threadId: t['@id'] },
    })
    //   })
    // } catch (err: unknown) {
    //   console.log('err in handleRedirection', err)
    //   const error = new BifoldError(
    //     'Unable to accept connection',
    //     'There was a problem while accepting the connection redirection',
    //     1024.1
    //   )
    //   throw error
    // }
  }

  const handleInvitation = async (url: string): Promise<void> => {
    console.log('agent', agent.connections, agent.connections.receiveInvitationFromUrl)
    try {
      const connectionRecord = await agent.oob.receiveInvitationFromUrl(url, {
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
