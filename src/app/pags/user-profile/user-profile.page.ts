import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  public id: string = null;
  public user: User = new User();

  constructor(private activatedRoute: ActivatedRoute, private userServ: UserService, private router: Router) { }

  ngOnInit() {
    this.user.name = "User";
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    if (this.id) {
      {
        this.userServ.get(this.id).subscribe(res => { this.user = res });
      }
    } else {
      this.router.navigate(["/tabs/users"]);
    }
  }

}
