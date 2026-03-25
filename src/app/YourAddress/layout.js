"use client";

import { CustomerGuard } from "../../components/AuthGuard";

export default function YourAddressLayout({ children }) {
  return <CustomerGuard>{children}</CustomerGuard>;
}
