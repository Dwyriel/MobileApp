import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Address } from '../classes/address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private colAddress: string = "Addresses";

  constructor(private fireDB: AngularFirestore, public auth: AngularFireAuth) { }

  add(address: Address) {
    return this.fireDB.collection(this.colAddress).add({
      state: address.state,
      city: address.city,
      cep: address.cep,
      street: address.street,
      number: address.number
    });
  }

  get(id: string) {
    return this.fireDB.collection(this.colAddress).doc<Address>(id).valueChanges();
  }

  update(address: Address, id: string) {
    return this.fireDB.collection(this.colAddress).doc(id).update(address);
  }

  delete(id: string) {
    return this.fireDB.collection(this.colAddress).doc(id).delete();
  }
}
