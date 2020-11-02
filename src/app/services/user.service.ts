import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../classes/user';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Cart } from '../classes/cart';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private colUser: string = "Users";

  constructor(private fireDB: AngularFirestore, public auth: AngularFireAuth) { }

  add(user: User) {
    return this.auth.createUserWithEmailAndPassword(user.email, user.password).then(ans => {
      return this.fireDB.collection(this.colUser).doc(ans.user.uid).set({
        name: user.name,
        email: user.email,
        tel: user.tel,
        active: user.active,
        cart: user.cart
      }).catch(() => {
        this.auth.user.subscribe(ans => ans.delete())
      });
    });
  }

  getAll() {
    return this.fireDB.collection<User>(this.colUser).snapshotChanges()
      .pipe(
        map(
          dados => dados.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data() }))
        )
      )
  }

  get(id: string) {
    return this.fireDB.collection(this.colUser).doc<User>(id).valueChanges();
  }

  update(user: User, id: string) {
    return this.fireDB.collection(this.colUser).doc(id).update(user);
  }

  updatePhoto(id: string, photo: string) {
    return this.fireDB.collection(this.colUser).doc(id).update({ photo: photo });
  }

  addAddress(id: string, address: string) {
    return this.fireDB.collection(this.colUser).doc(id).update({ address: address });
  }

  changeCart(id: string, cart: Cart) {
    return this.fireDB.collection(this.colUser).doc(id).update({ cart: cart });
  }

  delete(id: string) {
    return this.fireDB.collection(this.colUser).doc(id).delete();
  }
}
