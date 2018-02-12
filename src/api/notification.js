import CONFIG from '../config'

export default {
    list: () => {
        return FetchWithHeaders(CONFIG.API_ROOT+'notification/list')
    }
}