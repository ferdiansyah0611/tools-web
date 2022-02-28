import axios from 'axios'
import {auth, setAuth} from '@/service/auth'

axios.interceptors.request.use((config) => {
    if(auth()){
        config.headers['x-access-token'] = auth().token
    }
    return config;
}, (error) => {
    return Promise.reject(error);
})

const interceptor = axios.interceptors.response.use((response) => response, function(error) {
	if (error.response.status !== 401) {
        return Promise.reject(error);
    }
    axios.interceptors.response.eject(interceptor)
    // refresh token
    return axios(import.meta.env.VITE_API_URL + 'auth/refresh-token', {
    	method: 'post',
    	data: {
    		refresh: auth().refresh
    	}
    }).then(res => res.data).then(res => {
        setAuth(res)
    	error.response.config.headers['x-access-token'] = res.token;
    	error.response.config.baseURL = undefined;
    	return axios(error.response.config)
    }).catch(err => {
    	return Promise.reject(err)
    })
})

export default function http(url, option) {
    return axios(url, option).then((response) => response.data)
}