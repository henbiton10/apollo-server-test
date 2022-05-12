const { ApolloServer, gql, ApolloError, UserInputError } = require('apollo-server');
const filters = require('postgraphile-plugin-connection-filter')

const typeDefs = gql`
type User {
    id: Int!
    firstName: String!
    lastName: String
    age: Int!
}
type Query {
    getAllUsers(id: Int, firstName: String, lastName: String, age: Int): [User]
    getUserById(id: Int!): User
}
`;

const tempData = [
    {
        id: 1,
        firstName: 'hen',
        lastName: 'bit',
        age: 20
    },
    {
        id: 2,
        firstName: 'aaa',
        lastName: 'aaaa',
        age: 30
    }
];
const resolvers = {
    Query: {
        getAllUsers: (parent, args) => {
            const fields = Object.entries(args).filter(field => field[1]);
            if (!fields.length) {
                return tempData;
            }
            return tempData.filter(user =>
                fields.every(field => user[field[0]] === field[1])
            )
        },
        getUserById: (parent, args) => {
            const { id } = args;
            if (!id) {
                throw new UserInputError('no id inserted')
            };
            return tempData.find(user => user.id === id);
        }
    }
}

const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    csrfPrevention: true,
});

server.listen().then(({ url }) => {
    console.log(url)
})