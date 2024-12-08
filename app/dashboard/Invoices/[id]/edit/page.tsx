import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit'
};
export default async function Page({ params }: { params: { id: string } }) {
  // Read the invoice id from page params (prop)
  const id = params.id;
  // Promise.all to fetch both the invoice and customers in parallel
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  // If invoice not exist invoke notFound
  if(!invoice) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/Invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/Invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}