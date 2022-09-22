/* eslint-disable prettier/prettier */
import React from 'react'
import { Text, View } from 'react-native'
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

import { useTheme } from '../../contexts/theme'


interface InfoProps {
    title: string
    accessibilityLabel?: string
    testID?: string
    onPress?: () => void
    disabled?: boolean
}

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

const Info: React.FC<InfoProps> = ({ title, accessibilityLabel, testID, onPress, disabled = false }) => {
    return <Card style={{ borderRadius: 10 }}>
        <Card.Title title="Card Title" subtitle="Card Subtitle" left={LeftContent} />
        <Card.Content>
            <Title>Card stitsle</Title>
            <Paragraph>Card cosntent</Paragraph>
        </Card.Content>
        <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
        <Card.Actions>
            <Button>Cancel</Button>
            <Button>Ok</Button>
        </Card.Actions>
    </Card>
}

export default Info
