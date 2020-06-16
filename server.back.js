// server.js
require("regenerator-runtime");
require("regenerator-runtime/runtime");
require = require("esm")(module /*, options*/);

var favicon = require("serve-favicon");
const next = require("next");
var proxy = require("http-proxy-middleware");
const compression = require("compression");
//const routes = require("./routes")
/*const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");*/
//const { ssrParams, initSession } = require("./qwiket-lib/lib/ssrParams");
const { qwiketRouter } = require("./qwiket-lib/lib/qwiketRouter");
const chalk = require("chalk");
const app = next({ dev: process.env.NODE_ENV !== "production" });
//const handler = routes.getRequestHandler(app)
const handle = app.getRequestHandler();
// With express
const express = require("express");
const server = express();
//const api = require('../../qQL/api-server');
server.use(compression());

const url = "http://" + process.env.QAPI + ":" + process.env.QAPIPORT;
const port = process.env.PORT || 3000;
console.log("API BASE URL:", url);
console.log("PROXY", proxy);
const updateQueryStringParameter = (path, key, value) => {
    const re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    const separator = path.indexOf("?") !== -1 ? "&" : "?";
    if (path.match(re)) {
        return path.replace(re, "$1" + key + "=" + value + "$2");
    } else {
        return path + separator + key + "=" + value;
    }
};
// proxy middleware options
function relayRequestHeaders(proxyReq, req) {
    Object.keys(req.headers).forEach(function (key) {
        proxyReq.setHeader(key, req.headers[key]);
    });
}

function relayResponseHeaders(proxyRes, req, res) {
    Object.keys(proxyRes.headers).forEach(function (key) {
        console.log("relayResponseHeaders", proxyRes.headers[key]);
        res.append(key, proxyRes.headers[key]);
    });
}

var optionsApi = {
    target: url, // target host
    //  logLevel: 'debug',

    onError(err, req, res) {
        console.log("ERROR", { url, err });
        res.writeHead(500, {
            "Content-Type": "text/plain",
        });
        res.end(
            "Something went wrong. And we are reporting a custom error message." +
                err
        );
    },
    pathRewrite: function (path, req) {
        let newPath = path;
        newPath = newPath.replace(/robots.txt/g, "api?task=robots");
        newPath = newPath.replace(/sitemap.txt/, "api?task=sitemap2");

        newPath = newPath.replace(/\bipn\b/, "server/ipn.php?prod=1");
        newPath = newPath.replace(/\bipndev\b/, "server/ipn.php?prod=0");

        if (newPath.indexOf("/sitemaps/") === 0)
            newPath = "/api?task=sitemap&name=req.params.name";
        else if (newPath.indexOf("/dl/") === 0)
            newPath = "/server/dl.php?image=req.params.filename";

        /* if (newPath.indexOf("ssr") < 0) {
            let { host, ip, ua, pxid, anon } = ssrParams(req);

            newPath = updateQueryStringParameter(newPath, "host", host);
            newPath = updateQueryStringParameter(newPath, "xip", ip);
            newPath = updateQueryStringParameter(newPath, "ua", ua);
            newPath = updateQueryStringParameter(newPath, "pxid", pxid);
            newPath = updateQueryStringParameter(newPath, "anon", anon);
            // console.log(chalk.green("PROXY API:"), { url: newPath });
        } else {
            //  console.log(chalk.blue("SSR PROXY API:"), { url: newPath });
        }*/
        return newPath;
    },
};

var loginApi = {
    target: url, // target host
    //  logLevel: 'debug',

    onError(err, req, res) {
        console.log("ERROR", { url, err });
        res.writeHead(500, {
            "Content-Type": "text/plain",
        });
        res.end(
            "Something went wrong. And we are reporting a custom error message." +
                err
        );
    },
    pathRewrite: function (path, req) {
        let newPath = path;
        newPath = newPath.replace(/robots.txt/g, "api?task=robots");
        newPath = newPath.replace(/sitemap.txt/, "api?task=sitemap2");

        newPath = newPath.replace(/\bipn\b/, "server/ipn.php?prod=1");
        newPath = newPath.replace(/\bipndev\b/, "server/ipn.php?prod=0");

        if (newPath.indexOf("/sitemaps/") === 0)
            newPath = "/api?task=sitemap&name=req.params.name";
        else if (newPath.indexOf("/dl/") === 0)
            newPath = "/server/dl.php?image=req.params.filename";

        if (newPath.indexOf("ssr") < 0) {
            let { host, ip, ua, pxid, anon } = ssrParams(req);

            newPath = updateQueryStringParameter(newPath, "host", host);
            newPath = updateQueryStringParameter(newPath, "xip", ip);
            newPath = updateQueryStringParameter(newPath, "ua", ua);
            newPath = updateQueryStringParameter(newPath, "pxid", pxid);
            newPath = updateQueryStringParameter(newPath, "anon", anon);
            // console.log(chalk.green("PROXY API:"), { url: newPath });
        } else {
            //  console.log(chalk.blue("SSR PROXY API:"), { url: newPath });
        }
        return newPath;
    },
};
console.log("call prepare");
app.prepare()
    .then(() => {
        console.log("prepare");

        server.use(express.json()); // to support JSON-encoded bodies
        server.use(express.urlencoded()); // to support URL-encoded bodies

        server.set("trust proxy", "loopback");

        server.use(favicon(__dirname + "/public/img/blue-bell.png"));

        //  server.use(cookieParser());

        var apiProxy = proxy(optionsApi);
        server.use("/robots.txt", apiProxy);
        qwiketRouter(server, app);
        console.log("============================");

        /*  server.post("/update-user-layout", async (req, res) => {
            let { host, ip, ua, pxid, anon } = ssrParams(req);
            let body = req.body;
            let userLayout = body.userLayout;
            console.log(
                chalk.red.bold(
                    "update-user-layout:",
                    JSON.stringify(body, null, 4)
                )
            );
            let u = `${url}/qapi/user/update-user-layout?ua=${ua}&pxid=${pxid}&anon=${anon}&host=${host}&xip=${ip}`;
            let response = await fetch(u, {
                // credentials: 'same-origin',
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `userLayout=${encodeURIComponent(userLayout)}`,
            });
            sres = await response.text();
            // console.log({ sres })
            res.end(sres);
        });
        server.post("/save-newsline-definition", async (req, res) => {
            let { host, ip, ua, pxid, anon } = ssrParams(req);
            let body = req.body;
            let { type, channel, definition } = req.body;

            //   let userLayout = body.userLayout;
            console.log(chalk.red.bold("save-newsline-definition:"));
            let u = `${url}/qapi/newsline/save-newsline-definition?ua=${ua}&pxid=${pxid}&anon=${anon}&host=${host}&xip=${ip}`;
            // let u = `http://dev.qwiket.com:8088/api?task=updateUserLayout&pxid=${pxid}&host=${host}&ip=${ip}&XDEBUG_SESSION_START=vscode`;
            //  console.log(chalk.red.bold("LOGOUT API URL:"), u)
            // console.log(chalk.red.bold("CHANNELL:"), channel, host)
            let response = await fetch(u, {
                // credentials: 'same-origin',
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `type=${type}&channel=${channel}&definition=${encodeURIComponent(
                    definition
                )}`,
            });
            sres = await response.text();
            // console.log({ sres })
            res.end(sres);
        });*/
        server.use("/jsapi/?*", apiProxy);
        server.use("/api/?*", apiProxy);
        server.use("/qapi/?*", apiProxy);
        server.use("/ipn/?*", apiProxy);
        server.use("/ipndev/?*", apiProxy);
        server.use("/sitemap.txt", apiProxy);
        // server.use("/sitemaps/:name/?*", apiProxy);
        server.use("/dl/:filename?*", apiProxy);
        server.use("/cdn", apiProxy);
        server.use("/static/cdn", apiProxy);

        server.use("/upload", apiProxy);

        console.log("!!!");
        let ar = ["/static*", "/_next*", "/_webpack*", "/__webpack_hmr*"];
        console.log("ar=", ar);
        ar.forEach(function (path) {
            console.log("adding next path:", path);
            server.get(path, function (req, res) {
                handle(req, res);
            });
        });
        server.get("/", (req, res) => {
            let { code, appid } = req.query;
            console.log("naked root");
            const actualPage = "/channel";
            const queryParams = {
                route: "default",
                channel: "landing",
                code,
                appid,
            };
            app.render(req, res, actualPage, queryParams);
        });
        server.get("*", (req, res) => {
            // console.log("APP request headers:", req.headers)
            return handle(req, res);
        });
        // console.log("calling server listen")
        server.listen(port, err => {
            if (err) throw err;
            console.log(`> Ready on http://localhost:${port}`);
        });
    })
    .catch(ex => {
        console.error(ex.stack);
        process.exit(1);
    });
