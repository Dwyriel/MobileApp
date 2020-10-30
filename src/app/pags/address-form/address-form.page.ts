import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Address } from 'src/app/classes/address';
import { AddressService } from 'src/app/services/address.service';
import { PopUpsService } from 'src/app/services/popups.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.page.html',
  styleUrls: ['./address-form.page.scss'],
})
export class AddressFormPage implements OnInit {
  public id: string;
  public userId: string;
  public address: Address = new Address();

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private popup: PopUpsService, private addressServ: AddressService, private userServ: UserService) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.checkIfLogged();
  }

  ionViewWillLeave() {
    this.address = new Address();
    this.id = null;
  }

  async checkIfLogged() {
    await this.userServ.auth.user.subscribe(ans => {
      if (!ans) {
        this.router.navigate(["/tabs/user"]);
      } else if (ans) {
        this.userId = ans.uid;
        if (this.id)
          this.addressServ.get(this.id).subscribe(data => this.address = data);
      }
    });
    console.log(this.userId);
  }

  async OnClick(form) {
    if (form.valid) {
      this.popup.presentLoading();
      if (!this.id) {
        await this.addressServ.add(this.address).then(ans => {
          this.userServ.addAddress(this.userId, ans.id).then(ans => {
            form.reset();
            this.successfulSubmit("Heads up", "Address was registered!", "/tabs/user");
          }, err => {
            this.addressServ.delete(ans.id);
            this.failedSubmit("Error", "Address was not registered!", err);
          });
        }, err => {
          this.failedSubmit("Error", "Address was not registered!", err);
        });
      } else {
        this.addressServ.update(this.address, this.id).then(asn => {
          form.reset();
          this.successfulSubmit("Heads up", "Address was updated!", "/tabs/user");
        }, err => {
          this.failedSubmit("Error", "Address was not updated!", err);
        });
      }
    }
  }

  successfulSubmit(title: string, description: string, navigateTo: string) {
    this.id = null;
    this.address = new Address();
    this.popup.presentAlert(title, description);
    setTimeout(() => this.popup.dismissLoading(), 200);
    setTimeout(() => this.router.navigate([navigateTo]), 300);//setTimeout seems to have fixed the weird error with dismissLoading, should try to find a better solution later
  }

  failedSubmit(title: string, description: string, err) {
    console.log(err);
    this.popup.dismissLoading();
    this.popup.presentAlert(title, description);
  }
}
