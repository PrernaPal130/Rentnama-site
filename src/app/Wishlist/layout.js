"use client";

import { CustomerGuard } from "../../components/AuthGuard";

export default function WishlistLayout({ children }) {
  return <CustomerGuard>{children}</CustomerGuard>;
}
