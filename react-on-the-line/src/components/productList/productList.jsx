
import React from 'react';
import { useQuery, gql } from '@apollo/client';

//queries
const GET_ALL_PRODUCTS = gql`
query GetAllProducts {
    getAllProducts {
      available
      description
      flavorProfile
      id
      minAmount
      name
      ownerId
      ownerName
      price
      sku
      type
      unit
      weight
    }
  }`

//component
const ProductList = () => {
    const { data, error, loading } = useQuery(GET_ALL_PRODUCTS);
    if(error) return (<>Error: {error.message}</>);
    if(loading) return (<>...Loading</>);
    if(data) console.table(data);
    return (
        <ul>
            {
                data?.getAllProducts?.map?.(({ id, name, price, unit, weight }) => {
                    const total = price*weight;
                    return (
                        <li key={id}>
                            <span>
                                <h4>{name}:</h4>
                                <p>Unit Price:&nbsp;${price}&nbsp;/&nbsp;{unit}</p>
                            </span>
                        </li>
                    )
                })
        } 
        </ul>
    );
}

export default ProductList;