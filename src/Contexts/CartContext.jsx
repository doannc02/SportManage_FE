import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Lấy từ localStorage khi khởi tạo
        const storedCart = localStorage.getItem("cartItems");
        return storedCart ? JSON.parse(storedCart) : [];
    });

    // Ghi lại vào localStorage mỗi khi cartItems thay đổi
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCartFE = (product) => {
        setCartItems((prevItems) => {
            const index = (prevItems ?? []).findIndex((item) => item.id === product.id);
            if (index !== -1) {
                const updated = [...prevItems];
                updated[index].quantity += 1;
                return updated;
            } else {
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCartFE }}>
            {children}
        </CartContext.Provider>
    );
};
