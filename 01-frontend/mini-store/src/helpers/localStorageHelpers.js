// Componentes usadon en cartSlice
export const loadCartFromLocalStorage = () => {
  try {
    const serializedCart = localStorage.getItem("cart");
    return serializedCart ? JSON.parse(serializedCart) : [];
  } catch (error) {
    console.error("Could not load cart from localStorage", error);
    return [];
  }
};

export const saveCartToLocalStorage = (cart) => {
  try {
    const serializedCart = JSON.stringify(cart);
    localStorage.setItem("cart", serializedCart);
  } catch (error) {
    console.error("Could not load cart from localStorage", error);
  }
};

export const updateItems = (items = [], item, quantityChange) => {
  const index = items.findIndex((i) => i.id === item.id);

  if (index >= 0) {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      quantity: updatedItems[index].quantity + quantityChange,
    };
    return updatedItems[index].quantity === 0
      ? updatedItems.filter((i) => i.id !== item.id)
      : updatedItems;
  }
  return [...items, { ...item, quantity: 1 }];
};

// Componentes usados en userSlice
export const saveRefreshToLocalStorage = (refresh) => {
  try {
    localStorage.setItem("refresh", refresh);
  } catch (error) {
    console.error("Could not save refresh from localStorage", error);
  }
};

export const loadRefreshFromLocalStorage = () => {
  try {
    const refreshToken = localStorage.getItem("refresh");
    return refreshToken;
  } catch (error) {
    console.error("Could not load refresh from localStorage", error);
    return null;
  }
};
