"use client";

import { CustomerGuard } from "../../components/AuthGuard";

export default function ShoppingCartLayout({ children }) {
  return <CustomerGuard>{children}</CustomerGuard>;
}
