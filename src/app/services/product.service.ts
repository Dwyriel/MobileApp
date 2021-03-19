import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from '../classes/product';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private colProduct: string = "Products";

  constructor(private fireDB: AngularFirestore) { }

  add(product: Product) {
    return this.fireDB.collection(this.colProduct).add({
      posterID: product.posterID,
      name: product.name,
      price: product.price,
      gallery: product.gallery,
      category: product.category,
      description: product.description,
      specs: product.specs,
      stock: product.stock,
    })
  }

  getAll() {
    return this.fireDB.collection<Product>(this.colProduct).snapshotChanges()
      .pipe(
        map(
          dados => dados.map(d => ({ id: d.payload.doc.id, ...d.payload.doc.data() }))
        )
      )
  }

  get(id: string) {
    return this.fireDB.collection(this.colProduct).doc<Product>(id).valueChanges();
  }

  update(product: Product, id: string) {
    return this.fireDB.collection(this.colProduct).doc(id).update(product);
  }

  delete(id: string) {
    return this.fireDB.collection(this.colProduct).doc(id).delete();
  }
}
