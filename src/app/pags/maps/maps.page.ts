import { Component, NgZone, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { PopUpsService } from 'src/app/services/popups.service';
const { Geolocation } = Plugins;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {
  latitude: any;
  longitude: any;
  address: string;
  fromGPS: boolean;
  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  }
  constructor(private natGeocoder: NativeGeocoder, private ngZone: NgZone, private popup: PopUpsService) { }

  ngOnInit() {
    this.getLocation();
  }

  async getLocation() {
    this.popup.presentLoading();
    const coordinates = await Geolocation.getCurrentPosition();
    this.ngZone.run(() => {
      {
        this.latitude = coordinates.coords.latitude;
        this.longitude = coordinates.coords.longitude;
      }
    });
    setTimeout(() => { this.popup.dismissLoading(); }, 300);
    this.fromGPS = true;
  }

  /*async getAddress() {
    if (!this.latitude && !this.longitude) {
      await this.getLocation();
    }
    this.natGeocoder.reverseGeocode(this.latitude, this.longitude, this.options).then((result: NativeGeocoderResult[]) => this.address = result[0]).catch((error: any) => console.log(error));
  }*/

  async getPositionOnMap() {
    console.log(this.address);
    if (!this.address) {
      this.popup.presentAlert("Invalid", "Please enter a valid address.");
      return;
    }
    this.popup.presentLoading();
    await this.natGeocoder.forwardGeocode(this.address, this.options).then((ans: NativeGeocoderResult[]) => {
      this.ngZone.run(() => {
        this.latitude = parseFloat(ans[0].latitude);
        this.longitude = parseFloat(ans[0].longitude);
        setTimeout(() => { this.popup.dismissLoading(); }, 300);
      });
    }).catch((error: any) => console.log(error));
    this.fromGPS = false;
  }
}
