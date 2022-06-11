import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CheckBoxRow, SafeAreaScrollView } from '../components'
import { isBioAuthEnabled, storeIsBioAuthEnabled } from '../services/bioAuth.service'

const BioAuth = () => {
  const { t } = useTranslation()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    isBioAuthEnabled().then((val) => {
      setChecked(val)
    })
  }, [])

  const handleCheckToggle = async () => {
    await storeIsBioAuthEnabled(!checked)
    setChecked((e) => !e)
  }

  return (
    <SafeAreaScrollView>
      <CheckBoxRow
        title={t('BioAuth.CheckInput')}
        accessibilityLabel={t('BioAuth.CheckInput')}
        // testID={testIdWithKey('IAgree')}
        checked={checked}
        onPress={handleCheckToggle}
      />
    </SafeAreaScrollView>
  )
}

export default BioAuth
