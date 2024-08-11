import React, { Fragment, useState, useEffect } from "react";
import { resetPasswordReq } from "./fetchApi";
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
    const { token } = useParams();

    const [data, setData] = useState({
        password: "",
        cPassword: "",
        error: null,
        loading: false,
        isSubmitting: false,
        successMessage: ""
    });

    const alert = (msg, type) => (
        <div className={`text-xs ${type === "error" ? "text-red-500" : "text-green-500"}`}>
            {msg}
        </div>
    );

    useEffect(() => {
        return () => {
            setData({}); // Cleanup function to reset state on unmount
        };
    }, []);

    const formSubmit = async (e) => {
        e.preventDefault();
        setData({ ...data, loading: true, isSubmitting: true });

        try {
            const responseData = await resetPasswordReq({
                token,
                password: data.password,
                cPassword: data.cPassword,
            });

            if (responseData.error) {
                setData({
                    ...data,
                    loading: false,
                    isSubmitting: false,
                    error: responseData.error, // Ensure error messages are strings
                    successMessage: ""
                });
            } else if (responseData.success) {
                setData({
                    ...data,
                    password: "",
                    cPassword: "",
                    loading: false,
                    isSubmitting: false,
                    error: null,
                    successMessage: "Password has been reset successfully. Please login now.",
                    // window.location.href = "/";
                });
            }
        } catch (error) {
            console.error(error);
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
                <div className=" text-2xl mb-6">Reset your password</div>
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
                        <label htmlFor="password">
                            New Password<span className="text-sm text-gray-600 ml-1">*</span>
                        </label>
                        <input
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    error: null,
                                    password: e.target.value,
                                })
                            }
                            value={data.password}
                            type="password"
                            id="password"
                            className={`${data.error?.password ? "border-red-500" : ""} px-4 py-2 focus:outline-none border`}
                        />
                        {data.error?.password && alert(data.error.password, "error")}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="cPassword">
                            Confirm New Password
                            <span className="text-sm text-gray-600 ml-1">*</span>
                        </label>
                        <input
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    error: null,
                                    cPassword: e.target.value,
                                })
                            }
                            value={data.cPassword}
                            type="password"
                            id="cPassword"
                            className={`${data.error?.cPassword ? "border-red-500" : ""} px-4 py-2 focus:outline-none border`}
                        />
                        {data.error?.cPassword && alert(data.error.cPassword, "error")}
                    </div>
                    <button
                        type="submit"
                        disabled={data.isSubmitting}
                        style={{ background: "#303031" }}
                        className="font-medium px-4 py-2 text-white text-center cursor-pointer"
                    >
                        {data.isSubmitting ? "Sending..." : "Reset password"}
                    </button>
                </form>
            </div>
        </Fragment>
    );
};

export default ResetPassword;
