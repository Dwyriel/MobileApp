import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app//classes/product';
import { PopUpsService } from 'src/app/services/popups.service';
import { ProductService } from 'src/app//services/product.service';
import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/services/user.service';
import { CartService } from 'src/app/services/cart.service';

export const slideOpts = {
  slidesPerView: 1,
  slidesPerColumn: 1,
  slidesPerGroup: 1,
  watchSlidesProgress: true,
}

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  public id: string = null;
  public user: User = new User();
  public seller: User = new User();
  public product: Product = new Product();
  public slideOpts = slideOpts;

  constructor(private activatedRoute: ActivatedRoute, private prodServ: ProductService, private router: Router, private popup: PopUpsService,
    private UserServ: UserService, private cartServ: CartService) { }

  ngOnInit() {
    this.popup.presentLoading();
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    if (this.id) {
      {
        this.getProd();
      }
    } else {
      setTimeout(() => { this.popup.dismissLoading() }, 300);
      this.router.navigate(["/tabs/products/"]);
    }
  }

  ionViewWillEnter() {
    this.getUser();
  }

  async getProd() {
    await this.prodServ.get(this.id).subscribe(async ans => {
      this.product = ans;
      await this.UserServ.get(this.product.posterID).subscribe(ans2 => {
        this.seller = ans2;
        this.seller.id = this.product.posterID;
      });
      setTimeout(() => { this.popup.dismissLoading() }, 300);//errors occur every time without the timeout
    });
    //Will leave it here for reference. when deleting an entry errors occur saying that the product.name is undefined, couldn't find a workaround, but it doesn't affect anything other than messages on the console
  }

  async getUser() {
    await this.UserServ.auth.user.subscribe(ans => {
      this.UserServ.get(ans.uid).subscribe(ans2 => {
        this.user = ans2;
        this.user.id = ans.uid;
      });
    });
  }

  async clickBuy() {
    if (!this.user.id) {
      this.router.navigate(["/login"]);
    } else {
      await this.popup.presentLoading();
      if (!this.user.cart)
        this.user.cart = [];
      this.cartServ.AddItem(this.id, this.user.cart);
      await this.UserServ.updateCart(this.user.id, this.user.cart).then(ans => {
        this.popup.ShowToast('Added to cart');
        setTimeout(() => this.popup.dismissLoading(), 300);
      }, err => {
        this.cartServ.RemoveItem(this.id, this.user.cart);
        this.popup.presentAlert("Oops", "There was a problem adding the item to the cart");
        setTimeout(() => this.popup.dismissLoading(), 300);
      });
    }
  }

  EditThisProduct(id) {
    this.router.navigate(["/tabs/productForm/" + id]);
  }

  async DeleteThisProduct(id) {
    await this.popup.confirmationAlert("Confirm!", "Do you really want to delete this product?").then((data) => {
      if (data === true) {
        this.popup.presentLoading();
        this.prodServ.delete(id).then(
          () => {
            setTimeout(() => this.popup.dismissLoading(), 200);
            this.router.navigate(["/tabs/products"]);
          },
          err => {
            this.popup.dismissLoading()
            console.log("Error: ", err);
          }
        )
      }
    });
  }
}
