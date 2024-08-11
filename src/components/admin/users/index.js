import React, { Fragment, createContext } from "react";
import AdminLayout from "../layout";
import UserTable from "./userManagement";

/* This context manage all of the orders component's data */
export const UserContext = createContext();

const UserComponent = () => {
    return (
        <div className="grid grid-cols-1 space-y-4 p-4">
            <UserTable />
        </div>
    );
};

const Users = (props) => {
    return (
        <Fragment>
            <AdminLayout children={<UserComponent />} />
        </Fragment>
    );
};

export default Users;