import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  title: string = "Tab1";
  public user: any;
  constructor(private userServ: UserService) { }

  ngOnInit() { }
}
