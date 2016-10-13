# BlogReworkPro

**[dtysky|一个行者的轨迹](http://dtysky.moe)**  


Rework the [BlogRework](https://github.com/dtysky/BlogRework), a SEO friendly SPA, build with docker, flask, markdown, react, redux, react-router, immutable, gulp, webpack, es6, flow, mongodb...


## Improve

### All

#### Finished

1. Add some new shell scripts and configure files to make development and publishing easier.
2. Access control.  
3. Improve Forever.js for a better guard and logging.

#### Preparing

1. Make docker images for happier publishing.  
2. HTTPS.

### Backend

#### Finished

1. Use tornado wsgi web server to instead of flask's built-in.  
2. Use the virtualenv to build a independent python run-time to instead of system's built-in python.  
3. Improve the error logger.  
4. watchdog.observers.Observer to watchdog.observers.polling.PollingObserver.
5. Memory cache.  

#### Preparing

1. The content in memory cache should be compressed.

### Frontend

#### Finished

1. The best practice for react (react + redux + react-router + Immutable) is here now !  
2. Less is much more niubility than the original Css, it take me fly !  
3. Use the complete ES6, eslint, flow to ensure the code quality.  
4. Callbacks to promise.  
5. No jquery and any others js animation library, pure css3 animation is enough.  
6. MathJax to Katex.  
7. Semantic dom.  
8. Grunt to gulp.  
9. Remake some resources.  
10. Improve the theme.  
11. Pack and compress resources.
12. Server side rendering.
13. Memory cache.

#### Preparing  

None.

## License

Copyright © 2016, 戴天宇, Tianyu Dai (dtysky < dtysky@outlook.com >). All Rights Reserved.
This project is free software and released under the **[GNU General Public License (GPL V3)](http://www.gnu.org/licenses/gpl.html)**.