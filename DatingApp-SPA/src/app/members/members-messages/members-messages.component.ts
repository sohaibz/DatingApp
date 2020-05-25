import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/_services/Auth.service';
import { Message } from 'src/app/_models/message';
import { UserService } from 'src/app/_services/User.service';
import { AlertifyService } from 'src/app/_services/Alertify.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-members-messages',
  templateUrl: './members-messages.component.html',
  styleUrls: ['./members-messages.component.css'],
})
export class MembersMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.userService.getMessagesThread(this.authService.getUserId(), this.recipientId)
      .pipe(
        tap(messages => {
          for(let i=0;i<messages.length;i++) {
            if (messages[i].isRead === false && messages[i].recipientId == this.authService.getUserId()) {
              this.userService.markMessageAsRead(this.authService.getUserId(), messages[i].id);
            }
          }
        })
      )
      .subscribe(messages => {
        this.messages = messages;
      },
      error => {
        this.alertify.error(error);
      }
    );
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.authService.getUserId(), this.newMessage).subscribe((message: Message) => {
      this.messages.unshift(message);
      this.newMessage.content = '';
    }, error => {
      this.alertify.error(error);
    });
  }
}
