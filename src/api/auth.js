import CONFIG from '../config'

import Storage from '../common/storage'

export default {
    login: (user) => {
        return FetchWithHeaders(CONFIG.API_ROOT + 'auth/login', user)
    },
    register:(user) => {
    	return FetchWithoutHeaders(CONFIG.API_ROOT + 'auth/register', user)
    },
	reset:(email) => {
    	return FetchWithoutHeaders(CONFIG.API_ROOT + 'auth/sendResetPasswordLink', { email: email })
	}    
}


