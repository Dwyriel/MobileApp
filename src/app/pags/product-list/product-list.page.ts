import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/classes/product';
import { User } from 'src/app/classes/user';
import { PopUpsService } from 'src/app/services/popups.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {
  public products: Product[] = [];
  public user = new User();

  constructor(private prodServ: ProductService, private popup: PopUpsService, private userServ: UserService) { }

  ngOnInit() {
    this.load();
  }

  ionViewWillEnter() {
    this.getUser();
  }

  getUser() {
    this.userServ.auth.user.subscribe(ans => {
      this.user.id = ans ? ans.uid : null;
    });
  }

  RefreshContent(event) {
    this.load(event);
  }

  async load(event?) {
    this.popup.presentLoading();
    await this.prodServ.getAll().subscribe(res => {//as a subscription, this does not require an update and it automatically update. this means that this code is useless.
      this.products = res;
      setTimeout(() => this.popup.dismissLoading(), 300);
      if (event)
        event.target.complete();
    });
  }
}
