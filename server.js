const { exec } = require("child_process");
const fs = require("fs");

const polka = require("polka");
const send = require("@polka/send-type");
const { json } = require("body-parser");
const { createProxyMiddleware } = require("http-proxy-middleware");
const sirv = require("sirv");

const app = polka();
const port = 5000;

app.use(function (_req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// create a GET route to test speed
app.get("/ookla/test", (req, res) => {
  console.log(req.body);
  let serverString = "";
  if (req.query.serverId) {
    serverString = " --server-id=" + req.query.serverId;
  }
  console.log(req.query.serverId);
  exec(
    "speedtest --accept-license --format=json" + serverString,
    (err, stdout, stderr) => {
      if (err) {
        //some err occurred
        console.error(err);
        send(res, 500, {
          error: "There was an error while running the speed test.",
        });
      } else {
        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        let result = JSON.parse(stdout);
        if (result.type === "result") {
          let downMbps = getMegabitsPerSecond(
            result.download.bytes,
            result.download.elapsed
          );
          let upMbps = getMegabitsPerSecond(
            result.upload.bytes,
            result.upload.elapsed
          );
          let response = {
            jitter: result.ping.jitter.toFixed(2) + " ms",
            latency: result.ping.latency.toFixed(2) + " ms",
            download: downMbps.toFixed(2) + " Mbps",
            upload: upMbps.toFixed(2) + " Mbps",
            "packet loss":
              result.packetLoss === undefined
                ? "0.00%"
                : result.packetLoss.toFixed(2) + "%",
            isp: result.isp,
            "server name": result.server.name,
            "server location": result.server.location,
          };
          send(res, 200, response);
        } else {
          send(res, 500, { error: "There was no result from the speed test" });
        }
      }
    }
  );
});

// create a GET route to get list of servers
app.get("/ookla/servers", (req, res) => {
  console.log(req.body);
  exec(
    "speedtest --accept-license --format=json --servers",
    (err, stdout, stderr) => {
      if (err) {
        //some err occurred
        console.error(err);
        send(res, 500, {
          error: "There was an error while getting the list of servers.",
        });
      } else {
        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        let result = JSON.parse(stdout);
        if (result.type === "serverList") {
          send(res, 200, result);
        } else {
          send(res, 500, {
            error: "There was no result from the server query",
          });
        }
      }
    }
  );
});

// create a POST route to run iperf3
app.post("/iperf/test", (req, res) => {
  console.log(req.body);
  let host = req.body.host;
  let port = req.body.port;

  exec("iperf3 -J -c " + host + " -p " + port, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      send(res, 500, { error: err });
    } else {
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      let result = JSON.parse(stdout);
      if (result.error) {
        send(res, 500, { error: err });
      } else {
        console.log(stdout);
        let result = JSON.parse(stdout).end;
        let sender = {
          interval:
            result.sum_sent.start.toFixed(2) +
            "-" +
            result.sum_sent.end.toFixed(2) +
            " sec",
          transfer: (result.sum_sent.bytes / 1e6).toFixed(2),
          bandwidth: (result.sum_sent.bits_per_second / 1e6).toFixed(2),
          retransmits: result.sum_sent.retransmits
            ? result.sum_sent.retransmits
            : "",
        };
        let receiver = {
          interval:
            result.sum_received.start.toFixed(2) +
            "-" +
            result.sum_sent.end.toFixed(2) +
            " sec",
          transfer: (result.sum_received.bytes / 1e6).toFixed(2),
          bandwidth: (result.sum_received.bits_per_second / 1e6).toFixed(2),
          retransmits: result.sum_received.retransmits
            ? result.sum_received.retransmits
            : "",
        };
        send(res, 200, {
          sender: sender,
          receiver: receiver,
        });
      }
    }
  });
});

//if built client exists, serve static content
if (fs.existsSync("client/dist/index.html")) {
  console.log("Production: also serving static web content");
  const static = sirv("client/dist");
  app.use(static);
}

//create a proxy to path if defined
if (process.env.PROXY_PATH) {
  const path = process.env.PROXY_PATH;
  app.use(
    createProxyMiddleware(`/${path}`, {
      target: "http://localhost:5000",
      pathRewrite: (aPath, _req) => {
        if (aPath.endsWith(`/${path}`)) {
          console.log(aPath.replace(`/${path}`, "/"));
          return aPath.replace(`/${path}`, "/");
        } else {
          console.log(aPath.replace(`/${path}/`, "/"));
          return aPath.replace(`/${path}/`, "/");
        }
      },
    })
  );
}

//use json for post request -- needs to be used after proxy.
app.use(json());

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

function getMegabitsPerSecond(aBytes, aElapsed) {
  let megaBits = aBytes / 125000;
  let seconds = aElapsed / 1000;
  return megaBits / seconds;
}
