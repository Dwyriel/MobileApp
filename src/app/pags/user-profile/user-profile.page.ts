import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
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

  constructor(private activatedRoute: ActivatedRoute, private userServ: UserService, private router: Router, private popup: PopUpsService, private camera: Camera) { }

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

  alterPhoto() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,// either FILE_URI or string/base64 (DATA_URL) 
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then(
      (imageData) => {
        this.preview = 'data:image/jpeg;base64,' + imageData;
        this; this.user.photo = this.preview;
      }, (err) => {
        console.log("Camera issue: " + err);
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
