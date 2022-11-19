
import React from 'react';
import { useQuery, gql } from '@apollo/client';

//queries
const GET_ALL_PRODUCTS = gql`
    query getAllProducts {
        products {
            __typename
            id
            name
            description
            price
            weight
            unit
        }
    }`

//component
const ProductList = () => {
    const { data, error, loading } = useQuery(GET_ALL_PRODUCTS);
    if(error) return (<>Error: {error.message}</>);
    if(loading) return (<>...Loading</>);
    return (
        <ul>
            {
                data?.map(({id, name, price}) => {
                    return (
                        <li key={id}>
                            <span>
                                <h4>{name}:</h4>
                                <p>{price}</p>
                            </span>
                        </li>
                    )
                })
        } 
        </ul>
    );
}

export default ProductList;