import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController } from '@ionic/angular';
import { PopUpsService } from './popups.service';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(private actionSheetController: ActionSheetController, private camera: Camera, private popup: PopUpsService) { }

  async takePhoto() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,// either FILE_URI or string/base64 (DATA_URL) 
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    var photo: string;
    this.popup.presentLoading();
    await this.camera.getPicture(options).then(
      (imageData) => {
        photo = 'data:image/jpeg;base64,' + imageData;
        return photo;
      }, (err) => {
        console.log("Camera issue: " + err);
      });
    return photo;
  }

  async choosePhoto() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    var photo: string;
    this.popup.presentLoading();
    await this.camera.getPicture(options).then(
      (imageData) => {
        photo = 'data:image/jpeg;base64,' + imageData;//gotta set the photo inside the then and then return it, otherwise it doesn't work
        return photo;
      }, (err) => {
        console.log("Camera issue: " + err);
      });
    return photo;
  }

  async alterPhoto() {
    var photoPath;
    const actionSheet = await this.actionSheetController.create({
      header: 'Existing or new photo?',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          actionSheet.dismiss(this.takePhoto());
          return false;
        }
      }, {
        text: 'Gallery',
        icon: 'image',
        handler: () => {
          actionSheet.dismiss(this.choosePhoto());
          return false;
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => { }
      }]
    });
    await actionSheet.present();
    await actionSheet.onDidDismiss().then((data) => { photoPath = data.data });
    return photoPath;
  }
}
