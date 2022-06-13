// export const URL = 'https://new-electro-life.texnopos.site'
export const URL = 'https://smart-shop.my-project.site'
// export const URL = 'https://sinyor.texnopos.site'
// export const URL = window.location.origin
 

export const setToken = () => ({
    headers: {
        "Authorization": 'Bearer ' + localStorage.getItem('token') || '69|Dc5XO8wRyob8mPKHlqGBIcYufXg83HTuI3ctB9PV'
    }
})



