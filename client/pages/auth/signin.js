import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email,
      password,
    },
    // a callback if the request is successful
    onSuccess: () => {
      // redirects to the landing page (index.js)
      Router.push('/');
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    // calling the function inside the custom hook
    await doRequest();
  };

  return (
    <form onSubmit={onSubmit} className="container">
      <h1>Sign In</h1>
      <div className="form-group mt-2">
        <label className="mb-1">Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group mt-2">
        <label className="mb-1">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
        />
      </div>
      {/**
        calls the JSX of the custom hook
       */}
      {errors}
      <button className="btn btn-primary mt-2">Sign In</button>
    </form>
  );
};

export default signin;
