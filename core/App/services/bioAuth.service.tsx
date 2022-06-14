import AsyncStorage from '@react-native-async-storage/async-storage'

export const storeIsBioAuthEnabled = async (val: boolean) => {
  await AsyncStorage.setItem('isBioAuthEnabled', `${val}`)
}

export const isBioAuthEnabled = async () => {
  const val = await AsyncStorage.getItem('isBioAuthEnabled')
  return val === 'true'
}
