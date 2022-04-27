export const URL = 'https://smart-shop.my-project.site'

export const setToken = () => ({
    headers: {
        "Authorization": 'Bearer ' + localStorage.getItem('token')
    }
})



