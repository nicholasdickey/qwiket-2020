// apollo.js
import { withApollo } from "next-apollo";
import ApolloClient, { InMemoryCache } from "apollo-boost";
import getConfig from "next/config";
const uri =
    typeof window !== "undefined"
        ? getConfig().publicRuntimeConfig.GRAPHQL_URL
        : process.env.GRAPHQL_URL;

const DEBUG = true;
console.log("APOLLO uri=", uri);
const ssrMode = typeof window !== "undefined" ? false : true;
const apolloClient = new ApolloClient({
    uri,
    cache: new InMemoryCache(),
    fetchOptions: {
        credentials: "same-origin",
    },
    fetch: (...pl) => {
        if (!DEBUG) return fetch(...pl);
        const [_, options] = pl;
        const body = JSON.parse(options.body);
        console.log(
            `📡${body.operationName || ""}\n${body.query}`,
            body.variables
        );
        return fetch(...pl);
    },
});

export default withApollo(apolloClient);
