import React, { Fragment, useState, useContext } from "react";
import { loginReq, verifyOtpReq } from "./fetchApi";
import { LayoutContext } from "../index";

const Login = (props) => {
  const { data: layoutData, dispatch: layoutDispatch } = useContext(LayoutContext);

  const [data, setData] = useState({
    email: "",
    password: "",
    otp: "",
    showOtpField: false,
    jwtToken: "",
    error: false,
    loading: false,
  });

  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (msg) => setAlertMessage(msg);

  const formSubmit = async () => {
    setData({ ...data, loading: true });
    try {
      let responseData = await loginReq({
        email: data.email,
        password: data.password,
      });
      if (responseData.error) {
        setData({
          ...data,
          loading: false,
          error: responseData.error,
          password: "",
        });
        showAlert(responseData.error);
      } else if (responseData.token) {
        setData({
          ...data,
          showOtpField: true,
          jwtToken: responseData,
          //jwtToken: localStorage.setItem("jwt", JSON.stringify(responseData)),
          loading: false
        });
        showAlert("OTP sent to your email. Please check your inbox.");
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      setData({ ...data, loading: false });
      showAlert('An error occurred during login');
    }
  };

  const handleOtpVerification = async () => {
    try {
      const otpResponse = await verifyOtpReq({
        otp: data.otp,
        jwtToken: data.jwtToken
      });

      if (otpResponse.success) {
        localStorage.setItem("jwt", JSON.stringify(data.jwtToken));
        window.location.href = "/";
        // Redirect to your dashboard or perform any additional actions for successful login
      } else {
        showAlert("OTP is invalid or has expired.");
        setData({
          otp: "",
          showOtpField: false,
        });
      }
    } catch (error) {
      console.error("Error during OTP verification:", error.message);
      showAlert("An error occurred during OTP verification");
    }
  };

  return (
    <Fragment>
      <div className="text-center text-2xl mb-6">Login</div>
      {layoutData.loginSignupError && (
        <div className="bg-red-200 py-2 px-4 rounded">
          Almost there! Please create an account or login to proceed to checkout
        </div>
      )}
      {alertMessage && (
        <div className="text-xs text-red-500">{alertMessage}</div>
      )}
      <form className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="email">
            Email address
            <span className="text-sm text-gray-600 ml-1">*</span>
          </label>
          <input
            onChange={(e) => {
              setData({ ...data, email: e.target.value, error: false });
              layoutDispatch({ type: "loginSignupError", payload: false });
            }}
            value={data.email}
            type="text"
            id="email"
            className={`${!data.error ? "" : "border-red-500"} px-4 py-2 focus:outline-none border`}
            disabled={data.showOtpField}
          />
          {/* {data.error && <div className="text-xs text-red-500">{data.error}</div>} */}
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">
            Password<span className="text-sm text-gray-600 ml-1">*</span>
          </label>
          <input
            onChange={(e) => {
              setData({ ...data, password: e.target.value, error: false });
              layoutDispatch({ type: "loginSignupError", payload: false });
            }}
            value={data.password}
            type="password"
            id="password"
            className={`${!data.error ? "" : "border-red-500"} px-4 py-2 focus:outline-none border`}
            disabled={data.showOtpField}
          />
          {/* {data.error && <div className="text-xs text-red-500">{data.error}</div>} */}
        </div>

        {data.showOtpField && (
          <>
            <div className="flex flex-col">
              <label htmlFor="otp">
                OTP<span className="text-sm text-gray-600 ml-1">*</span>
              </label>
              <input
                type="text"
                placeholder="OTP"
                onChange={(e) => setData({ ...data, otp: e.target.value })}
                className="px-4 py-2 focus:outline-none border"
              />
            </div>
            <div
              onClick={handleOtpVerification}
              style={{ background: "#303031" }}
              className="font-medium px-4 py-2 text-white text-center cursor-pointer"
            >
              Verify OTP
            </div>
          </>
        )}

        {!data.showOtpField && (
          <div
            onClick={(e) => {
              e.preventDefault();
              formSubmit();
            }}
            style={{ background: "#303031" }}
            className="font-medium px-4 py-2 text-white text-center cursor-pointer"
          >
            Login
          </div>
        )}
        <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:items-center">
          <div>
            <input
              type="checkbox"
              id="rememberMe"
              className="px-4 py-2 focus:outline-none border mr-1"
              disabled={data.showOtpField}
            />
            <label htmlFor="rememberMe">
              Remember me<span className="text-sm text-gray-600">*</span>
            </label>
          </div>
          <a
            className={`block text-gray-600 ${data.showOtpField ? "pointer-events-none text-gray-400" : ""}`}
            href="/forgot-password"
            onClick={data.showOtpField ? (e) => e.preventDefault() : undefined}
          >
            Forgot password?
          </a>
        </div>
      </form>
    </Fragment>
  );
};

export default Login;
