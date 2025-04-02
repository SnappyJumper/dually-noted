import axios from "axios";

axios.defaults.baseURL = 'https://dually-noted-f734097d9d34.herokuapp.com/'
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axios.defaults.withCredentials = true;