import axios from 'axios';

// Browser-side API client: requests go to the relative `/api/...` paths and
// are routed by the nginx ingress.
const apiClient = axios.create({
  baseURL: '/'
});

export default apiClient;
