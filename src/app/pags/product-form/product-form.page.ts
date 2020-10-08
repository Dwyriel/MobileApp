import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { cats, Product } from 'src/app/classes/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.page.html',
  styleUrls: ['./product-form.page.scss'],
})
export class ProductFormPage implements OnInit {
  public product: Product = new Product();
  cats = cats;

  constructor(private productService: ProductService, public alertController: AlertController) { }

  ngOnInit() {
  }

  public OnClick(form) {
    console.log(this.product);

    if (form.valid){
      this.productService.add(this.product).then(
        ans=>{
          console.log("Registrado!", ans);
          this.presentAlert("Aviso", "Produto registrado!");
        },
        err=>{
          console.error("Erro:", err);
          this.presentAlert("Erro:", "Produto não registrado!");
        }
      )
    }
  }

  async presentAlert(type: string, text: string) { //repeating code, might be a good idea to turn into a class (static if posible)
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: type,
      message: text,
      buttons: ['OK']
    });
    await alert.present();
  }

  public OnClick2() {
    console.log(this.product);
  }
}