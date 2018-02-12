import { AsyncStorage } from 'react-native'
import _ from 'lodash'

const keys = ['access_token', 'refresh_token', 'access_token_expiry', 'user', 'categories','district_options']

export default {
    get: async (key) => {
        let data = await AsyncStorage.getItem(key)
        return JSON.parse(data)
    },
    set: async (key, value) => {
        return AsyncStorage.setItem(key, JSON.stringify(value))
    },
    remove: async (key) => {
        return AsyncStorage.removeItem(key)
    },
    clear: async (key) => {
        _.each(keys, (key)=>{
            AsyncStorage.removeItem(key)
        })
    }
}