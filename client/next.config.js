// nextJS acts finicky about the file change in docker container
// it sometimes doen't show file change in real time
// therefore we provide a fix here (still not 100% full proof)

// this file loads up by nextJS whenever our project starts up
module.exports = {
  // middleware webpack configuration
  webpackDevMiddleware: (config) => {
    // we are changing the single option on that middleware webpack config
    // to tell webpack that rather than trying to watch for file changes
    // pull all of the code inside the directory every 300 milisecond
    config.watchOptions.poll = 300;
    return config;
  },
};
