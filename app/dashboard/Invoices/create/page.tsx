import Form from '@/app/ui/invoices/create-form'
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import { fetchCustomers } from '@/app/lib/data'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create'
};
export default async function page() {
    const customers = await fetchCustomers()
    return (
        <main>
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Invoices', href: '/dashboard/Invoices' },
            {
              label: 'Create Invoice',
              href: '/dashboard/Invoices/create',
              active: true,
            },
          ]}
        />
        <Form customers={customers} />
      </main>
    )
}
