import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../classes/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private colUser: string = "Users";

  constructor(private fireDB: AngularFirestore) { }

  add(user: User) {
    return this.fireDB.collection(this.colUser).add({
      name: user.name,
      email: user.email,
      password: user.password,
      tel: user.tel,
      active: user.active
    })
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
}
