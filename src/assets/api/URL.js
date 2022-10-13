// export const URL = 'https://new-electro-life.texnopos.site'
export let URL = 'https://smart-shop.my-project.site'
// export const URL = 'https://mobishop.texnopos.site'
// export const URL = window.location.origin
 

if (process.env.NODE_ENV === "production") {
    URL = window.location.origin
} else {
    URL = 'https://smart-shop.my-project.site'
}

export const setToken = () => ({
    headers: {
        "Authorization": 'Bearer ' + localStorage.getItem('token')
    }
})



