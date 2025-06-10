/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const baseUrl = 'https://js.devexpress.com/Demos/RwaService/api';

const getData = async (url: string) => (await axios.get(`${baseUrl}/${url}`)).data;

export const getContacts = async () => await getData('Users/Contacts');
export const getContact = async (id: any) => await getData(`Users/Contacts/${id}`);


//export const getInvoices = async () => await getData('Users/Invoices');