/**
 A custom hook that takes inputs as url (where we want to make request to),
 method ([GET, POST, etc]), body (for [POST, PATCH, PUT]).  
 It returns a function to excute the request and a JSX containing the errors
 after the request was made (if an error occured) 
*/

import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      // reset the errors
      setErrors(null);
      const response = await axios[method](url, body);

      // if the onSuccess callback was provided
      if (onSuccess) onSuccess(response.data);

      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger mt-2" role="alert">
          <h4>Oops...</h4>
          <ul className="my-0">
            {err.response.data.errors.map((error) => (
              <li key={error.message}>{error.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;
