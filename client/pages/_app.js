// very critical: the name of the file should be _app.js
import 'bootstrap/dist/css/bootstrap.css';

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

const customApp = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default customApp;
