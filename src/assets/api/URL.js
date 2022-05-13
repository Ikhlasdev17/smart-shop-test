export const URL = process.env.REACT_APP_BASE_URL


export const setToken = () => ({
    headers: {
        "Authorization": 'Bearer ' + localStorage.getItem('token')
    }
})



