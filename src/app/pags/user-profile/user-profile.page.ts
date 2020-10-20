import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController } from '@ionic/angular';
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
  public preview: string = null;

  constructor(private activatedRoute: ActivatedRoute, private userServ: UserService, private router: Router, private popup: PopUpsService, private camera: Camera, public actionSheetController: ActionSheetController) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.getUser();
  }


  async getUser() {//getting overly complicated, todo divide into multiple methods
    this.popup.presentLoading();
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    if (this.id) {
      this.userServ.get(this.id).subscribe(ans => {
        this.user = ans;
        setTimeout(() => this.popup.dismissLoading(), 300);
      })
    }
    await this.userServ.auth.user.subscribe(ans => {
      if (ans) {
        this.userServ.get(ans.uid).subscribe(ans2 => {
          if (!this.id)
            this.user = ans2;
          this.user.id = ans.uid;
          setTimeout(() => this.popup.dismissLoading(), 300);
        });
      } else if (!this.id && !ans) {
        setTimeout(() => this.popup.dismissLoading(), 300);
        this.router.navigate(["/login"]);
      }
    }, err => {
      setTimeout(() => this.popup.dismissLoading(), 300);
      this.user = null;
      this.router.navigate(["/login"]);
    });
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,// either FILE_URI or string/base64 (DATA_URL) 
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then(
      (imageData) => {
        this.popup.presentLoading();
        this.preview = 'data:image/jpeg;base64,' + imageData;
        this.user.photo = this.preview;
        this.userServ.updatePhoto(this.user.id, this.user.photo).then(() => {
          setTimeout(() => this.popup.dismissLoading(), 300);
        });
      }, (err) => {
        console.log("Camera issue: " + err);
      });
  }

  choosePhoto() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then(
      (imageData) => {
        this.popup.presentLoading();
        this.preview = 'data:image/jpeg;base64,' + imageData;
        this.user.photo = this.preview;
        this.userServ.updatePhoto(this.id, this.user.photo).then(
          () => {
            setTimeout(() => this.popup.dismissLoading(), 300);
          }
        )
      }, (err) => {
        // Handle error
        console.log("Camera issue: " + err);
      }
    );
  }

  async alterPhoto() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Existing or new photo?',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          this.takePhoto()
        }
      }, {
        text: 'Gallery',
        icon: 'image',
        handler: () => {
          this.choosePhoto()
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => { }
      }]
    });
    await actionSheet.present();
  }

  logout() {
    this.popup.presentLoading();
    this.userServ.auth.signOut().then(() => {
      setTimeout(() => this.popup.dismissLoading(), 300);
      this.router.navigate(["/"])
    });
  }
}
