import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

export const getAllUsers = async () => {
    try {
        const timestamp = new Date().getTime();
        let res = await axios.get(`${apiURL}/api/v1/user/all-users?t=${timestamp}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const SuspendUser = async (uId) => {
    let data = { uId };
    try {
        let res = await axios.post(`${apiURL}/api/v1/user/suspend-user`, data);
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const ActivateUser = async (uId) => {
    let data = { uId };
    try {
        let res = await axios.post(`${apiURL}/api/v1/user/activate-user`, data);
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
