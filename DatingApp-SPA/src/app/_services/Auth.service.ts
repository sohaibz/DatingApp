import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient) {
    if (this.loggedIn()) {
      this.changeMemberPhoto(this.getCurrentUser().photoUrl);
    }
  }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(user.user));
          this.changeMemberPhoto(user.user.photoUrl);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  register(user: User) {
    return this.http.post(this.baseUrl + 'register', user);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  getUsername() {
    if (this.loggedIn()) {
      return this.jwtHelper.decodeToken(localStorage.getItem('token'))
        .unique_name;
    }

    return '';
  }

  getUserId() {
    if (this.loggedIn()) {
      return this.jwtHelper.decodeToken(localStorage.getItem('token')).nameid;
    }

    return '';
  }

  getCurrentUser(): User {
    if (this.loggedIn()) {
      return JSON.parse(localStorage.getItem('user'));
    }

    return null;
  }

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);

    let currentUser: User = this.getCurrentUser();
    currentUser.photoUrl = photoUrl;
    localStorage.setItem('user', JSON.stringify(currentUser));
  }
}
