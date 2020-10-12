import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/classes/user';
import { Validation } from 'src/app/classes/validation';
import { PopUpsService } from 'src/app/services/popups.service';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.page.html',
  styleUrls: ['./user-form.page.scss'],
})
export class UserFormPage implements OnInit, OnDestroy {
  public id: string = null;
  public user: User = new User;
  public confirm: string = "";
  public minlength = 2; //todo chance later
  public validator: Validation = new Validation();

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute, private router: Router, private popup: PopUpsService) { }

  ngOnInit() {
    this.validator = new Validation();
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    if (this.id) {
      this.userService.get(this.id).subscribe(data => { this.user = data })
    }
  }

  ngOnDestroy() { // not working the way I intended
    this.user = new User();
    this.id = null;
    this.confirm = "";
  }

  OnClick(form) {
    if (form.valid) {
      this.popup.presentLoading();
      if (!this.id) {
        this.userService.add(this.user).then(
          ans => {
            form.reset();
            this.successSubmit("Heads up", "User was registered!", "");
          },
          err => {
            console.log(err);
            this.popup.presentAlert("Error", "User was not registered!");
            this.popup.dismissLoading();
          }
        );
      } else {
        this.userService.update(this.user, this.id).then(awn => {
          form.reset();
          this.successSubmit("Heads up", "User was updated!", "/tabs/user/" + this.id);
          this.id = null;
          this.user = new User();
        }, err => {
          console.log(err);
          this.popup.presentAlert("Error", "User was not updated!");
          this.popup.dismissLoading();
        });
      }
      //this.popup.dismissLoading(); could not use only one dismiss, was just giving me errors, had to leave multiple dismisses throughout the code
    }
  }

  async successSubmit(title: string, description: string, navigateTo: string) {
    this.popup.presentAlert(title, description);
    await this.popup.dismissLoading(); //await seems to have fixed the weird error
    this.router.navigate([navigateTo]);
  }
}
