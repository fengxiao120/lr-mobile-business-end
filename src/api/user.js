import CONFIG from '../config'

export default {

    updateProfile: (data) => {
        return FetchWithHeaders(CONFIG.API_ROOT + 'user/updateProfile', data)
    },

    updateSetting: (data) => {
        return FetchWithHeaders(CONFIG.API_ROOT + 'user/updateSetting', data)
    }

}


