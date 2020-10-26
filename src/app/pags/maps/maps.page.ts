import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
const { Geolocation } = Plugins;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {
  coords: any;
  address: any;
  constructor(private natGeocoder: NativeGeocoder) { }

  ngOnInit() {
    
  }

  async getLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.coords = coordinates.coords;
  }

  async getAddress() {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    if (!this.coords) {
      await this.getLocation();
    }
    this.natGeocoder.reverseGeocode(this.coords.latitude, this.coords.longitude, options).then((result: NativeGeocoderResult[]) => this.address = result[0]).catch((error: any) => console.log(error));
  }
}
