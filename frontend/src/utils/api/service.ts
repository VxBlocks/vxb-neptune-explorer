
import { BASE_URL } from "@/config";
import { readLocalStorageValue } from "@mantine/hooks";
import axios from "axios";

const service = axios.create({
    baseURL: "",
    timeout: 25000,
})

service.interceptors.request.use((config) => {
    const token = readLocalStorageValue({ key: "token", defaultValue: "" });
    const productName = readLocalStorageValue({ key: "currentToken", defaultValue: "" });
    if (token) {
        config.headers["authorization"] = `${token}`;
        config.headers["productName"] = `${productName}`;
    }
    return config;
})

service.interceptors.response.use((response) => {
    if (response.status === 200 && response.data.code === 10012) {
        localStorage.setItem("token", "");
    }
    return response;
});

export const url = (url: string) => {
    return BASE_URL + url;
}


export default service;

