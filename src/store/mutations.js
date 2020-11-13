export const state = {
    userInfo: null
}
export const mutations = {
    'SET_USER_INFO'(state, data) {
        state.userInfo = data
    }
}