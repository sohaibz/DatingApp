import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/Alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/User.service';
import { AuthService } from 'src/app/_services/Auth.service';

@Component({
  selector: 'app-members-edit',
  templateUrl: './members-edit.component.html',
  styleUrls: ['./members-edit.component.css']
})
export class MembersEditComponent implements OnInit {
  user: User;
  photoUrl: string;
  @ViewChild('editForm', {static: true})
  editForm: NgForm;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if(this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(private route: ActivatedRoute, private alertify: AlertifyService, private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });

    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  updateUser() {
    
    let userId = this.authService.getUserId();

    this.userService.updateUser(userId, this.user).subscribe(next => {
      this.alertify.success('User Profile Updated');
      this.editForm.reset(this.user);
    }, error => {
      this.alertify.error(error);
    });
  }

}
