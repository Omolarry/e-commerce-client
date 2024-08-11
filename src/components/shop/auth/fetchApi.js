import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

export const isAuthenticate = () =>
  localStorage.getItem("jwt") ? JSON.parse(localStorage.getItem("jwt")) : false;

export const isAdmin = () =>
  localStorage.getItem("jwt")
    ? JSON.parse(localStorage.getItem("jwt")).user.role === 1
    : false;

export const loginReq = async ({ email, password }) => {
  const data = { email, password };
  try {
    let res = await axios.post(`${apiURL}/api/v1/auth/signin`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const verifyOtpReq = async ({ otp }) => {
  const data = { otp };
  try {
    let res = await axios.post(`${apiURL}/api/v1/auth/verify-otp`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const signupReq = async ({ name, email, password, cPassword }) => {
  const data = { name, email, password, cPassword };
  try {
    let res = await axios.post(`${apiURL}/api/v1/auth/signup`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const forgotPasswordReq = async ({ email }) => {
  const data = { email };
  try {
    let res = await axios.post(`${apiURL}/api/v1/auth/forgot-password`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const resetPasswordReq = async ({ token, password, cPassword }) => {
  const data = { password, cPassword };
  try {
    let res = await axios.patch(`${apiURL}/api/v1/auth/reset-password/${token}`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};