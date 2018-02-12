import Storage from './common/storage'
import moment from 'moment'
import CONFIG from './config'

global.__userStatusChanged = true
global.___gettingToken = false

global.FetchWithHeaders = async function (url, data, multipart) {
    let request = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    if (multipart)
        request.headers = {}

    let accessToken = await Storage.get('access_token')
    let expiry = await Storage.get('access_token_expiry')
    expiry = moment(expiry)
    let refreshToken = await Storage.get('refresh_token')

    if (accessToken) {
        let now = moment()
        if (___gettingToken == true) {
            await new Promise((resolve, reject) => {
                let interval = setInterval(() => {
                    if (!___gettingToken) {
                        clearInterval(interval)
                        Storage.get('access_token').then((token) => {
                            accessToken = token
                            resolve()
                        })
                    }
                }, 100)
            })
        } else if (now >= expiry) {
            global.___gettingToken = true
            if (refreshToken) {
                console.log("Token expired, requesting new...")
                let tokenData = {
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken
                }
                request.body = JSON.stringify(tokenData)
                let response = await fetch(CONFIG.API_ROOT + 'auth/accessToken', request)
                let json = await response.json()
                accessToken = json.data.access_token
                Storage.set('access_token', accessToken).then(() => {
                    global.___gettingToken = false
                })
                Storage.set('refresh_token', json.data.refresh_token)
                let expiry = now.add(json.data.expires_in, 's')
                Storage.set('access_token_expiry', expiry.format())
                request.body = null
            }
            else {
                Storage.clear()
                global.___gettingToken = false
                accessToken = null
            }
        }
        if (accessToken)
            request.headers.Authorization = 'Bearer ' + accessToken
    }

    if (data) {
        if (multipart)
            request.body = data;
        else
            request.body = JSON.stringify(data);
    }
    
    return fetch(url, request)
        .then((response)=>{
            return response.json();
        }, (error)=>{
            return error
        });
};


global.FetchWithoutHeaders = async function (url, data) {
    let request = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    
    if (data) {
        request.body = JSON.stringify(data);
    }

    return fetch(url, request)
        .then((response)=>{
            return response.json();
        }, (error)=>{
            return error
        });
};

global.FetchByGet = async function (url) {
    let accessToken = await Storage.get('access_token')
    return fetch({
        url: url,
        method: 'get',
        headers: accessToken ? { Authorization: 'Bearer ' + accessToken } : {},
    }).then(function (response) {
        return response.json();
    });
}
