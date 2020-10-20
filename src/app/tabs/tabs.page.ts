import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  prodAmount: number;
  constructor(private prodServ: ProductService) { }

  ngOnInit() {
    this.prodServ.getAll().subscribe(ans => this.prodAmount = ans.length);
  }

}
