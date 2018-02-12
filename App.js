import React, { PureComponent } from 'react'
import { AppRegistry } from 'react-native'
import Storage from './src/common/storage'
import RootScene from './src/RootScene';

import { PermissionsAndroid, Platform } from 'react-native';

import Permissions from 'react-native-permissions'
global.___location = null;

async function getPosition() {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
        Permissions.request('location').then(response => {
            // Returns once the user has chosen to 'allow' or to 'not allow' access
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            if (response == 'authorized') {
                navigator.geolocation.getCurrentPosition(
                    (initialPosition) => { global.___location = initialPosition },
                    (error) => {
                        if (error.message = 'Location request timed out')
                            global.___location = { coords: { latitude: 1.285202, longitude: 103.8449399 } }//Dummy location, somewhere in Chinatown
                        console.log(error)
                    }
                );
            }
        })
    } else if (Platform.OS === 'ios')
        navigator.geolocation.getCurrentPosition(
            (initialPosition) => { global.___location = initialPosition },
            (error) => {
                if (error.message = 'Location request timed out')
                    global.___location = { coords: { latitude: 1.285202, longitude: 103.8449399 } }//Dummy location, somewhere in Chinatown
                console.log(error)
            }

        )
}

getPosition()
setInterval(getPosition, 1000 * 5 * 60)


global.___login = async (navigation, _from, loginCallback) => {
    let user = await Storage.get("user")
    if (user)
        return true
    else
        navigation.navigate('Login', { from: _from ? _from : 'App', callback:loginCallback })

    return false
}


export default class LR extends PureComponent {
    render() {
        return (<
            RootScene />
        );
    }
}


