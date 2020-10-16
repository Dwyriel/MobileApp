import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/classes/user';
import { PopUpsService } from 'src/app/services/popups.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  public id: string = null;
  public user: User = new User();

  constructor(private activatedRoute: ActivatedRoute, private userServ: UserService, private router: Router, private popup: PopUpsService) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.getUser();
  }


  async getUser() {
    this.popup.presentLoading();
    await this.userServ.auth.user.subscribe(ans => {
      if (ans) {
        this.id = ans.uid;
        this.userServ.get(this.id).subscribe(ans2 => {
          this.user = ans2;
          setTimeout(() => this.popup.dismissLoading(), 300);
        });
      } else {
        setTimeout(() => this.popup.dismissLoading(), 300);
        this.router.navigate(["/login"]);
      }
    }, err => {
      setTimeout(() => this.popup.dismissLoading(), 300);
      this.user = null;
      this.router.navigate(["/login"]);
    });
  }

  logout() {
    this.popup.presentLoading();
    this.userServ.auth.signOut().then(() => {
      setTimeout(() => this.popup.dismissLoading(), 300);
      this.router.navigate(["/"])
    });
  }
}
