import { AdminGuard } from "../../components/AuthGuard";

export default function MasterDashboardLayout({ children }) {
  return <AdminGuard>{children}</AdminGuard>;
}
