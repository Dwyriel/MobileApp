import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/classes/user';
import { Validator } from 'src/app/classes/validation';
import { PopUpsService } from 'src/app/services/popups.service';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.page.html',
  styleUrls: ['./user-form.page.scss'],
})
export class UserFormPage implements OnInit {
  public id: string = null;
  public user: User = new User;
  public confirm: string = "";
  public minlength = 6; //todo chance later
  public validator: Validator = new Validator();

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute, private router: Router, private popup: PopUpsService) { }

  ngOnInit() {
    this.validator = new Validator();
  }

  ionViewWillEnter() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.checkIfLogged();
  }

  ionViewWillLeave() {
    this.user = new User();
    this.id = null;
    this.confirm = "";
  }

  async checkIfLogged() {
    await this.userService.auth.user.subscribe(ans => {
      if (ans && !this.id) {
        this.router.navigate(["/tabs/user"]);
      } else if (ans.uid == this.id) {//will give me an error but it'll work anyway, if I want to remove the error just nest ifs (validade ans then validade ans.uid==id) or only use the auth.uid
        this.userService.get(this.id).subscribe(data => { this.user = data })
      }
    });
  }

  async OnClick(form) {
    if (form.valid) {
      await this.popup.presentLoading();
      if (!this.id) {
        await this.userService.add(this.user).then(ans => {
          form.reset();
          this.successfulSubmit("Heads up", "User was registered!", "");
        },
          err => {
            this.failedSubmit("Error", "User was not registered!", err);
          });
      } else {
        this.userService.update(this.user, this.id).then(asn => {
          form.reset();
          this.successfulSubmit("Heads up", "User was updated!", "/tabs/user/" + this.id);
        }, err => {
          this.failedSubmit("Error", "User was not updated!", err);
        });
      }
    }
  }

  successfulSubmit(title: string, description: string, navigateTo: string) {
    this.id = null;
    this.user = new User();
    this.popup.presentAlert(title, description);
    setTimeout(() => this.popup.dismissLoading(), 200);
    setTimeout(() => this.router.navigate([navigateTo]), 300);
  }

  failedSubmit(title: string, description: string, err) {
    console.log(err);
    this.popup.presentAlert(title, description);
    setTimeout(() => this.popup.dismissLoading(), 200);
  }
}
