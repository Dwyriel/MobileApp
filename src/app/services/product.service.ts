import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from '../classes/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private colProduct: string = "Products";

  constructor(private fireDB: AngularFirestore) { }

  add(product: Product){
    return this.fireDB.collection<Product>(this.colProduct).add({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      specs: product.specs,
      stock: product.stock,
    })
  }
}
