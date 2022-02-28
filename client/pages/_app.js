// very critical: the name of the file should be _app.js
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

/**
 A react component, receives a props object which has two
 properties Component and pageProps. It returns a component with
 with pageProps as its own prop.
 
 Behind the scene whenever we try to navigate to some page in nextJS,
 it will import the component from the pages folder and nextJS doen't 
 directly render components from pages folder, instead it wraps it up 
 inside of its own custom default component. That is refered to as app.
 
 By defining the _app.js in pages folder, we have defined our own custom
 app component and overrides the default app component of nextJS.

 pages
 |- index.js
 |- apple.js
 |- banana.js
 Now, whenever we try to visit <domain>, <domain>/banana, <domain>/apple, etc 
 nextJS will import that given page's component into the below custom 
 component as props.

 The reason behind overriding the default app file is that if we want 
 to include some global CSS into our project (here Bootstrap), we can use
 the _app.js file. As style applied to apple.js will only be applied to
 apple.js file.
 */

const customApp = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

// page components' getInitialProps recevies context === {req, res}
// but app component getInitialProps recevies context === { Component, ctx: {req, res} }

customApp.getInitialProps = async (context) => {
  let pageProps = {};
  try {
    const client = buildClient(context.ctx);

    const { data } = await client.get('/api/users/currentuser');

    // whenever we tie getInitialProps to _app then getInitialProps for pages
    // component do not get called automatically.
    // So we manually invoke the other pages component's getInitialProps here.
    if (context.Component.getInitialProps) {
      pageProps = await context.Component.getInitialProps(context.ctx);
    }

    return { pageProps, ...data };
  } catch (err) {
    // will catch when error is 401 (unauthorized)
    console.log(err.message);
  }
  return { pageProps, currentUser: null };
};

export default customApp;
