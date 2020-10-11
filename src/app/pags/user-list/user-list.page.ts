import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss'],
})
export class UserListPage implements OnInit {
  public users: User[] = [];

  constructor(private userServ: UserService) { }

  ngOnInit() {
    this.userServ.getAll().subscribe(res => { this.users = res });
  }

}
