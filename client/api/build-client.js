/**
    It is a helper function that takes incoming request (with headers) as input
    and builds an instance of axios that works on current env (server or client)
    and returns that preconfigured version of axios. 
 */

import axios from 'axios';

// here req is the request we fire from our browser to nextJS server
// it has the hostname, cookies attached, etc.
const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server

    // creating preconfigured version of axios
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      // passing the request of (browser --> client server) to (client server to ingress)
      // i.e, hostname, cookies, etc
      headers: req.headers,
    });
  } else {
    // We are on the browser

    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildClient;
