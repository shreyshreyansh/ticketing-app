import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in.</h1>
  ) : (
    <h1>You are not signed in.</h1>
  );
};

/**
  Currently we want to show 'You are signed in' on the landing page
  whenever the user is signed in and 'You are not signed in' if the 
  user is not signed in.
  Doing this in nextJS is challenging because the page will entirely 
  be created on Server side, send to the clinet and it will done only 
  once. 
  So, while the page is being prepared for the client we have to call
  the 'api/users/currentuser' to get if the user is logged in or not.
  So, before the page is being rendered on the screen we have to make
  an API call from the server side.
  This can be done by one of the function getInitialProps provided by 
  nextJS. If we decide to inplement this function nextJS will call this
  function while it is attempting to render our app on the server. 
  getInitialProps gives us the opportunity to fetch some data which will
  be needed by LandingPage component.
  Any data we retun on getInitialProps will be provided as a props to
  LandingPage as props.
  Once the initial Landing Page is render on the client browser, we will
  then rely on the the component for data manipulation.
  https://user-images.githubusercontent.com/53744971/155870211-68bfa4ee-69f2-442a-bd9d-1f315c40a8cb.jpg
 */

// we cannot use hooks inside this function as it is a pure function
// and hooks are used in components
// therefore here we use axios instead of our useRequest hook
LandingPage.getInitialProps = async (context) => {
  // here context contains req, which is the request we fire from our browser to nextJS server

  /**
    Using axios.get('/api/users/currentuser') here will result in connect ECONNREFUSED 127.0.0.1:80 error
    because it is being invoked on the server side and not on the client side. Therefore calling
    axios.get('/api/users/currentuser') without the domain, on the client microservice pod will attach 
    127.0.0.1:80 as domain to the request /api/users/currentuser and since the pod has its own world, it
    doen't know how to get to the ingress controller or to the auth microservice as well from 127.0.0.1:80.

    To overcome this error we can follow two approach, configure axios baseURL to direct to the auth service
    (http://auth-srv/api/users/currentuser) [Not a correct option because client has to know all
    the services inside the cluster] or direct to the ingress service.

    One more problem is that as axios is running on the pod, server doesn't care about cookies as it is
    the job of the browser.

    @todo
    1. Reaching ingress from inside client pod
    2. Maintaining the cookie session

    1st Problem
    -----------
    If we wanted our client pod to reach out to the auth pod, it can directly reach through the clusterIP
    of the auth pod using the domain name as http://auth-srv as they are on the same namespace which is
    'default'.
    https://user-images.githubusercontent.com/53744971/155876362-b8f820b3-112d-4822-9d1b-3fdea7f27f77.jpg
    But, the client pod and the Ingress-nginx are on different namespace. So we cannot use 
    http://ingress-nginx. 
    Here to connect to ingress the domain name will be : http://<Name of service>.<Namespace>.svc.cluster.local
    therefore the domain will be http://ingress-nginx-controller.ingress-nginx.svc.cluster.local
    ----NOTE----
    To get namespaces: kubectl get namespace
    To get service name for a particular namespace: kubectl get services -n ingress-nginx
    Plain 'kubectl get services' will give services on default namespace

    If we want to prevent from writting such long domain name we can create an External name service
    that will map http://ingress-nginx-srv to http://ingress-nginx-controller.ingress-nginx.svc.cluster.local

    2nd Problem
    -----------
    We have to pass cookie manually here using axios.
   */

  /**
    We will follow the thumb rule:
    Whenever we send an axios request from a component it is always from client side and we let axios
    perform as it is use to, we will not pass any baseURL or manual cookie. We will let axios do this
    on its own

    Whenever we send an axios request from getInitialProps, it is always from server side for most of
    the time but there are cases where it is called from client side as well. Whenever there is a request
    from server side we have to overwrite the base url and insert cookie manually. So, we have to somehow
    know whether the client is calling the getInitialProps or it is the server.
    The cases:
    https://user-images.githubusercontent.com/53744971/155877152-6f75a820-2106-4173-b626-82ea46373d63.jpg
    
    As we know when we successfully signup we are redirected to the landing page so we are navigating from
    one page to another within the app. This case results in calling getInitialProps of LandingPage inside
    the client's browser and not on the server.

    Solution:
    We can check if we the function is called by server or the client by:
    as window only exists inside the browser this will be undefined for server side
    if(window === undefined) {}
   */

  try {
    const client = buildClient(context);

    const { data } = await client.get('/api/users/currentuser');

    return data;
  } catch (err) {
    // will catch when error is 401 (unauthorized)
    console.log(err.message);
  }
  return { currentUser: null };
};

export default LandingPage;
