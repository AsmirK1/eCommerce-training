"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Product {
    id: number;
    name: string;
    price: number;
    image?: string;
    amount : number;
}

interface CartContextType {
    cart: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<Product[]>([]);

    const addToCart = (product: Product) =>{
        if (cart.length === 0) {
            setCart((prev) => [...prev, product]); 
        }else{
            let findIndex = false;
            cart.forEach((productIndex) => {
                if (productIndex.id === product.id ) {
                    const oldAmount = productIndex.amount ;
                    productIndex.amount = (oldAmount+1);
                    findIndex = true;
                }
            })
            if (findIndex == false) {
                setCart((prev) => [...prev, product]); 
            }
            }
        }
        
    const updateItemAmount = (id:number, newAmount: number)=>{
        setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, amount: Math.max(newAmount, 1) } : item
      )
    );
    }

    const removeFromCart = (id: number) =>
        setCart((prev) => prev.filter((item) => item.id !== id));

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
};
