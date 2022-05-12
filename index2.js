const pg = require("pg");
const { ApolloServer } = require("apollo-server");

const { makeSchemaAndPlugin } = require("postgraphile-apollo-server");

const postGraphileOptions = {
    subscriptions: true,
    appendPlugins: [require("@graphile-contrib/pg-simplify-inflector")]
    // dynamicJson: true,
    // etc
};

const dbSchema = "public";

const pgPool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'magen',
    port: 5432,
    password: '123'
});

async function main() {
    // See https://www.graphile.org/postgraphile/usage-schema/ for schema-only usage guidance
    const { schema, plugin } = await makeSchemaAndPlugin(
        pgPool,
        dbSchema,
        postGraphileOptions
    );

    // See https://www.apollographql.com/docs/apollo-server/api/apollo-server.html#ApolloServer
    const server = new ApolloServer({
        schema,
        plugins: [plugin]
    });

    const { url } = await server.listen();
    console.log(`🚀 Server ready at ${url}`);
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});