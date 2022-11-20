import { PrismaClient } from "@prisma/client";
import { gql } from "apollo-server"; //"apollo-server-express";

const prisma = new PrismaClient()
export const resolvers = {
  Mutation: {
    createNewPartner: async (parent, {partner, address, products, charity}, context, info) => {
        let newPartner;
        if(products){
            newPartner = await prisma.partner.create({data: {...partner, address: {create: {data: address}}, products: {createMany: products}}, include: {address: true, products: true}});
        }else{
            newPartner = await prisma.partner.create({data: {...partner, address: {create: {data: address}}}, include: {address: true}});
        }
        if(charity){
            const charity = await prisma.charity.create({data: {...charity}});
            const partnerCharity = await prisma.partnerCharity.create({data: {partner: {connect: {id: partner.id}}, charity: {connect: {id: charity.id}}}});
        }
        return newPartner;
    },
    createNewProduct: async (parent, {product, ownerId}, context, info) => await prisma.product.create({data: {...product, owner: {connect: {id: ownerId}}}}),
    updateProduct: async (parent, {product, id}, context, info) => await prisma.product.update({where: {id}, data: product}),
  },
  Query: {
    getAllPartners: async (parent, args, context, info) => await prisma.partner.findMany(),
    getAllProducts: async (parent, args, context, info) => await prisma.product.findMany(),
    getAllUsers: async (parent, args, context, info) => await prisma.user.findMany(),
    getPartnerById: async (parent, {id}, context, info) => await prisma.partner.findUnique({where: {id}}),
    getProductById: async (parent, {id}, context, info) => await prisma.product.findUnique({where: {id}}),
    getProductsByOwner: async (parent, {name}, context, info) => await prisma.product.findMany({where: {owner: {name: {contains: name}}}}),
    getProductsByOwnerId: async (parent, {ownerId}, context, info) => await prisma.product.findMany({where: {owner: {id: {contains: ownerId}}}}),
    getProductsByType: async (parent, {type}, context, info) => await prisma.product.findMany({where: {type}}),
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

input AddressInput {
    city: String!
    latitude: String
    longitude: String
    state: String!
    street: String!
    type: String!
    zip: String!
}

type Cart{
    id: ID!
    userId: String
}

type Charity {
    id: ID!
    name: String!
    bankName: String
    description: String
    ein: String
    email: String
    paymentAccountNumber: String!
    paymentAccountType: String!
    paymentRoutingNumber: String
    url: String
}

input CharityInput {
    name: String!
    bankName: String
    description: String
    ein: String
    email: String!
    paymentAccountNumber: String!
    paymentAccountType: String!
    paymentRoutingNumber: String
    phone: String
    url: String
}

type Order{
    id: ID!
    orderNumber: Int
    userId: String
}

type Partner {
    id: ID!
    name: String!
    address: [Address]
    bankName: String
    description: String
    ein: String
    email: String
    paymentAccountNumber: String!
    paymentAccountType: String!
    paymentRoutingNumber: String
    phone: String
    products: [Product]
    url: String
}

input PartnerInput {
    name: String!
    bankName: String
    description: String
    ein: String
    email: String
    paymentAccountNumber: String!
    paymentAccountType: String!
    paymentRoutingNumber: String
    phone: String
    url: String
}

type Product{
    id: ID!
    name: String
    available: Boolean
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

input ProductInput {
    name: String!
    available: Boolean
    description: String
    flavorProfile: String
    minAmount: Int
    price: Float!
    sku: String
    type: String!
    unit: String!
    weight: Float!
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

type Mutation {
    createNewPartner(partner: PartnerInput!, address: AddressInput!, products: [ProductInput], charity: CharityInput!): Partner
    createNewProduct(product: ProductInput!, ownerId: ID!): Product
    updateProduct(product: ProductInput!, id: ID!): Product
}


type Query {
    getAllPartners: [Partner!]
    getAllProducts: [Product!]
    getAllUsers: [User!]
    getPartnerById(id: ID!): Partner
    getProductById(id: ID!): Product
    getProductsByOwner(name: String!): [Product!]
    getProductsByOwnerId(ownerId: String!): [Product!]
    getProductsByType(type: String!): [Product]
    getUserById(userId: String!): User
}
`;

export default { resolvers, typeDefs };