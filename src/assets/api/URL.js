export const URL = 'https://smart-shop.my-project.site'
// export const URL = window.location.origin
 

export const setToken = () => ({
    headers: {
        "Authorization": 'Bearer ' + localStorage.getItem('token')
    }
})



