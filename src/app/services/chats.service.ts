import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { ProfileUser } from '../models/user-profile';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  constructor(
    private firestore:Firestore,
    private usersService: UsersService
  ) { }

  createChat(otherUser: ProfileUser): Observable<string> {

  }
}
