import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Categories, Product } from 'src/app/classes/product';
import { CameraService } from 'src/app/services/camera.service';
import { PopUpsService } from 'src/app/services/popups.service';
import { ProductService } from 'src/app/services/product.service';

export const slideOpts = {
  slidesPerView: 1,
  slidesPerColumn: 1,
  slidesPerGroup: 1,
  watchSlidesProgress: true,
}

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.page.html',
  styleUrls: ['./product-form.page.scss'],
})
export class ProductFormPage implements OnInit, OnDestroy {
  public product: Product = new Product();
  id: string = null;
  public cats = Categories;
  public slideOpts = slideOpts;

  constructor(private productService: ProductService, public alertController: AlertController, private popup: PopUpsService, private activatedRoute: ActivatedRoute, private router: Router, private cameraServ: CameraService) { }

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
    if (form.valid) {
      this.popup.presentLoading();
      if (!this.id) {
        this.productService.add(this.product).then(ans => {
          form.reset();
          this.successfulSubmit("Heads up", "Product registered!", "");
        },
          err => {
            this.failedSubmit("Error", "Product not registered!", err);
          });
      } else {
        this.productService.update(this.product, this.id).then(ans => {
          this.successfulSubmit("Heads up", "Product was updated!", "/tabs/product/" + this.id);
        },
          err => {
            this.failedSubmit("Error", "Product was not updated!", err);
          });
      }
    }
  }

  successfulSubmit(title: string, description: string, navigateTo: string) {
    this.id = null;
    this.popup.presentAlert(title, description);
    setTimeout(() => this.popup.dismissLoading(), 300);
    setTimeout(() => this.router.navigate([navigateTo]), 400);//setTimeout seems to have fixed the weird error with dismissLoading, should try to find a better solution later
  }

  failedSubmit(title: string, description: string, err) {
    console.log(err);
    this.popup.presentAlert(title, description);
    this.popup.dismissLoading();
  }

  async newphoto() {
    if (!this.product.gallery)
      this.product.gallery = [];
    var photo: string;
    await this.cameraServ.alterPhoto().then((returnedPhoto) => {
      photo = returnedPhoto;
      this.product.gallery.push(photo);
      setTimeout(() => this.popup.dismissLoading(), 300);
    });
  }

  async chancephoto(index) {
    var photo: string;
    await this.cameraServ.alterPhoto().then((returnedPhoto) => {
      photo = returnedPhoto;
      this.product.gallery[index] = photo;
      setTimeout(() => this.popup.dismissLoading(), 300);
    });
  }
}