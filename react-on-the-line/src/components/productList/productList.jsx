
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
      unitPrice
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
                data?.getAllProducts?.map?.(({ id, name, price, unit, unitPrice, weight }) => {
                    price = weight && unitPrice ? unitPrice*weight : price;
                    return (
                        <li key={id}>
                            <span>
                                <h4>{name}:</h4>
                                <p>Unit Price:&nbsp;${unitPrice}&nbsp;/&nbsp;{unit}</p>
                                {weight ? <p>Weight:&nbsp;{weight}&nbsp;{unit}</p> : null}
                                <p>Total:&nbsp;${price}</p>
                            </span>
                        </li>
                    )
                })
        } 
        </ul>
    );
}

export default ProductList;