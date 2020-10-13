import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Categories, Product } from 'src/app/classes/product';
import { PopUpsService } from 'src/app/services/popups.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.page.html',
  styleUrls: ['./product-form.page.scss'],
})
export class ProductFormPage implements OnInit, OnDestroy {
  public product: Product = new Product();
  id: string = null;
  cats = Categories;

  constructor(private productService: ProductService, public alertController: AlertController, private popup: PopUpsService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    if (this.id) {
      this.productService.get(this.id).subscribe(prod => { this.product = prod });
    }
  }

  ngOnDestroy() {
    this.product = new Product();
    this.id = null;
  }

  public OnClick(form) {
    console.log(this.product);

    if (form.valid) {
      this.popup.presentLoading();
      if (!this.id) {
        this.productService.add(this.product).then(ans => {
          form.reset();
          this.successSubmit("Heads up", "Product registered!", "");
        },
          err => {
            this.failSubmit("Error", "Product not registered!", err);
          });
      } else {
        this.productService.update(this.product, this.id).then(ans => {
          this.successSubmit("Heads up", "Product was updated!", "/tabs/product/" + this.id);
        },
          err => {
            this.failSubmit("Error", "Product was not updated!", err);
          });
      }
    }
  }

  successSubmit(title: string, description: string, navigateTo: string) {
    this.id = null;
    this.popup.presentAlert(title, description);
    this.popup.dismissLoading();
    setTimeout(() => this.router.navigate([navigateTo]), 300);//setTimeout seems to have fixed the weird error with dismissLoading, should try to find a better solution later
  }

  failSubmit(title: string, description: string, err) {
    console.log(err);
    this.popup.presentAlert(title, description);
    this.popup.dismissLoading();
  }
}