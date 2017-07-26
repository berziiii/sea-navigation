#Insight Studio

## Google Maps Integration - Boat Navigation

### Tooling
-   Node / express
-   Webpack
-   Handlebars
-   Bootstrap

### Install Instructions
Download Zip or Clone.
-   `npm install` to install dependencies.
-   `npm start` will launch Node server with Nodemon incorporated.
-   `gulp watch` will fire Webpack to bundle all Javascript and Styling into one `bundle.js` file
-   `touch env.js` will create a environment javascript file
-   Please the below code into the newly created `env.js` file:

```JS
"use strict";

module.exports = {
  GOOGLE_MAPS_API_KEY: "<% YOUR GOOGLE MAPS API KEY %>",
};
```
