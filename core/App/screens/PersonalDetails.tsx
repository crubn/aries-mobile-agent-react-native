import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native'
import { TextInput } from 'react-native-paper'

import IndisiLogo from '../assets/img/indisi-logo-yellow-blue.svg'
import PersonalDetailSVG from '../assets/img/personal-details.svg'
import Button, { ButtonType } from '../components/buttons/Button'
import { useTheme } from '../contexts/theme'
import { AuthenticateStackParams, Screens } from '../types/navigators'

const styles = StyleSheet.create({
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
  input: {
    marginTop: 20,
    backgroundColor: 'white',
    fontSize: 13,
    fontFamily: 'Avenir-Medium',
    borderColor: '#79747E',
  },
  heading: {
    fontFamily: 'Avenir-Medium',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#444',
  },
  buttonView: { justifyContent: 'center', alignItems: 'center', marginTop: 80 },
})

const Personal = () => {
  const [name, setName] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [email, setEmail] = React.useState('')
  const { ColorPallet, Assets } = useTheme()
  const navigation = useNavigation<StackNavigationProp<AuthenticateStackParams>>()

  return (
    <SafeAreaView>
      <ScrollView>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={{ flexDirection: 'row', margin: 20, alignItems: 'center', display: 'flex' }}>
            <View style={{ marginTop: 15 }}>
              <IndisiLogo />
            </View>
            <Text style={styles.appName}>indisi</Text>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <PersonalDetailSVG />
            <Text style={styles.heading}>Create your Indisi Account</Text>
          </View>
          <View style={{ margin: 30, marginTop: 0 }}>
            <TextInput
              style={styles.input}
              mode="outlined"
              label="Name"
              value={name}
              onChangeText={(text: any) => setName(text)}
            />
            <TextInput
              style={styles.input}
              mode="outlined"
              label="Phone Number (Optional)"
              value={phone}
              onChangeText={(text: any) => setPhone(text)}
            />
            <TextInput
              style={styles.input}
              mode="outlined"
              label="Email (Optional)"
              value={email}
              keyboardType="email-address"
              onChangeText={(text: any) => setEmail(text)}
            />
          </View>
          <View style={styles.buttonView}>
            <Button
              onPress={() => navigation.navigate(Screens.UseBiometry)}
              title={'Continue'}
              buttonType={ButtonType.Primary}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  )
}
export default Personal
