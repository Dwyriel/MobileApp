import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/classes/user';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.page.html',
  styleUrls: ['./user-form.page.scss'],
})
export class UserFormPage implements OnInit {
  public user: User = new User;
  public confirm: string = "";

  constructor() { }

  ngOnInit() {
  }

  OnClick(){
    console.log(this.confirm);
    console.log(this.user);
    
  }
}
