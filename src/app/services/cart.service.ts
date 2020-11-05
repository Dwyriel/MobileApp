import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private colCart: string = "Cart";

  constructor() { }

  AddItem(productID: string, cart: { productID: string, amount: number }[]) {
    if (cart.length < 1)
      this.AddNewItem(productID, cart);
    else {
      var addNew: boolean = true;
      cart.forEach(item => {
        if (productID == item.productID) {
          item.amount++;
          addNew = false;
          return;
        }
      });
      if (addNew)
        this.AddNewItem(productID, cart);
    }
    return cart;
  }

  private AddNewItem(productID: string, cart: { productID: string, amount: number }[]) {
    var newItem: { productID: string, amount: number } = {
      productID: productID,
      amount: 1
    }
    cart.push(newItem);
    return cart;
  }

  RemoveItem(productID: string, cart: { productID: string, amount: number }[]) {
    for (var i = 0; i < cart.length; i++) {
      if (productID == cart[i].productID) {
        if (cart[i].amount > 1) {
          cart[i].amount--;
          break;
        } else {
          cart.splice(i, 1);
          break;
        }
      }
    }
    return cart;
  }
}
