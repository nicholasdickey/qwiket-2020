// server.js
require = require("esm")(module /*, options*/ );
require("dotenv").config();
const express = require("express");
var crypto = require("crypto");

var generate_key = function() {
    // 16 bytes is likely to be more than enough,
    // but you may tweak it to your needs
    return crypto.randomBytes(16).toString("base64");
};
//const { session } = require("next-session");
//const session = require("express-session");
var cookieSession = require("cookie-session");
const next = require("next");
const { createProxyMiddleware } = require("http-proxy-middleware");
const compression = require("compression");
var favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const { qwiketRouter } = require("./qwiket-lib/lib/qwiketRouter");
const requestParams = require("./requestParams");
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
    changeOrigin: true, // for vhosted sites, changes host header to match to target's host
    logLevel: "debug",
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
    pathRewrite: function(path, req) {
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
let apiProxy = createProxyMiddleware(optionsApi);
app.prepare()
    .then(() => {
        const server = express();
        var sess = {
            secret: "asdasfgeet",
            sameSite: "none",
            cookie: {
                maxAge: 365 * 24 * 3600 * 1000,
            },
        };

        /*   if (process.env.NODE_ENV === "production") {
            server.set("trust proxy", 1); // trust first proxy
            sess.cookie.secure = true; // serve secure cookies
        }*/
        server.use(
            cookieSession({
                name: "qsession",
                /* keys: [
                ], */
                secret: "dioczxowowooob",

                // Cookie Options
                maxAge: 24 * 60 * 60 * 1000 * 365, // 24 hours
            })
        );
        // server.use(session(sess));
        server.set("trust proxy", "loopback");
        server.use(favicon(__dirname + "/public/img/blue-bell.png"));
        // server.use("graphql", apiProxy);

        server.use(compression());
        server.use(bodyParser.urlencoded({ extended: false }));
        server.use(bodyParser.json());
        server.use("/robots.txt", apiProxy);
        server.use("/get-session", apiProxy);

        server.use("/jsapi/?*", apiProxy);
        server.use("/api/?*", apiProxy);
        server.use("/qapi/?*", apiProxy);
        server.use("/ipn/?*", apiProxy);
        server.use("/ipndev/?*", apiProxy);
        server.use("/sitemap.txt", apiProxy);
        //  server.use("/disqus-login/?*", apiProxy);
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
        ar.forEach(function(path) {
            console.log("adding next path:", path);
            server.get(path, function(req, res) {
                handle(req, res);
            });
        });
        server.use("/disqus-callback", async(req, res) => {
            var parts = req.url.split("?");
            var query = parts[1] || "";

            let s = requestParams(req);
            let u = `${url}/disqus-callback?${query}&${s}`;
            console.log("calling fetch /disqus-callback", u);
            let response = await fetch(u, {
                // credentials: 'same-origin',
                method: "GET",
                credentials: "include",
            });
            let json = await response.json();
            console.log("DISQUS callback", JSON.stringify(json));
            //  l(chalk.yellow(JSON.stringify({ session: req.session })));

            if (json.success) {
                const redirect = json.loginRedirect;
                console.log("REDIRECTING:");
                return res.redirect(redirect);
            } else {
                return res.status(500).json(json);
            }
        });
        server.use("/disqus-login", async(req, res) => {
            let s = requestParams(req);
            let u = `${url}/disqus-login?${s}`;
            console.log("calling fetch", u);
            let response = await fetch(u, {
                // credentials: 'same-origin',
                method: "GET",
                credentials: "include",
            });
            let json = await response.json();
            console.log("DISQUS-LOGIN", json);
            console.log(JSON.stringify({ json }));

            if (json.success) {
                console.log("success");
                const redirect = json.redirect;
                return res.redirect(redirect);
            } else {
                return res.status(500).json(json);
            }
        });
        server.post("/graphql", async(req, res) => {
            let body = req.body;
            let sessionID = req.session.id;
            if (!sessionID) {
                sessionID = generate_key();
                req.session.id = sessionID;
            }
            console.log("sessionID:", req.session.sessionID, req.session.id);
            console.log("graphql:", body);
            let s = requestParams(req);
            let u = `${url}/graphql?${s}`;
            // let u = `http://dev.qwiket.com:8088/api?task=updateUserLayout&pxid=${pxid}&host=${host}&ip=${ip}&XDEBUG_SESSION_START=vscode`;
            console.log("GRAPH URL:", u);
            // console.log(chalk.red.bold("CHANNELL:"), channel, host)
            let sres;
            try {
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
            } catch (x) {
                console.log("server graphql call failed", u)
            }
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
            console.log(process.env)
        });
    })
    .catch(ex => {
        console.error(ex.stack);
        process.exit(1);
    });