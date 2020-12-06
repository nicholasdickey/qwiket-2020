import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import fetch from "isomorphic-fetch";
import getConfig from "next/config";
import requestParams from "./requestParams";
var crypto = require("crypto");

var generate_key = function () {
    // 16 bytes is likely to be more than enough,
    // but you may tweak it to your needs
    return crypto.randomBytes(16).toString("base64");
};
const uri =
    typeof window !== "undefined"
        ? getConfig().publicRuntimeConfig.GRAPHQL_URL
        : process.env.GRAPHQL_SERVER_URL;

export default function createApolloClient(initialState, ctx) {
    // The `ctx` (NextPageContext) will only be present on the server.
    // use it to extract auth headers (ctx.req) or similar.
    if (ctx) {
        let req = ctx.req;
        let sessionID = req.session.id;
        if (!sessionID) {
            sessionID = generate_key();
            req.session.id = sessionID;
        }
    }
    let u = ctx ? `${uri}?${requestParams(ctx.req)}` : uri;
    /* console.log(
        "========================================================================================="
    );*/
    console.log("CREATE APOLLO CLIENT ", Boolean(ctx), u);
    return new ApolloClient({
        ssrMode: Boolean(ctx),
        link: new HttpLink({
            uri: u, // Server URL (must be absolute)
            credentials: "include", // Additional fetch() options like `credentials` or `headers`
            // fetch,
        }),
        cache: new InMemoryCache().restore(initialState),
    });
}
