import { Component, OnInit } from '@angular/core';
import { promise } from 'protractor';
import { Product } from 'src/app/classes/product';
import { PopUpsService } from 'src/app/services/popups.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {
  public products: Product[] = [];

  constructor(private prodServ: ProductService, private popup: PopUpsService) { }

  ngOnInit() {
    this.load();
  }

  RefreshContent(event) {
    this.load(event);
  }

  load(event?) {
    this.popup.presentLoading();
    this.prodServ.getAll().subscribe(res => {//as a subscription, this does not require an update and it automatically updates. this means that this code is useless.
      this.products = res;
      setTimeout(() => this.popup.dismissLoading(), 200);
      if (event)
        event.target.complete();
    });
  }
}
