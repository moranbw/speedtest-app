# speedtest-app
-----
An internet speed test web application leveraging Speedtest-CLI ([https://www.speedtest.net/apps/cli](http://)).
Node.JS service with React frontend using Material-UI.

Example use-case: test "wired speed" of a computer connected via hard-wired ethernet from any device on your network.

### old-fashioned install
-----
**dependencies**
* Latest stable Node.js runtime release with npm
* Git
* Speedtest-CLI

**installation**
* clone repository
    * `git clone https://github.com/moranbw/speedtest-app.git`
* navigate to application
* install server dependencies
    * `npm install'
* install client dependencies
    * `npm install --prefix client`
* build client application
    * `npm run build --prefix client`
* set node environment variable to production
    * linux/mac: `export NODE_ENV=production`
    * windows: `$env:NODE_ENV = 'production'`
    * this could be set permanently using the standard methods
* run application
    * `npm run start`
* application should be running at [http://localhost:5000/speedtest](http://)

### docker install
-----
coming shortly...
