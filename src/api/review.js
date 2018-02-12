import CONFIG from '../config'

export default {
    list: (id, page) => {
        return FetchWithHeaders(CONFIG.API_ROOT + 'review/list', { shopId: id, page: page })
    },
    review: (review) => {
        return FetchWithHeaders(CONFIG.API_ROOT + 'review/review', review)
    },

    listByUser:(page) => {
    	return FetchByGet(CONFIG.API_ROOT + 'review/listByUser?page='+page)
    },

    delete: (reviewId) => {
    	return FetchWithHeaders(CONFIG.API_ROOT + 'review/delete', {id:reviewId})
    },

    report: (reporterName, reporterEmail, reviewId, reviewText, ownerName, ownerId, shopId, shopName, reason) => {
        return FetchWithHeaders(CONFIG.API_ROOT + 'review/report', 
        {
        from:reporterName,
        email:reporterEmail,
        id:reviewId, 
        text:reviewText,
        ownerName:ownerName,
        ownerId:ownerId,
        shopId:shopId,
        shopName:shopName, 
        reason:reason})  
    },

    vote: (reviewId) => {
        return FetchWithHeaders(CONFIG.API_ROOT + 'review/vote', {id:reviewId})
    },     

}


