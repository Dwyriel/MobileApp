import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/classes/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {
  public products: Product[] = [];

  constructor(private prodServ: ProductService) { }

  ngOnInit() {
    this.prodServ.getAll().subscribe(res => { this.products = res });
  }

}
