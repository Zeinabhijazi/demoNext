'use server'; // All the exported functions within the file as Server Actions.

import { z } from 'zod'; // zod: typescript first validation library
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// Define a schema matches the shape of your form object and validate the formData before saving to the database
const FormSchema = z.object({
    id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce //coerce: change from a string to number
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
})

const CreateInvoice = FormSchema.omit({ id: true, date: true })
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
    errors?: {
      customerId?: string[];
      amount?: string[];
      status?: string[];
    };
    message?: string | null;
  };
  
//  formData - same as before.
//  prevState - contains the state passed from the useActionState hook. You won't be using it in the action in this example, but it's a required prop.  
export async function createInvoice(prevState: State, formData: FormData) {
    // Extract the data from formData with validation 
    const validatedFields = CreateInvoice.safeParse({ //safeParse(): return an object containing either a (success, error)
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
      });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
        };
    }  

    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    // Insert data into the database
    try {
        await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }
    
    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/dashboard/Invoices');
    redirect('/dashboard/Invoices');
}

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
    // Extract the data from formData with validation 
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
      });
    
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
        };
    }    

    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;

    // Insert data into the database
    try{
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
        `;
    }
    catch(error){
        return {
            message: 'Database Error: Failed to Update Invoice'
        }
    }
   
    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/dashboard/Invoices');
    redirect('/dashboard/Invoices');
}

export async function deleteInvoice(id: string) {
    // throw new Error('Failed to Delete Invoice');

    try{
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        // Will trigger a new server request and re-render the table
        revalidatePath('/dashboard/Invoices');
        return { message: 'Deleted Invoice.' };
    }
    catch(error){
        return { message: 'Database Error: Failed to Delete Invoice.' };
    }
    
}


export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
}
/*
  export async function createInvoice(formData: FormData) {
    // Extract the data from formData
    /*
    1- without validation 
    const rawFormData = {
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    };
    // Testing:
    console.log(rawFormData);
    console.log(typeof rawFormData.amount);
   
    // 2- with validation
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    }) ;
    // Storing values in cents
    const amountInCents = amount * 100;
    // Creating new dates (format: YYYY-MM-DD)
    const date = new Date().toISOString().split('T')[0];
    // Insert data to databse:
    try{
        await sql `
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    }
    catch(error){
        return {
            message: 'Database Error: Failed to Create Invoice'
        }
    }
    
    // Revalidate and redirect
    revalidatePath('/dashboard/Invoices'); // once database has been updated, the path revalidated and fresh data will be fetched from the server.
    redirect('/dashboard/Invoices');
}*/