import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import fetch from "isomorphic-fetch";
import getConfig from "next/config";
const uri =
    typeof window !== "undefined"
        ? getConfig().publicRuntimeConfig.GRAPHQL_URL
        : process.env.GRAPHQL_SERVER_URL;

export default function createApolloClient(initialState, ctx) {
    // The `ctx` (NextPageContext) will only be present on the server.
    // use it to extract auth headers (ctx.req) or similar.
    console.log("CREATE APOLLO CLIENT ", Boolean(ctx));
    return new ApolloClient({
        ssrMode: Boolean(ctx),
        link: new HttpLink({
            uri, // Server URL (must be absolute)
            credentials: "same-origin", // Additional fetch() options like `credentials` or `headers`
            fetch,
        }),
        cache: new InMemoryCache().restore(initialState),
    });
}
