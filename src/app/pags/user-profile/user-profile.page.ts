import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { ActionSheetController } from '@ionic/angular';
import { Address } from 'src/app/classes/address';
import { User } from 'src/app/classes/user';
import { AddressService } from 'src/app/services/address.service';
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
  public address: Address = new Address();
  public showOnMap: boolean = false;
  public latitude: any;
  public longitude: any;
  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  }
  constructor(private activatedRoute: ActivatedRoute, private userServ: UserService,
    private router: Router, private popup: PopUpsService, private camera: Camera,
    public actionSheetController: ActionSheetController, private cameraServ: CameraService,
    private natGeocoder: NativeGeocoder, private addressServ: AddressService) { }

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
        if (ans.address)
          this.addressServ.get(ans.address).subscribe(ans2 => this.address = ans2);
        setTimeout(() => this.popup.dismissLoading(), 300);
      })
    }
    await this.userServ.auth.user.subscribe(ans => {
      if (ans) {
        this.userServ.get(ans.uid).subscribe(ans2 => {
          if (!this.id) {
            this.user = ans2;
            if (ans2.address)
              this.addressServ.get(ans2.address).subscribe(ans3 => this.address = ans3);
          }
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
      if (returnedPhoto) {
        this.user.photo = returnedPhoto;
        this.userServ.updatePhoto(this.id, returnedPhoto).then(() => {//this was acting up and refusing to send the photo to the database, tried a bunch of things, went back to this code and it worked. keep and eye out for this
          setTimeout(() => this.popup.dismissLoading(), 300);
        });
      } else
        setTimeout(() => this.popup.dismissLoading(), 300);//not the best way to do it but I don't want to mess with the code above, so i'll leave the else here and repeat the code
    });
  }

  logout() {
    this.popup.presentLoading();
    this.userServ.auth.signOut().then(() => {
      setTimeout(() => this.popup.dismissLoading(), 300);
      this.router.navigate(["/"]);
    });
  }

  async ShowMap() {
    if (!this.showOnMap) {
      var fullAddress = this.address.state + " , " + this.address.city + " , " + this.address.cep + " , " + this.address.street + " , " + this.address.number;
      this.popup.presentLoading();
      await this.natGeocoder.forwardGeocode(fullAddress, this.options).then((ans: NativeGeocoderResult[]) => {
        this.latitude = parseFloat(ans[0].latitude);
        this.longitude = parseFloat(ans[0].longitude);
        setTimeout(() => { this.popup.dismissLoading(); }, 300);
      }).catch((error: any) => console.log(error));
    }
    this.showOnMap = !this.showOnMap;
  }
}
