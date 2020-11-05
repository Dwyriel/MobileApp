import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { send } from 'process';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/classes/product';
import { User } from 'src/app/classes/user';
import { CartService } from 'src/app/services/cart.service';
import { PopUpsService } from 'src/app/services/popups.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  public user: User;
  public products: { product: Product, amount: number }[] = [];
  private prodReceived: boolean = false;

  constructor(private userServ: UserService, private popup: PopUpsService, private router: Router, private prodServ: ProductService, private cartServ: CartService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getUser();
  }

  ionViewWillLeave() {
    this.user = new User();
    this.products = [];
    this.prodReceived = false;
  }

  async getUser() {
    await this.popup.presentLoading();
    await this.userServ.auth.user.subscribe(ans => {
      if (!ans)
        this.router.navigate(["/login"]);
      this.userServ.get(ans.uid).subscribe(ans2 => {
        this.user = ans2;
        this.user.id = ans.uid;
        if (this.user.cart && !this.prodReceived) {
          this.getProducts();
          this.prodReceived = true
          setTimeout(() => this.popup.dismissLoading(), 300);
        }
      });
    });
  }

  DecreaseAmount(id: string) {
    this.cartServ.RemoveItem(id, this.user.cart);
    this.SendChanges(id, false);
  }

  IncreaseAmount(id: string) {
    this.cartServ.AddItem(id, this.user.cart);
    this.SendChanges(id, true);
  }

  async SendChanges(prodID: string, increasing: boolean) {
    await this.userServ.updateCart(this.user.id, this.user.cart).then(ans => {
      this.popup.ShowToast('Itens Changed');
      this.getProducts();
    }, err => {
      if (increasing)
        this.cartServ.RemoveItem(prodID, this.user.cart);
      else
        this.cartServ.AddItem(prodID, this.user.cart);
      this.popup.presentAlert("Oops", "There was a problem adding the item to the cart");
    });
  }

  async getProducts() {
    this.products = [];
    await this.user.cart.forEach(async item => {//for loop didn't quite work, so I'll leave this mess of a code
      await this.prodServ.get(item.productID).subscribe(prod => {
        prod.id = item.productID;
        var item2: { product: Product, amount: number } = { product: prod, amount: item.amount }
        this.products.push(item2);
      });
    });
  }

  FinishPurchase(){
    this.popup.presentAlert("Wheee", "The itens you purchased will be shipped in the next 2534 years");
    //then clear cart etc, etc. 
  }
}
