import axios from 'axios';
import { StoredInvoice } from '@/types/invoice.types';

export const api = axios.create({
  baseURL: import.meta.env.DEV 
    ? `${import.meta.env.VITE_DEV_SERVER_BASE_URL}/api`
    : `${import.meta.env.VITE_SERVER_BASE_URL}/api`,
});

export const fetchStudents = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching students:');
  }
};

export const fetchStudentById = async (id: number) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveInvoice = async (invoiceData: StoredInvoice) => {
  try {
    const response = await api.post('/invoices', invoiceData);
    return response.data;
  } catch (error) {
    console.error('Error saving invoice:', error);
    throw new Error('Failed to save invoice');
  }
};

export const deleteInvoice = async (invoiceId: number) => {
  try {
    const response = await api.delete(`/invoices/${invoiceId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw new Error('Failed to delete invoice');
  }
};

export const getLatestInvoiceNumber = async () => {
  try {
    const response = await api.get('/invoices/latest-number');
    return response.data;
  } catch (error) {
    console.error('Error getting latest invoice number:', error);
    throw new Error('Failed to get latest invoice number');
  }
};

export async function getPreviousInvoices(studentId: number): Promise<StoredInvoice[]> {
  try {
    const response = await api.get(`/invoices/student/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw new Error('Failed to fetch invoices');
  }
};

export async function getInvoiceById(invoiceId: number): Promise<StoredInvoice> {
  try {
    const response = await api.get(`/invoices/${invoiceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching invoice:', error);
    throw new Error('Failed to fetch invoice');
  }
};

export default api;

