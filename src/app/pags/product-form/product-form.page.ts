import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Categories, Product } from 'src/app/classes/product';
import { User } from 'src/app/classes/user';
import { CameraService } from 'src/app/services/camera.service';
import { PopUpsService } from 'src/app/services/popups.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

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
  private user: User = new User();
  id: string = null;
  public cats = Categories;
  public slideOpts = slideOpts;

  constructor(private productService: ProductService, public alertController: AlertController, private popup: PopUpsService,
    private activatedRoute: ActivatedRoute, private router: Router, private cameraServ: CameraService, private UserServ: UserService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.getUser();
  }

  async getUser() {
    await this.UserServ.auth.user.subscribe(ans => {
      if (!ans.uid)
        this.router.navigate(["/login"]);
      this.UserServ.get(ans.uid).subscribe(ans2 => {
        this.user = ans2;
        this.user.id = ans.uid;
        this.getProd();
      });
    });
  }

  async getProd() {
    if (this.id) {
      this.productService.get(this.id).subscribe(prod => {
        this.product = prod
        if (this.user.id != this.product.posterID)
          this.router.navigate(["/"]);
      });
    }
  }

  ngOnDestroy() {
    this.product = new Product();
    this.id = null;
  }

  public OnClick(form) {
    if (form.valid) {
      this.popup.presentLoading();
      this.product.posterID = this.user.id;
      if (!this.id) {
        this.productService.add(this.product).then(ans => {
          form.reset();
          this.successfulSubmit("Heads up", "Product registered!", "/tabs/products");
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
      if (returnedPhoto) {
        photo = returnedPhoto;
        this.product.gallery.push(photo);
      }
      setTimeout(() => this.popup.dismissLoading(), 300);
    });
  }

  async chancephoto(index: number) {
    var photo: string;
    await this.cameraServ.alterProdPhoto().then((returnedPhoto) => {
      if (returnedPhoto) {
        if (returnedPhoto == "Delete") {
          this.product.gallery.splice(index, 1);
        } else {
          photo = returnedPhoto;
          this.product.gallery[index] = photo;
        }
      }
      setTimeout(() => this.popup.dismissLoading(), 300);
    });
  }
}