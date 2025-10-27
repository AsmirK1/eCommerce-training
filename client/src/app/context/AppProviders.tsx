"use client";

import React, { ReactNode } from 'react'
import { UserProvider } from "./UserContext";
import { CartProvider } from "./CartContext";

export const AppProviders = ({children}: {children: ReactNode}) =>  {
  return (
    <UserProvider>
        <CartProvider>{children}</CartProvider>
    </UserProvider>
  );
};
