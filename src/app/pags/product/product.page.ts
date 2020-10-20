import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app//classes/product';
import { PopUpsService } from 'src/app/services/popups.service';
import { ProductService } from 'src/app//services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  public id: string = null;
  public product: Product = new Product();
  public prodName: string ="";

  constructor(private activatedRoute: ActivatedRoute, private prodServ: ProductService, private router: Router, private popup: PopUpsService) { }

  ngOnInit() {
    this.popup.presentLoading();
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    if (this.id) {
      {
        this.prodServ.get(this.id).subscribe(ans => { this.product = ans });
        setTimeout(() => {
        this.prodName = this.product.name;//was not assigning anything without the timeout
        //Will leave it here for reference. when deleting an entry errors occur saying that the product.name is undefined, couldn't find a workaround, but it doesn't affect anything other than messages on the console
          this.popup.dismissLoading()
        }, 300);//errors every time without the timeout
      }
    } else {
      this.router.navigate(["/tabs/products/"]);
    }
  }

  clickBuy() {
    console.log('Hello, u just bought this overly expensive item');
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
