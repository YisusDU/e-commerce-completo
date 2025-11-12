import React from "react";
import CategoryzerProduct from "../../helpers/categorizerProductHelper.js";
import { ASYNC_STATUS } from "../../constants/asyncStatus.js";
import ProductCard from "../ProductCard/index.js";

import {
  StoreContainer,
  ProductsArray,
  LoadingOrError,
  CategorySection,
  ProductNotFound,
} from "./styled.js";

const ProductList = () => {
  const { categorizedProducts, status, error } = CategoryzerProduct();

  const formatCategoryName = (category) => {
    return category
      .split("'")
      .join("")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  
  return (
    <StoreContainer>
      <ProductsArray>
        {status === ASYNC_STATUS.FULFILLED &&
        Object.entries(categorizedProducts).length > 0
          ? Object.entries(categorizedProducts).map(([category, products]) => (
              <CategorySection key={category}>
                <h2>{formatCategoryName(category)}</h2>
                <div className="products-grid">
                  {products.map((product) => (
                    // We import the cards of products
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </CategorySection>
            ))
          : status === ASYNC_STATUS.FULFILLED && (
              <ProductNotFound>
                <h2>No products found with that search term 😕</h2>
              </ProductNotFound>
            )}
        {status === ASYNC_STATUS.PENDING && (
          <LoadingOrError>
            <h2>Loading... 🥱</h2>
          </LoadingOrError>
        )}
        {status === ASYNC_STATUS.REJECTED && (
          <LoadingOrError>
            <h2>There was an error loading the products. 😖</h2>
            <p>Error: {error} </p>
          </LoadingOrError>
        )}
      </ProductsArray>
    </StoreContainer>
  );
};

export default ProductList;
