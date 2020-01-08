const { GraphQLServer } = require('graphql-yoga')

let links = [{
    id: "link-0",
    url: "http://www.test.com",
    description: "Foobar"
}]

let idCount = links.length

const resolvers = {
    Query: {
        info: () => "This is some info",
        feed: () => links,
        link: (parent, { id }) => links.find(link => link.id === id)
    },

    Mutation: {
        post: (parent, { url, description }) => {
            const link = {
                id: `link-${idCount++}`,
                description,
                url
            }
            links.push(link)

            return link
        },
        updateLink: (parent, { id, url, description }) => {
            const item = { id, url, description }
            const index = links.findIndex(i => i.id === item.id);
            if (index === -1) return
            links[index] = item
            return links[index]
        },
        deleteLink: (parent, { id }) => {
            const index = links.findIndex(i => i.id === id)
            const linkToRemove = links[index];
            const [removedLink] = links.splice(index, 1)
            return removedLink;
        }
    },
}

const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers,
})

server.start(() => console.log(`Server is running on http://localhost:4000`))