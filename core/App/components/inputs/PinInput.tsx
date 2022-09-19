import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native'
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { minPINLength } from '../../constants'
import { useTheme } from '../../contexts/theme'
import { testIdWithKey } from '../../utils/testable'
import styles, {
  ACTIVE_CELL_BG_COLOR,
  CELL_BORDER_RADIUS,
  CELL_SIZE,
  DEFAULT_CELL_BG_COLOR,
  NOT_EMPTY_CELL_BG_COLOR,
} from './styles'
const { Value, Text: AnimatedText } = Animated
const CELL_COUNT = minPINLength
const source = {
  uri: 'https://user-images.githubusercontent.com/4661784/56352614-4631a680-61d8-11e9-880d-86ecb053413d.png',
}

const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0))
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1))
const animateCell = ({ hasValue, index, isFocused }) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 250,
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
      duration: hasValue ? 300 : 250,
    }),
  ]).start()
}

interface PinInputProps {
  label?: string
  onPinChanged?: (pin: string) => void
  testID?: string
  accessibilityLabel?: string
  autoFocus?: boolean
}

const PinInput: React.FC<PinInputProps> = ({ label, onPinChanged, testID, accessibilityLabel, autoFocus = false }) => {
  // const accessible = accessibilityLabel && accessibilityLabel !== '' ? true : false
  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [value, setValue] = useState('')
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT })

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: pin,
    setValue: setPin,
  })
  const { t } = useTranslation()
  const { TextTheme, PinInputTheme } = useTheme()
  const style = StyleSheet.create({
    codeField: {
      // flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 100,
    },
    codeFieldRoot: {
      marginBottom: 24,
    },
    // cell: {
    //   width: 20,
    //   height: 20,
    //   backgroundColor: PinInputTheme.cell.backgroundColor,
    //   // borderWidth: 2,
    //   borderRadius: 50,
    //   // borderColor: PinInputTheme.cell.borderColor,
    //   margin: 8,
    // },
    cell: {
      width: 40,
      height: 40,
      lineHeight: 38,
      fontSize: 24,
      borderWidth: 2,
      borderColor: '#00000030',
      textAlign: 'center',
    },
    // focusedCell: {
    //   borderColor: PinInputTheme.focussedCell.borderColor,
    // },
    cellText: {
      // ...TextTheme.headingThree,
      color: 'red',
      // textAlign: 'center',
      // textAlignVertical: 'center',
      // lineHeight: 42,
    },
  })

  const renderCell = ({ index, symbol, isFocused }) => {
    const hasValue = Boolean(symbol)
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[index].interpolate({
          inputRange: [0, 1],
          outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
        })
        : animationsColor[index].interpolate({
          inputRange: [0, 1],
          outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
        }),
      borderRadius: animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
      }),
      transform: [
        {
          scale: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.5, 1],
          }),
        },
      ],
    }

    // Run animation on next event loop tik
    // Because we need first return new style prop and then animate this value
    setTimeout(() => {
      animateCell({ hasValue, index, isFocused })
    }, 0)

    return (
      <AnimatedText key={index} style={[styles.cell, animatedCellStyle]} onLayout={getCellOnLayoutHandler(index)}>
        {symbol || showPin || (isFocused ? <Cursor /> : null)}
      </AnimatedText>
    )
  }

  return (
    <View style={[style.codeField]}>
      {/* <CodeField
          {...props}
          testID={testID}
          accessibilityLabel={accessibilityLabel}
          accessible
          value={pin}
          onChangeText={(value: string) => {
            onPinChanged && onPinChanged(value)
            setPin(value)
            if (value.length === minPINLength) {
              Keyboard.dismiss()
            }
          }}
          cellCount={minPINLength}
          keyboardType="numeric"
          textContentType="password"
          rootStyle={style.codeFieldRoot}
          renderCell={({ index, symbol, isFocused }) => {
            let child = ''
            if (symbol) {
              child = showPin ? symbol : '•'
            }
            return (
              <View
                key={index}
                style={[style.cell, isFocused && style.focusedCell]}
                onLayout={getCellOnLayoutHandler(index)}
              >
                <Text style={[style.cellText]} maxFontSizeMultiplier={1}>
                  {child}
                </Text>
              </View>
            )
          }}
          autoFocus={autoFocus}
        /> */}
      <CodeField
        ref={ref}
        {...props}
        value={pin}
        onChangeText={(value: string) => {
          onPinChanged && onPinChanged(value)
          setPin(value)
          if (value.length === minPINLength) {
            Keyboard.dismiss()
          }
        }}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="numeric"
        textContentType="password"
        renderCell={renderCell}
      />
      {/* <TouchableOpacity
        accessibilityLabel={showPin ? t('PinCreate.Hide') : t('PinCreate.Show')}
        testID={showPin ? testIdWithKey('Hide') : testIdWithKey('Show')}
        onPress={() => setShowPin(!showPin)}
        style={[{ marginRight: 8, marginBottom: 32 }]}
      >
        <Icon color={PinInputTheme.icon.color} name={showPin ? 'visibility-off' : 'visibility'} size={30}></Icon>
      </TouchableOpacity> */}
    </View>
  )
}

export default PinInput
