"use client";

import { CustomerGuard } from "../../components/AuthGuard";

export default function YourOrdersLayout({ children }) {
  return <CustomerGuard>{children}</CustomerGuard>;
}
