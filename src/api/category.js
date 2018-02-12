import CONFIG from '../config'
import Storage from '../common/storage'

export default {
    list: () => {
        return new Promise((resolve, reject) => {
            let existing = Storage.get('categories')
            if (existing && existing.length > 0) {
                resolve({ data: existing })
            } else {
                FetchWithHeaders(CONFIG.API_ROOT + 'category/list').then((json) => {
                    Storage.set('categories', json.data)
                    resolve(json)
                }, (error) => {
                    reject(error)
                })
            }
        })
    }
}