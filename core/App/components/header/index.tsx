import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import IndisiLogo from '../../assets/img/indisi-logo-yellow-blue.svg'

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        margin: 20,
        alignItems: 'center',
        display: 'flex',
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
    logoMargin: { marginTop: 15 },
})

const Header = () => {
    return (
        <View style={styles.container}>
            <View style={styles.logoMargin}>
                <IndisiLogo />
            </View>
            <Text style={styles.appName}>indisi</Text>
        </View>
    )
}

export default Header
