# speedtest-app
-----
An internet speed test web application leveraging Speedtest-CLI ([https://www.speedtest.net/apps/cli](http://)).
Node.JS service with React frontend using Material-UI.

Example use-case: test "wired speed" of a computer connected via hard-wired ethernet from any device on your network.


### docker install
-----
* `docker run -d -p 5000:5000 --name speedtest-app bwmoran/speedtest-app`
* application should be running at [http://localhost:5000/speedtest](http://)


### old-fashioned install
-----
**dependencies**
* Latest stable Node.js runtime release with npm
* Git
* Speedtest-CLI ([https://www.speedtest.net/apps/cli](http://))

**installation**
* clone repository
    * `git clone https://github.com/moranbw/speedtest-app.git`
* navigate to application directory
* install dependencies and build client
    * `npm run deploy`
* run application
    * `npm run start`
* application should be running at [http://localhost:5000/speedtest](http://)


### proxy example
-----
**nginx**
```nginx
location /speedtest {
    proxy_pass http://your_ip_or_host:5000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

