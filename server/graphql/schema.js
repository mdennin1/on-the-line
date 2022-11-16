import { PrismaClient } from "@prisma/client";
import { gql } from "apollo-server-express"; //"apollo-server";

const prisma = new PrismaClient()
export const resolvers = {
  Mutation: {
    createNewProduct: async (parent, {data}, context) => await prisma.product.create({data})
  },
  Query: {
    getAllPartners: async (parent, args, context, info) => await prisma.partner.findMany(),
    getAllProducts: async (parent, args, context, info) => await prisma.product.findMany(),
    getAllUsers: async (parent, args, context, info) => await prisma.user.findMany(),
    getUserById: async (parent, {userId}, context, info) => await prisma.user.findUnique({where:{id: userId}}),
    getProductsByOwnerId: async (parent, {ownerId}, context, info) => await prisma.product.findMany({where: {owner: {id: {contains: ownerId}}}}),
    getProductsByOwner: async (parent, {name}, context, info) => await prisma.product.findMany({where: {owner: {name: {contains: name}}}})
  }
};
export const typeDefs = gql`
type Address{
    id: ID!
    city: String!
    country: String!
    state: String!
    street: String
    partnerId: String
    type: String!
    userId: String
    zip: String!
}

type Cart{
    id: ID!
    userId: String
}

type Order{
    id: ID!
    orderNumber: Int
    userId: String
}

type Partner{
    id: ID!
    name: String!
    address: [Address]
    description: String
    ein: String
    products: [Product]
}

type Product{
    id: ID!
    name: String
    category: String
    description: String
    minAmount: Int
    ownerId: String
    ownerName: String
    price: Float
    sku: String
    type: String
    unit: String
    weight: Float
}

type User{
    id: ID!
    addresses: [Address]
    cart: Cart
    email: String!
    firstName: String
    lastName: String
    orders: [Order]
    phone: String
    profile: String
    role: String
    username: String
}

input ProductInput {
    name: String!
    category: String!
    description: String
    minAmount: Int
    price: Float!
    type: String
    unit: String
    weight: Float!
}

type Mutation {
    createNewProduct(data: ProductInput!): Product
}


type Query {
    getAllPartners: [Partner!]
    getAllProducts: [Product!]
    getAllUsers: [User!]
    getUserById(userId: String!): User
    getProductsByOwnerId(ownerId: String!): [Product!]
    getProductsByOwner(name: String!): [Product!]
}
`;

export default { resolvers, typeDefs };