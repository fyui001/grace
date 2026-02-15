import axios from 'axios'
import { apiBasePath, ssrApiBasePath } from 'utils/urls'

export const apiClient = axios.create({
  baseURL: apiBasePath,
  withCredentials: true,
})

export const ssrApiClient = axios.create({
  baseURL: ssrApiBasePath,
  withCredentials: true,
  maxRedirects: 0,
  headers: {
    Host: new URL(apiBasePath).host,
  },
})
