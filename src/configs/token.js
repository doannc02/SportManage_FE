import cookie from 'js-cookie'

export const getAppToken = () => {
    try {
        const val = cookie.get('ACCESS_TOKEN')
        if (val) return JSON.parse(val)
        return null
    } catch (e) {
        console.warn('Token không phải là JSON hợp lệ:', e)
        return null
    }
}


export const setAppToken = (val) => {
  
        return cookie.set('ACCESS_TOKEN', JSON.stringify(val))
    
    // return cookie.set('ACCESS_TOKEN', JSON.stringify(val), {
    //     domain: SUBDOMAIN,
    // })
}

export const removeAppToken = () => {
    cookie.remove('ACCESS_TOKEN')
    // cookie.remove('ACCESS_TOKEN', {
    //     domain: SUBDOMAIN,
    // })
}


export const getAppTokenFcmServiceWorker = () => {
    try {
        const val = cookie.get('FCM_TOKEN')
        if (val) return JSON.parse(val)
        return null
    } catch (e) {
        console.warn('FCM Token không phải là JSON hợp lệ:', e)
        return null
    }
}

export const setAppTokenFcmServiceWorker = (val) => {
    return cookie.set('FCM_TOKEN', JSON.stringify(val)) 
}

export const removeAppTokenFcmServiceWorker = () => {
    cookie.remove('FCM_TOKEN')
}