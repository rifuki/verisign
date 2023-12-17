import axios from 'axios';

export const axiosJsonPlace = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com'
});

export const axiosBackend = axios.create({
    baseURL: 'http://localhost:3001',
    withCredentials: true
});
