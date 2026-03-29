import axios from 'axios'

export const API_BASE_URL = 'https://dev.codeleap.co.uk/careers/'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
