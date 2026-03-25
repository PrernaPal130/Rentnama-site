"use client";

import { CustomerGuard } from "../../components/AuthGuard";

export default function CartLayout({ children }) {
  return <CustomerGuard>{children}</CustomerGuard>;
}
