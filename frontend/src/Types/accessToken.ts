import axios from "axios";

let accessToken: string;
export const setAccessToken = (value: string) => {
	accessToken = value;
	axios.defaults.headers.common['Authorization'] = 'JWT ' + accessToken;
};

export const getAccessToken = () => {
	return accessToken;
};