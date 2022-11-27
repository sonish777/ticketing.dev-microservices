import { useState } from "react";
import Router from 'next/router';
import useRequest from "../../hooks/use-request";

export default () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { doRequest, errors } = useRequest({
        method: "post",
        body: { email, password },
        url: "/api/users/signin",
        onSuccess: () => Router.push("/")
    });
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        doRequest();
    };
    return (
        <form onSubmit={onSubmitHandler}>
            <h1>Sign In</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input value={email} type="text" className="form-control" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input value={password} type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} />
            </div>
            {errors}
            <button className="btn btn-primary">Sign In</button>
        </form>
    );
};
