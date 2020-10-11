import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../classes/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  public id: string = null;
  public product: Product = new Product();

  constructor(private activatedRoute: ActivatedRoute, private prodServ: ProductService) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    if (this.id) {
      {
        this.prodServ.get(this.id).subscribe(res => { this.product = res });
      }
    }
  }

  clickBuy(){
    console.log('Hello');
  }

}
