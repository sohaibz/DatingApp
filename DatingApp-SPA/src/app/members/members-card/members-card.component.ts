import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/Auth.service';
import { UserService } from 'src/app/_services/User.service';
import { AlertifyService } from 'src/app/_services/Alertify.service';

@Component({
  selector: 'app-members-card',
  templateUrl: './members-card.component.html',
  styleUrls: ['./members-card.component.css'],
})
export class MembersCardComponent implements OnInit {
  @Input() user: User;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {}

  sendLike() {
    this.userService.sendLike(this.authService.getUserId(), this.user.id).subscribe(()=>{
      this.alertify.success('You have liked ' + this.user.knownAs);
    },
    error => {
      this.alertify.error(error);
    });
  }
}
