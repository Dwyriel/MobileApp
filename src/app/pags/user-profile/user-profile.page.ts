import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController } from '@ionic/angular';
import { User } from 'src/app/classes/user';
import { CameraService } from 'src/app/services/camera.service';
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

  constructor(private activatedRoute: ActivatedRoute, private userServ: UserService,
    private router: Router, private popup: PopUpsService, private camera: Camera,
    public actionSheetController: ActionSheetController, private cameraServ: CameraService) { }

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

  async alterPhoto() {
    await this.cameraServ.alterPhoto().then((returnedPhoto) => {
      this.user.photo = returnedPhoto;
      console.log(returnedPhoto);
      this.userServ.updatePhoto(this.id, returnedPhoto).then(() => {//this was acting up and refusing to send the photo to the database, tried a bunch of things, went back to this code and it worked. keep and eye out for this
        setTimeout(() => this.popup.dismissLoading(), 300);
      });
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
