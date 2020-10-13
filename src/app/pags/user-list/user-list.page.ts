import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/classes/user';
import { PopUpsService } from 'src/app/services/popups.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss'],
})
export class UserListPage implements OnInit {
  public users: User[] = [];

  constructor(private userServ: UserService, private router: Router, private popup: PopUpsService, public alertController: AlertController) { }

  ngOnInit() {
    this.load();
  }

  RefreshContent(event) {
    this.load(event);
  }

  load(event?) {
    this.popup.presentLoading();
    this.userServ.getAll().subscribe(res => {
      this.users = res;
      setTimeout(() => this.popup.dismissLoading(), 200);
      if (event)
        event.target.complete();
    });
  }

  async deleteEntry(id) {
    await this.popup.confirmationAlert("Confirm!", "Do you really want to delete this user?").then((data) => {
      if (data === true) {
        this.popup.presentLoading();
        this.userServ.delete(id).then(
          () => {
            setTimeout(() => this.popup.dismissLoading(), 50);
            this.router.navigate([""]);
          },
          err => {
            this.popup.dismissLoading()
            console.log("Error: ", err);
          }
        )
      }
    });
  }

  async deleteEntry2(id) {// I'll leave it here for future reference | ignore this
    var code = '({Run: (data:string): string => {console.log("Hello"); return Promise.resolve("Worked");}})';
    this.popup.confirmationAlertCode("Confirm!", "Do you really want to delete this user?", code);
  }
}
