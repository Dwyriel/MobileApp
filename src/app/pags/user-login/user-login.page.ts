import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validator } from 'src/app/classes/validation';
import { PopUpsService } from 'src/app/services/popups.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.page.html',
  styleUrls: ['./user-login.page.scss'],
})
export class UserLoginPage implements OnInit {
  public email: string = "";
  public password: string = "";
  public validator: Validator = new Validator();

  constructor(private userServ: UserService, private popup: PopUpsService, private router: Router) { }

  ngOnInit() {
    this.userServ.auth.user.subscribe(ans => {
      if (ans)
        this.router.navigate(["/"]);
    });
  }

  OnClick(form) {
    this.popup.presentLoading();
    this.userServ.auth.signInWithEmailAndPassword(this.email, this.password).then(ans => {
      this.popup.dismissLoading();
      form.reset();
      setTimeout(() => this.router.navigate(["/tabs/user/" + ans.user.uid]), 300);
    },
      err => {
        this.popup.dismissLoading();
        this.password = "";
        console.log("Error: ", err);
        this.popup.presentAlert("Error", "Email or password invalid");
      });
  }
}
