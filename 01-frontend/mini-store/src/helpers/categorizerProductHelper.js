import { useEffect, useMemo } from "react";
import { fetchProducts } from "../redux/slices/productSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { ASYNC_STATUS } from "../constants/asyncStatus.js";

const CategoryzerProduct = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product?.items || []);
  const error = useSelector((state) => state.product.error);
  const searchTerm = useSelector((state) => state.product?.searchTerm || "");
  const status = useSelector(
    (state) => state.product?.status || ASYNC_STATUS.IDLE
  );

  // We use useEffect to handle asynchronous operations
  useEffect(() => {
    status === ASYNC_STATUS.IDLE && dispatch(fetchProducts());
  }, [dispatch, status]);

  // Handle the action of adding to the cart
  // Filter the products based on the search term
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Organize the products into categories
  const categorizedProducts = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});
  }, [filteredProducts]);

  return {
    categorizedProducts,
    status,
    error,
  };
};

export default CategoryzerProduct 
