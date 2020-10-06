import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../classes/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private colUser: string = "Users";

  constructor(private fireDB: AngularFirestore) { }

  add(user: User){
    return this.fireDB.collection<User>(this.colUser).add({
      name: user.name,
      email: user.email,
      password: user.password,
      tel: user.tel,
      active: user.active
    })
  }
}
