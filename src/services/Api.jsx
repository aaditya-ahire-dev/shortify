import axios from "axios";


const axiosInstance =  axios.create({
    baseURL:import.meta.env.VITE_BACKEND_API_URL,
    withCredentials: true
})

// auth APIS 
export async function loginUser(userData) {
    return await axiosInstance.post('/user/login' , userData)
}
export async function signUpUser(userData) {
    return await axiosInstance.post('/user/signup' , userData)
}

// admin Auth APIS 
export async function adminLoginUser(adimnData) {
    return await axiosInstance.post('/admin/login' , adimnData)
}
export async function adminSignUpUser(adimnData) {
    return await axiosInstance.post('/admin/signup' , adimnData)
}

// URLS API
export async function getUrlsCreatedByUser() {
    return await axiosInstance.get('/url/getallurls')
}

export async function createShortUrl(url) {
    return await axiosInstance.post('/url/geturl' , {url})
}
export async function deleteUrl(deleteUrl) {
    return await axiosInstance.delete(`/url/delete/${deleteUrl}` )
}

// Admin Actions APIS 
export async function getAllURLs() {
    return await axiosInstance.get('/admin/getallurls')
}

export async function getDeatiles(query) {
    return await axiosInstance.post('/admin/urlDetails' , {query})
}
