const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const server = require('http').Server(app);

// create a GET route
app.get('/speedtest/test', (req, res) => {
    console.log(req.body);

    exec('speedtest --format=json', (err, stdout, stderr) => {
        if (err) {
            //some err occurred
            console.error(err)
            res.send({ "error": "There was an error while running the speed test." })
        } else {
            // the *entire* stdout and stderr (buffered)
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            let result = JSON.parse(stdout);
            if (result.type === "result") {
                let downMbps = getMegabitsPerSecond(result.download.bytes, result.download.elapsed);
                let upMbps = getMegabitsPerSecond(result.upload.bytes, result.upload.elapsed);
                let response = {
                    "jitter": result.ping.jitter.toFixed(2),
                    "latency": result.ping.latency.toFixed(2) + " ms",
                    "download": downMbps.toFixed(2) + " Mbps",
                    "upload": upMbps.toFixed(2) + " Mbps",
                    "packet loss": result.packetLoss === undefined ? 0.00 : result.packetLoss.toFixed(2),
                    "isp": result.isp,
                    "server name": result.server.name,
                    "server location": result.server.location
                }
                res.send(response);
            }
            else {
                res.send({ "error": "There was no result from the speed test" });
            }
        }
    });
});

//if production, serve static content
if (process.env.NODE_ENV === 'production') {
    console.log("production");
    app.use('/speedtest', express.static('client/build'));
    const path = require('path');
    app.get('/speedtest', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client/public', 'index.html'))
    });
}

// console.log that your server is up and running
server.listen(port, () => console.log(`Listening on port ${port}`));

function getMegabitsPerSecond(aBytes, aElapsed) {
    let megaBits = aBytes / 125000;
    let seconds = aElapsed / 1000;
    return megaBits / seconds;
}
