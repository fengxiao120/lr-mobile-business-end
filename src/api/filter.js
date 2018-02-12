import CONFIG from '../config'

export default {
    getList: () => {
        return FetchByGet(CONFIG.API_ROOT + 'filter/list')
    },
}