import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  prodAmount: number;
  constructor(private userServ: UserService) { }

  ngOnInit() {
    this.userServ.auth.user.subscribe(ans => {
      if (ans) {
        this.userServ.get(ans.uid).subscribe(ans2 => {
          this.prodAmount = (ans2.cart) ? ans2.cart.length : 0;
        });
      }
    });
  }

}
