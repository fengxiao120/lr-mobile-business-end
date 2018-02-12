import CONFIG from '../config'

export default {
    appHomeList: (params) => {
        return FetchWithHeaders(CONFIG.API_ROOT + 'shop/appHomeList', params)
    },
    nearby: (params) => {
        return FetchWithHeaders(CONFIG.API_ROOT + 'shop/nearby', params)
    },
    get: (id) => {
        return FetchWithHeaders(CONFIG.API_ROOT + 'shop/get', { id: id })
    },
    customerFilter: (params) => {
        return FetchWithHeaders(CONFIG.API_ROOT + 'shop/customerFilter', params)
    },
    favorite: (id) => {
        return FetchWithHeaders(CONFIG.API_ROOT + 'shop/favorite', {
            id: id
        })
    },
    getRecentViewedShops: () => {
        return FetchByGet(CONFIG.API_ROOT + 'shop/getRecentViewedShops')
    },
    
    findUserFavorite: (page) => {
        return FetchByGet(CONFIG.API_ROOT + 'shop/findUserFavorite?page='+page)
    },
}


