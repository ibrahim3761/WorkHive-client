import axios from "axios";


const axiosInstance = axios.create({
    baseURL: `https://work-hive-server-five.vercel.app`
})

const useAxios = () => {
    return axiosInstance
};

export default useAxios;