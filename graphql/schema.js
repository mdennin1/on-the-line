import { PrismaClient } from "@prisma/client";
import { gql } from "apollo-server"; //"apollo-server-express";

const prisma = new PrismaClient()
export const resolvers = {
  Mutation: {
    createNewProduct: async (parent, {data}, context) => await prisma.product.create({data})
  },
  Query: {
    getAllPartners: async (parent, args, context, info) => await prisma.partner.findMany(),
    getAllProducts: async (parent, args, context, info) => await prisma.product.findMany(),
    getAllUsers: async (parent, args, context, info) => await prisma.user.findMany(),
    getPartnerById: async (parent, {id}, context, info) => await prisma.partner.findUnique({where: {id}}),
    getProductById: async (parent, {id}, context, info) => await prisma.product.findUnique({where: {id}}),
    getProductsByOwner: async (parent, {name}, context, info) => await prisma.product.findMany({where: {owner: {name: {contains: name}}}}),
    getProductsByOwnerId: async (parent, {ownerId}, context, info) => await prisma.product.findMany({where: {owner: {id: {contains: ownerId}}}}),
    getUserById: async (parent, {id}, context, info) => await prisma.user.findUnique({where: {id}}),
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
    available: Boolean
    category: String
    description: String
    flavorProfile: String
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
    ownerId: ID!
    name: String!
    category: String
    falvorProfile: String
    price: Float!
    type: String
    unit: String!
    weight: Float!
}

type Mutation {
    createNewProduct(data: ProductInput!): Product
}


type Query {
    getAllPartners: [Partner!]
    getAllProducts: [Product!]
    getAllUsers: [User!]
    getPartnerById(id: ID!): Partner
    get ProductById(id: ID!): Product
    getProductsByOwner(name: String!): [Product!]
    getProductsByOwnerId(ownerId: String!): [Product!]
    getUserById(userId: String!): User
}
`;

export default { resolvers, typeDefs };