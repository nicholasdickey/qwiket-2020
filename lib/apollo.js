import { withApollo } from "next-apollo";
import ApolloClient, { InMemoryCache } from "apollo-boost";
//import { HttpLink } from "apollo-boost";
import getConfig from "next/config";
//const { publicRuntimeConfig } = getConfig();
const uri =
    typeof window !== "undefined"
        ? getConfig().publicRuntimeConfig.GRAPHQL_URL
        : process.env.GRAPHQL_URL;

const DEBUG = true;
console.log("uri=", uri);
/*const config = {
    link: new HttpLink({
        uri, // Server URL (must be absolute)
        includeExtensions: false,
        addTypename: false,
        opts: {
            credentials: "include", // Additional fetch() options like `credentials` or `headers`
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
    }),
}; */
/*const apolloClient = new ApolloClient({
    link: new HttpLink({
        uri, // Server URL (must be absolute)
        includeExtensions: false,
        addTypename: false,
        opts: {
            credentials: "include", // Additional fetch() options like `credentials` or `headers`
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
    }),
    cache: new InMemoryCache(),
});*/
const apolloClient = new ApolloClient({
    uri,
    includeExtensions: false,
    addTypename: false,
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
//console.log("apolloClient", apolloClient);
export default withApollo(apolloClient);
