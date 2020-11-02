import { Address } from './address';
import { Cart } from './cart';

export class User {
    id: string;
    name: string;
    password: string;
    email: string;
    tel: string;
    address: string;
    photo: string;
    active: boolean = true;
    cart: Cart;
}
