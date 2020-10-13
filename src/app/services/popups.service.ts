import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import * as ts from "typescript";

@Injectable({
  providedIn: 'root'
})
export class PopUpsService {

  constructor(private loadingController: LoadingController, private alertController: AlertController) { }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading!',
      backdropDismiss: true
    });
    await loading.present();
  }

  async dismissLoading() {
    await this.loadingController.dismiss();
  }

  async presentAlert(title: string, text: string) {
    const alert = await this.alertController.create({
      header: title,
      message: text,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async confirmationAlert(title: string, description: string) {
    const alert = await this.alertController.create({
      header: title,
      message: description,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            alert.dismiss(false);
            return false;
          }
        }, {
          text: 'OK',
          handler: () => {
            alert.dismiss(true);//this is what actually returns what i want, but without the code below it just doesnt work
            return false;//after some time looking it up, returning false means that the alert wont just "vanish", meaning I can get the date through the dismiss 
          }
        }
      ]
    });
    var returned;
    await alert.present();
    await alert.onDidDismiss().then((data) => { returned = data; });
    return returned.data;
    /*this is the worse code I've ever written, i don't even know how I made it work, took way too many hours just to implement this
    this should be a reminder to not ever do something like this again, and/or look up stuff before commiting to it*/
  }

  //runs the code on a string, terrible way to do it, I hate calling and running things through strings. besides, didn't quite work (or maybe I'm just not good enough to make it work)
  async confirmationAlertCode(title: string, description: string, okCode: string) {
    const alert = await this.alertController.create({
      header: title,
      message: description,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('canceled');
          }
        }, {
          text: 'OK',
          handler: () => {
            var result = ts.transpile(okCode);
            var run = eval(result);
            run.Run().then((result: string) => { console.log(result); });
          }
        }
      ]
    });
    await alert.present();
  }
}
