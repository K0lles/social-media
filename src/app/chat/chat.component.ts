import {AfterViewInit, Component, ElementRef, Injectable, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ChatInfo, ChatService, Message} from "../services/chat.service";
import {AuthService} from "../services/auth.service";
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {forkJoin, Observable, of} from "rxjs";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {
  messageForm: FormGroup;
  messageList: Message[] = [];
  chat: ChatInfo;

  @ViewChild("messagesContainer") private messagesContainer: ElementRef | undefined;

  constructor(
    private fb: FormBuilder,
    private chatService: ChatService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {
    this.messageForm = this.fb.group({
      message: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit() {
    // let chatId: string | number | null = this.route.snapshot.paramMap.get('chatId');
    // if (chatId) {
    //   this.chatService.getChatInfo(chatId).subscribe(
    //     (response) => {
    //       this.chat = response
    //     }
    //   );
    //   this.chatService.getMessageList(chatId).subscribe((response) => {
    //     this.messageList = response;
    //   });
    // }
    let resolvedData = this.route.snapshot.data['chatData'];
    if (resolvedData) {
      this.chat = resolvedData.chat;
      this.messageList = resolvedData.messages;
    }

    this.chatService.connectWebSocket();
    this.chatService.socket?.next({type: 'group_add', 'chat_id': this.chat.id});
    this.chatService.socket?.asObservable().subscribe((response: {type: string, message: Message}) => {
      if (response.type === 'new_message') {
        this.messageList?.push(response.message);
      }
    });
  }

  ngAfterViewInit() {
    try {
      this.messagesContainer?.nativeElement.scroll({
        top: this.messagesContainer.nativeElement.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    } catch (err) {
      console.error(err);
    }
  }

  send() {
    if (this.messageForm.valid) {
      const message = this.messageForm.get('message')?.value;
      console.log(message);
      this.chatService.socket?.next({
        type: 'send_message',
        chat_id: this.chat?.id,
        text: message
      });
      this.messageForm.reset();
      // this.chatService.sendMessage({ message }).subscribe(response => {
      //   // Handle response from backend
      //   console.log('Message sent successfully', response);
      //   this.messageForm.reset();
      // });
    }
  }

  get user() {
    return this.authService.user;
  }

}


@Injectable({
  providedIn: 'root'
})
export class ChatResolverService implements Resolve<any> {

  constructor(private chatService: ChatService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let chatId = route.paramMap.get('chatId');
    if (chatId) {
      return forkJoin({
        chat: this.chatService.getChatInfo(chatId),
        messages: this.chatService.getMessageList(chatId)
      });
    }
    return of(null); // Or handle appropriately if chatId is not present
  }
}
