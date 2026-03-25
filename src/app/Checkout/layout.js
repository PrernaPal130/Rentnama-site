"use client";

import { CustomerGuard } from "../../components/AuthGuard";

export default function CheckoutLayout({ children }) {
  return <CustomerGuard>{children}</CustomerGuard>;
}
