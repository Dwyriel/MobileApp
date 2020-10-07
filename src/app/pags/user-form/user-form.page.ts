import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/classes/user';
import { Validation } from 'src/app/classes/validation';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.page.html',
  styleUrls: ['./user-form.page.scss'],
})
export class UserFormPage implements OnInit {
  public user: User = new User;
  public confirm: string = "";
  public minlength = 2; //chance later
  public validator: Validation = new Validation();

  constructor(public alertController: AlertController, private userService: UserService) { }

  ngOnInit() {
  }

  OnClick(form) {/*
    console.log(this.validator.isValEmail(this.user.email));
    console.log(this.confirm);
    console.log(this.user);
    console.log(form);*/
    if (form.valid){
      this.userService.add(this.user).then(
        ans=>{
          console.log("Cadastrado!", ans);
          this.presentAlert("Aviso", "Usuario cadastrado!");
        },
        err=>{
          console.error("Erro:", err);
          this.presentAlert("Erro:", "Usuario não cadastrado!");
        }
      )
    }
  }

  async presentAlert(type: string, text: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: type,
      message: text,
      buttons: ['OK']
    });
    await alert.present();
  }
}
