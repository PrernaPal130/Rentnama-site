"use client";

import { VendorGuard } from "../../components/AuthGuard";

export default function VendorDashboardLayout({ children }) {
  return <VendorGuard>{children}</VendorGuard>;
}
