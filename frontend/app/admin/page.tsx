import AdminPage from "../components/AdminPage";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Udyam Assignment',
  description: 'Admin panel for viewing form submissions',
}

export default function Admin() {
  return <AdminPage />;
}