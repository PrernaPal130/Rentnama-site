"use client";

import { CustomerGuard } from "../../components/AuthGuard";

export default function AccountLayout({ children }) {
  return <CustomerGuard>{children}</CustomerGuard>;
}
