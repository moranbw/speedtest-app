# speedtest-app
-----
An internet speed test web application leveraging Speedtest-CLI ([https://www.speedtest.net/apps/cli](http://)).
Node.JS service with React frontend using Material-UI.

Example use-case: test "wired speed" of a computer connected via hard-wired ethernet from any device on your network.


### docker install
-----
* `docker run -d -p 5000:5000 --name speedtest-app bwmoran/speedtest-app`
* application should be running at [http://localhost:5000](http://)


### old-fashioned install
-----
**dependencies**
* Latest stable Node.js runtime release with npm
* Git
* Speedtest-CLI ([https://www.speedtest.net/apps/cli](http://))
   * **note**: if using Windows, you need to add directory that contains speedtest.exe to system Path, so that it can be run globally. (for example: `C:\Projects\ookla-speedtest-1.0.0-win64\`

**installation**
* clone repository
    * `git clone https://github.com/moranbw/speedtest-app.git`
* navigate to application directory
* install dependencies and build client
    * `npm run deploy`
* run application
    * `npm run start`
* application should be running at [http://localhost:5000](http://)


### proxy example
-----
**nginx**
```nginx
location = /speedtest {
    return 302 /speedtest/;
}
location /speedtest/ {
    proxy_pass http://your_ip_or_host:5000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### demo
-----
![Screenshot](https://moran-network-static.s3.amazonaws.com/speedtest_app_capture.gif)


### acknowledgements
-----
* "High-Speed Train" emoji logo/favicon is courtesy of the Twitter Emoji (Twemoji) project: [https://github.com/twitter/twemoji](http://)
