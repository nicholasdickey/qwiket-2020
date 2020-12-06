import Router from "next/router";
const { pathToRegexp, match, parse, compile } = require("path-to-regexp");
let RouteParts = {
    user: "/user/:username",
    context: "/context",
    feed: "",
    newsline: "",
    home: "/home:tag",
    channel: "/channel/:channel",
    comments: {
        disqus: "/cc/:cc#cc",
        native: "/q/:cqid",
    },
    show: {
        qshow: "/qshow/:qwiketid",
        qview: "/qview/:qwiketid",
    },
    topic: "/topic/:threadid",
    hub: "/hub/:hub",
    tag: "/tag/:tag",
    zoom: "/z/:zoom",
    layout: "/l/:layout",
    solo: "/solo/:soloShortname",
    cpath: "/cpath/:cpath",
    cme: "/cme/:cme",
    navtab: "navtab/:navtab",
};
let QwiketRoutes = [
    [
        "context",
        "channel",
        "hub",
        "tag",
        "zoom",
        `show`,
        "layout",
        "*topic",
        "comments",
    ],
    [
        "user",
        "channel",
        "hub",
        "tag",
        "zoom",
        `show`,
        "layout",
        "*topic",
        "comments",
    ],
    ["feed", "channel", "*home", "zoom", `show`, "layout", "comments"],
    [
        "newsline",
        "channel",
        `solo`,
        "zoom",
        `show`,
        "layout",
        "comments",
        "cpath",
        "cme",
        "navtab",
    ],
];
let names = [];
const refresh = ({ qparams }) => {
    // return null;
    console.log("refresh", { qparams });
    let link = route({ sel: qparams.sel, qparams, nextParams: {} });
    link.href.query.add = Math.random();
    // console.log("changeUserLayout link:", { qparams, link });
    setTimeout(() => Router.replace(link.href, link.as), 400);
};
const qwiketRouter = (server, app) => {
    QwiketRoutes.forEach(route => {
        let sel = route[0];

        let instanceRoute = ({ path, name }) => {
            if (names.indexOf(name) >= 0) {
                return;
            }
            if (!path) return;
            console.log("register:", { name, path, sel });
            names.push(name);
            server.get(path, (req, res) => {
                const actualPage = "/channel";
                const queryParams = { ...req.params, route: name, sel };
                console.log("Instance QwiketRouter ", {
                    name,
                    path,
                    queryParams,
                });
                app.render(req, res, actualPage, queryParams);
            });
        };
        let instancePath = ({
            url,
            level,
            part,
            route,
            partInstance,
            name,
        }) => {
            // first check if the value is optional (no asterisk) and then realize the no value path
            // console.log("instancePath", { name, route, level, partInstance })
            if (part.indexOf("*") != 0) {
                if (level < route.length - 1) {
                    // console.log("skip option recurse", url);
                    recurse({ url, level: level + 1, route, name });
                } else {
                    instanceRoute({ path: url, name });
                }
            } else {
                // console.log("MANDATORY")
                part = part.split("*")[1];
            }
            if (partInstance.indexOf("#") >= 0) {
                partInstance = partInstance.split("#")[0];
            }
            url = `${url}${partInstance}`;
            if (level) {
                // console.log("building name", { name, part })
                name = `${name || sel}-${part}`;
            } else {
                // console.log("LEVEL 0 building name", { part })
                name = `${sel}-${part}`;
            }
            //  console.log("added part:", { url, name, part });
            if (level < route.length - 1) {
                // console.log("recursing", url)
                recurse({ url, level: level + 1, route, name });
            } else {
                instanceRoute({ path: url, name });
            }
        };
        let recurse = ({ url, level, route, name }) => {
            //  console.log("recurse1:", { route, level, url, name })
            let part = route[level];
            let cleanPart = part;
            if (cleanPart.indexOf("*") >= 0)
                cleanPart = cleanPart.split("*")[1];

            let partMeta = RouteParts[cleanPart];
            // console.log("recurse:", { url, level, route, name, part, partMeta })
            if (typeof partMeta === "object") {
                let keys = Object.keys(partMeta);
                for (const key of keys) {
                    const subPart = partMeta[key];

                    //  console.log("partMeta:", { subPart, key })
                    instancePath({
                        url,
                        level,
                        route,
                        part: `${part}-${key}`,
                        partInstance: subPart,
                        name,
                    });
                }
            } else {
                instancePath({
                    url,
                    level,
                    route,
                    part,
                    partInstance: partMeta,
                    name,
                });
            }
        };
        recurse({ url: "", level: 0, route, name: "" });
    });
};
/**
 * Apply actionParams as a filter to qparams - change those included in actionParams, remove if value is null, keep all the others from qparams, add those that are not in qparams
 *
 *
 *
 **/

const route = ({ nextRoute, routeParams, qparams, nextParams, sel }) => {
    let nextOptionals = {};
    let nextQuery;
    let nextAs = "";
    let nextName;

    let page = "/channel";
    let url;
    // if (nextParams.comments)
    //console.log("route:", { nextRoute, routeParams, route: qparams ? qparams.route : '', qparams, nextParams: JSON.stringify(nextParams, null, 4), sel })

    if (!nextRoute) {
        //1. match name parts to qparams and create a bag of optonals: nextOptionals
        //2. remove matching members from nextOptionals if those exist in nextParams. Remove null params from nextParams
        //2. If sel is specified, use it to match the route, otherwise using optionals and nextParams recurse through the route tree matching one or the other to each level.
        //keep track of match nextParams. At the end there should be only one routeName/url produced and all nextParams used, otherwise throw exception.

        //params = {};
        //1
        let nameParts = qparams.route ? qparams.route.split("-") : [];
        //  console.log({ nameParts })
        let nameRecurse = ({ level, nameParts }) => {
            let part = nameParts[level];
            let routePart = RouteParts[part];
            // console.log("nameRecurse", { level, nameParts, part, routePart })
            if (typeof routePart === "object") {
                // console.log("object")
                level++;
                let nextPart = nameParts[level];
                let spec = routePart[nextPart];
                // console.log("parse spec:", { routePart, nextPart, level, nameParts, spec })
                let tokens = parse(spec);
                let vals = [];
                for (const token of tokens) {
                    if (typeof token === "object") {
                        let val = {};
                        val[token.name] = qparams[token.name];
                        // console.log("object push val", { val, name: token.name })
                        vals.push(val);
                    }
                }
                nextOptionals[part] = {};
                nextOptionals[part][nextPart] = vals;
            } else {
                // console.log("string")
                let spec = routePart;
                let tokens = parse(spec);
                // console.log("tokens", tokens)
                let vals = [];
                for (const token of tokens) {
                    //  console.log("token loop", { token })
                    if (typeof token === "object") {
                        //  console.log("token object", token.name)
                        let val = {};
                        val[token.name] = qparams[token.name];
                        nextOptionals[token.name] = qparams[token.name];
                        //  console.log({ val })
                        vals.push(val);
                    }
                }
                // console.log({ vals })
                nextOptionals[part] = vals;
            }
            if (level < nameParts.length - 1)
                nameRecurse({ level: level + 1, nameParts });
        };
        nameRecurse({ level: 0, nameParts });
        // console.log("nextOptionals:", nextOptionals)
        //2
        let nextKeys = Object.keys(nextParams);
        //  console.log({ nextKeys });
        for (const nextKey of nextKeys) {
            delete nextOptionals[nextKey];
            //console.log("DELETING ", nextKey, nextParams[nextKey])
            if (!nextParams[nextKey]) {
                // console.log("DELETING2 ", nextKey)
                delete nextParams[nextKey];
            }
        }
        //3
        let matchedNextParams = [];
        const recurseBuildPath = ({
            level,
            route,
            sel,
            nextAs,
            nextQuery,
            nextName,
        }) => {
            // console.log("recurseBuildPath", { level, route, sel, nextAs, nextQuery, nextName })
            let part = route[level];
            // console.log({ part })
            let mandatory = part.indexOf("*") == 0;
            if (mandatory) part = part.split("*")[1];
            if (level == 0 && sel && sel != part) {
                // console.log("NOT MATCHED TO SEL", { sel, part, level })
                return null;
            }
            if (level == 0) {
                // console.log("MATCHED TO SEL", { part })
                //nextName.push(part)
            }
            let matched;
            //  console.log("matching", nextOptionals)
            if (nextOptionals[part]) {
                //console.log('matched opt:', { part, nextOptionals })
                matched = nextOptionals[part];
            }
            if (nextParams[part]) {
                // console.log('matched next:', { part, nextParams })
                matched = nextParams[part];
                matchedNextParams.push(part);
            }
            if (!matched && mandatory) {
                // console.log("unmatched return", { part, nextOptionals })
                return null;
            }
            let spec = RouteParts[part];
            if (matched) {
                // console.log("MATCHED", { matched, type: (typeof matched) });
                nextName.push(part);
                if (Array.isArray(matched)) {
                    // console.log("matched array", matched)
                    matched.forEach(match => {
                        // console.log({ match })
                        let mks = Object.keys(match);
                        mks.forEach(mk => {
                            nextQuery[mk] = match[mk];
                            // console.log({ nQ1: match[mk], mk, mks })
                        });
                    });
                    nextAs += spec;
                } else {
                    // level++;
                    // let nextPart = route[level];
                    // console.log("nextPart:", nextPart)
                    if (nextOptionals[part]) {
                        // console.log("NEXTOPTIONALS match", nextOptionals[part])
                        matched = nextOptionals[part];
                    }
                    if (nextParams[part]) {
                        // console.log("NEXTPARAMS match", nextParams[part])
                        matched = nextParams[part];
                        matchedNextParams.push(part);
                        //  part = nextPart;
                    }
                    if (!matched) return null;
                    spec = RouteParts[part];
                    //    console.log("matched spec:", { part, spec, matched: JSON.stringify(matched, null, 4) })
                    if (typeof matched === "object")
                        for (const match in matched) {
                            const oldSpec = spec;
                            const oldMatched = matched;
                            //  console.log({ oldSpec, match, oldMatched })
                            matched = matched[match];
                            nextName.push(match);

                            // console.log("matched 222:", { match, matched })
                            //console.log("<<<<", { spec, t: typeof spec, part })

                            spec = spec[match];
                            //   console.log({ spec, matched, match, nextName })
                            matched.forEach(match2 => {
                                //console.log({ match, match2, spec })
                                let mks = Object.keys(match2);
                                mks.forEach(mk => {
                                    // console.log({ mk });
                                    nextQuery[mk] = match2[mk];
                                    // console.log({ nQ2: match2[mk], mk, mks })
                                });
                            });
                        }
                    else {
                        nextQuery[part] = matched;
                    }
                    nextAs += spec;
                }
                //   console.log('---')
            } else if (level == 0) {
                nextName.push(part);
                nextAs += spec;
            }
            if (level < route.length - 1)
                return recurseBuildPath({
                    level: level + 1,
                    route,
                    sel: null,
                    nextQuery,
                    nextAs,
                    nextName,
                });
            else {
                return { nextAs, nextName, nextQuery };
            }
        };
        for (const route of QwiketRoutes) {
            let result = recurseBuildPath({
                level: 0,
                route,
                sel,
                nextAs: "",
                nextQuery: {},
                nextName: [],
            });
            if (result) {
                // console.log("result found", { result });
                nextAs = result.nextAs;
                nextQuery = result.nextQuery;
                nextName = result.nextName;
            }
        }
        // if (nextParams.comments)
        //     console.log("compiling", { nextAs, nextQuery, nextName })
        //    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", { nextAs, nextQuery })
        let toPath = compile(nextAs, { encode: encodeURIComponent });

        url = toPath(nextQuery);
        url = url.replace("#cc", `#${nextQuery.cc}`);
        // if (nextParams.comments)
        //     console.log('==>', { url, nextAs, nextQuery, nextName });
    } else {
        let routeRecurse = ({ route, level, url }) => {
            //console.log()
            let part = route[level];
            let routePart = RouteParts[part];
            //  console.log({ route, level, url, part, routePart })

            if (typeof routePart === "object") {
                level++;
                part = route[level];
                routePart = routePart[part];
                if (!routePart) {
                    throw `Invalid inner route ${route}, level:${level}, url:${url}`;
                }
            }
            if (level < route.length - 1)
                return routeRecurse({
                    route,
                    level: level + 1,
                    url: url + routePart,
                });
            else return url + routePart;
        };
        let route = nextRoute.split("-");
        url = routeRecurse({ route, level: 0, url: "" });
        sel = route[0];
        const toPath = compile(url, { encode: encodeURIComponent });
        //  console.log({ url, routeParams });
        nextQuery = routeParams;
        url = toPath(nextQuery);
        url = url.replace("#cc", `#${nextQuery.cc}`);
        //  console.log("toPath", { url })
        nextName = route;
    }
    let nr = nextName.join("-");
    nextQuery.route = nr;
    nextQuery.sel = sel;
    //console.log("route:", { as: url, nextQuery })
    let ret = {
        href: { pathname: page, query: nextQuery },
        as: url,
    };
    //  console.log('ret', ret);
    return ret;
};

module.exports = { qwiketRouter, route, refresh };
