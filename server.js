// server.js
require = require("esm")(module /*, options*/);
require("dotenv").config();
const express = require("express");
const next = require("next");
var proxy = require("http-proxy-middleware");
const compression = require("compression");
var favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const { qwiketRouter } = require("./qwiket-lib/lib/qwiketRouter");
const port = +process.env.PORT;
console.log("PORT:", port);
const url = "http://" + process.env.QAPI + ":" + process.env.QAPIPORT;
const updateQueryStringParameter = (path, key, value) => {
    const re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    const separator = path.indexOf("?") !== -1 ? "&" : "?";
    if (path.match(re)) {
        return path.replace(re, "$1" + key + "=" + value + "$2");
    } else {
        return path + separator + key + "=" + value;
    }
};
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

app.prepare()
    .then(() => {
        const server = express();

        server.set("trust proxy", "loopback");
        server.use(favicon(__dirname + "/public/img/blue-bell.png"));

        server.use(compression());
        server.use(bodyParser.urlencoded({ extended: false }));
        server.use(bodyParser.json());
        var apiProxy = proxy(optionsApi);
        server.use("/robots.txt", apiProxy);
        server.use("/get-session", apiProxy);

        server.use("/jsapi/?*", apiProxy);
        server.use("/api/?*", apiProxy);
        server.use("/qapi/?*", apiProxy);
        server.use("/ipn/?*", apiProxy);
        server.use("/ipndev/?*", apiProxy);
        server.use("/sitemap.txt", apiProxy);
        server.use("/disqus-login/?*", apiProxy);
        // server.use("/sitemaps/:name/?*", apiProxy);
        server.use("/dl/:filename?*", apiProxy);
        server.use("/cdn/*", apiProxy);
        /*  server.use("/cdn/cat", apiProxy);
        server.use("/cdn/x", apiProxy);
        server.use("/static/cdn", apiProxy);*/

        server.use("/upload", apiProxy);

        qwiketRouter(server, app);

        let ar = ["/static*", "/_next*", "/_webpack*", "/__webpack_hmr*"];
        console.log("ar=", ar);
        ar.forEach(function (path) {
            console.log("adding next path:", path);
            server.get(path, function (req, res) {
                handle(req, res);
            });
        });
        server.post("/graphql", async (req, res) => {
            let body = req.body;
            console.log("graphql:", body);
            let u = `${url}/graphql`;
            // let u = `http://dev.qwiket.com:8088/api?task=updateUserLayout&pxid=${pxid}&host=${host}&ip=${ip}&XDEBUG_SESSION_START=vscode`;
            console.log("GRAPH URL:", u);
            // console.log(chalk.red.bold("CHANNELL:"), channel, host)
            let response = await fetch(u, {
                // credentials: 'same-origin',
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            sres = await response.text();
            //  console.log({ sres });
            res.end(sres);
        });
        server.get("/", (req, res) => {
            let { code, appid } = req.query;

            const actualPage = "/index";
            const queryParams = {
                route: "default",
                channel: "landing",
                code,
                appid,
            };
            app.render(req, res, actualPage, queryParams);
        });

        server.all("*", (req, res) => {
            return handle(req, res);
        });
        server.listen(port, err => {
            if (err) throw err;
            console.log(`> Ready on http://localhost:${process.env.PORT}`);
        });
    })
    .catch(ex => {
        console.error(ex.stack);
        process.exit(1);
    });
