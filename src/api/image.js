import CONFIG from '../config'

export default {
    upload: (data) => {
        return FetchWithHeaders(CONFIG.API_ROOT + 'image/upload', data, true)
    }
}


