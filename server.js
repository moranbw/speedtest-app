const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const port = 5000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const server = require('http').Server(app);

// create a GET route to test speed
app.get('/ookla/test', (req, res) => {
    console.log(req.body);
    let serverString = "";
    if (req.query.serverId) {
        serverString = " --server-id=" + req.query.serverId;
    }
    console.log(req.query.serverId);
    exec('speedtest --accept-license --format=json' + serverString, (err, stdout, stderr) => {
        if (err) {
            //some err occurred
            console.error(err);
            res.status(500).send({ "error": "There was an error while running the speed test." });
        }
        else {
            // the *entire* stdout and stderr (buffered)
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            let result = JSON.parse(stdout);
            if (result.type === "result") {
                let downMbps = getMegabitsPerSecond(result.download.bytes, result.download.elapsed);
                let upMbps = getMegabitsPerSecond(result.upload.bytes, result.upload.elapsed);
                let response = {
                    "jitter": result.ping.jitter.toFixed(2) + " ms",
                    "latency": result.ping.latency.toFixed(2) + " ms",
                    "download": downMbps.toFixed(2) + " Mbps",
                    "upload": upMbps.toFixed(2) + " Mbps",
                    "packet loss": result.packetLoss === undefined ? "0.00%" : result.packetLoss.toFixed(2) + "%",
                    "isp": result.isp,
                    "server name": result.server.name,
                    "server location": result.server.location
                };
                res.send(response);
            }
            else {
                res.status(500).send({ "error": "There was no result from the speed test" });
            }
        }
    });
});

// create a GET route to get list of servers
app.get('/ookla/servers', (req, res) => {
    console.log(req.body);
    exec('speedtest --accept-license --format=json --servers', (err, stdout, stderr) => {
        if (err) {
            //some err occurred
            console.error(err);
            res.status(500).send({ "error": "There was an error while getting the list of servers." });
        }
        else {
            // the *entire* stdout and stderr (buffered)
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            let result = JSON.parse(stdout);
            if (result.type === "serverList") {
                res.send(result)
            }
            else {
                res.status(500).send({ "error": "There was no result from the server query" });
            }
        }

    });
});

// create a POST route to run iperf3
app.post('/iperf/test', (req, res) => {
    console.log(req.body);
    let host = req.body.host;
    let port = req.body.port;

    exec('iperf3 -J -c ' + host + ' -p ' + port, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            res.status(500).send({ "error": err });
        }
        else {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            let result = JSON.parse(stdout);
            if (result.error) {
                res.status(500).send({"error": err});
            }
            else {
                console.log(stdout);
                let result = JSON.parse(stdout).end;
                let sender = {
                    "interval": result.sum_sent.start.toFixed(2) + "-" + result.sum_sent.end.toFixed(2) + " sec",
                    "transfer": (result.sum_sent.bytes / 1e6).toFixed(2),
                    "bandwidth": (result.sum_sent.bits_per_second / 1e6).toFixed(2),
                    "retransmits": result.sum_sent.retransmits ? result.sum_sent.retransmits : ""
                }
                let receiver = {
                    "interval": result.sum_received.start.toFixed(2) + "-" + result.sum_sent.end.toFixed(2) + " sec",
                    "transfer": (result.sum_received.bytes / 1e6).toFixed(2),
                    "bandwidth": (result.sum_received.bits_per_second / 1e6).toFixed(2),
                    "retransmits": result.sum_received.retransmits ? result.sum_received.retransmits : ""
                }
                res.send({
                    "sender": sender,
                    "receiver": receiver
                });
            }
        }
    });
});

//if built client exists, serve static content
if (fs.existsSync("client/build/index.html")) {
    console.log("production");
    app.use(express.static('client/build'));
}

// console.log that your server is up and running
server.listen(port, () => console.log(`Listening on port ${port}`));

function getMegabitsPerSecond(aBytes, aElapsed) {
    let megaBits = aBytes / 125000;
    let seconds = aElapsed / 1000;
    return megaBits / seconds;
}
