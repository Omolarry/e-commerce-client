import React, { Fragment, useState, useContext } from "react";
import { forgotPasswordReq } from "./fetchApi";
import { LayoutContext } from "../index";

const ForgotPassword = () => {
    const { dispatch: layoutDispatch } = useContext(LayoutContext);

    const [data, setData] = useState({
        email: "",
        error: false,
        loading: false,
        isSubmitting: false,
        successMessage: ""
    });

    const alert = (msg, type) => (
        <div className={`text-xs ${type === "error" ? "text-red-500" : "text-green-500"}`}>
            {msg}
        </div>
    );

    const formSubmit = async (e) => {
        e.preventDefault();
        setData({ ...data, loading: true, isSubmitting: true });

        try {
            let responseData = await forgotPasswordReq({ email: data.email });

            if (responseData.error) {
                setData({
                    ...data,
                    loading: false,
                    isSubmitting: false,
                    error: responseData.error,
                    successMessage: ""
                });
            } else if (responseData.success) {
                setData({
                    ...data,
                    email: "",
                    loading: false,
                    isSubmitting: false,
                    error: false,
                    successMessage: "Password reset link has been sent to your email!"
                });
            }
        } catch (error) {
            console.log(error);
            setData({
                ...data,
                loading: false,
                isSubmitting: false,
                error: "An unexpected error occurred.",
                successMessage: ""
            });
        }
    };

    return (
        <Fragment>
            <div style={{ padding: '100px' }}>
                <div className="text-2xl mb-6">Enter your registered email address</div>
                {data.error && (
                    <div className="bg-red-200 py-2 px-4 rounded">
                        {alert(data.error, "error")}
                    </div>
                )}
                {data.successMessage && (
                    <div className="bg-green-200 py-2 px-4 rounded">
                        {alert(data.successMessage, "success")}
                    </div>
                )}
                <form className="space-y-4" onSubmit={formSubmit}>
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
                            type="email"
                            id="email"
                            className={`${!data.error ? "" : "border-red-500"
                                } px-4 py-2 focus:outline-none border`}
                        />
                        {/* {!data.error ? "" : alert(data.error, "error")} */}
                    </div>
                    <button
                        type="submit"
                        disabled={data.isSubmitting}
                        style={{ background: "#303031" }}
                        className="font-medium px-4 py-2 text-white text-center cursor-pointer"
                    >
                        {data.isSubmitting ? "Sending..." : "Send password reset link"}
                    </button>
                </form>
            </div>
        </Fragment>
    );
};

export default ForgotPassword;
