import Cookie from 'js-cookie'
export const setPaw = (obj) => {
    if (sessionStorage.getItem('token')) {
        Cookie.set('userinfo', JSON.stringify(obj), {expires: 30})
    }
}

export const getPaw = () => {
    return Cookie.get('userinfo') || false
}
