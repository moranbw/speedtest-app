# speedtest-app <a href="https://hub.docker.com/r/bwmoran/speedtest-app"><img alt="Docker Pulls" align="right" src="https://img.shields.io/docker/pulls/bwmoran/speedtest-app?style=flat-square"></a>

An internet speed test web application leveraging either Ookla Speedtest-CLI <https://www.speedtest.net/apps/cli> or iperf3 <https://software.es.net/iperf/>.
Node.js service with React frontend using Material-UI.

Example use-case: test "wired speed" of a computer connected via hard-wired ethernet from any device on your network.

### docker install
-----
* `docker run -d -p 5000:5000 --name speedtest-app bwmoran/speedtest-app`
* application should be running at <http://localhost:5000>


### old-fashioned install
-----
**dependencies**
* Latest stable Node.js runtime release with npm
* Git
* Speedtest-CLI <https://www.speedtest.net/apps/cli>
   * **note**: if using Windows, you need to add the directory that contains speedtest.exe to system Path, so that it can be run globally. (for example: `C:\Projects\ookla-speedtest-1.0.0-win64\`)
* iperf3
   * **note**: if using Windows, you need to add the directory that contains iperf3.exe to system Path, so that it can be run globally. (for example: `C:\Projects\iperf-3.1.3-win64\`)

**installation**
* clone repository
    * `git clone https://github.com/moranbw/speedtest-app.git`
* navigate to application directory
* install dependencies and build client
    * `npm run deploy`
* run application
    * `npm run start`
* application should be running at <http://localhost:5000>


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


### other acknowledgements
-----
* "High-Speed Train" emoji logo/favicon is courtesy of the Twitter Emoji (Twemoji) project: <https://github.com/twitter/twemoji>
