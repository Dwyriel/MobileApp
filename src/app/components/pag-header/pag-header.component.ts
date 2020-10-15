import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'pag-header',
  templateUrl: './pag-header.component.html',
  styleUrls: ['./pag-header.component.scss'],
})
export class PagHeaderComponent implements OnInit {

  @Input("title") public title: string = "";
  public user: any;
  constructor(public userServ: UserService) { }

  ngOnInit() { this.verfUser(); }

  async verfUser() {
    await this.userServ.auth.user.subscribe(ans => {
      if (ans)
        this.userServ.get(ans.uid).subscribe(ans => {
          this.user = ans;
        });
    },
      err => {
        this.user = null;
      });
  }
}
