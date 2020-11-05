import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AlertController, LoadingController } from '@ionic/angular';
import * as ts from "typescript";

@Injectable({
  providedIn: 'root'
})
export class PopUpsService {

  constructor(private loadingController: LoadingController, private alertController: AlertController, private toastctrler: ToastController) { }

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
            alert.dismiss(true);
            return false;//after some time looking it up, returning false means that the alert wont just "vanish", meaning the data can go through the dismiss 
          }
        }
      ]
    });
    var returned;
    await alert.present();
    await alert.onDidDismiss().then((data) => { returned = data; });
    return returned.data;
  }

  //runs the code on a string, terrible way to do it, I hate calling and/or running things through strings. besides, didn't quite work (or maybe I'm just not good enough to make it work)
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

  async ShowToast(text: string, duration?: number) {
    const toast = await this.toastctrler.create({
      message: text,
      color: "tertiary",
      duration: (duration) ? duration : 2000,
      animated: true,
      mode: "ios"
    });
    toast.present();
  }
}
