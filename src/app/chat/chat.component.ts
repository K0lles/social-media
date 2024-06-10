import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ChatService} from "../services/chat.service";
import {webSocket} from "rxjs/webSocket";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messageForm: FormGroup;
  websocket: WebSocket | undefined;

  constructor(private fb: FormBuilder, private  chatService: ChatService) {
    this.messageForm = this.fb.group({
      message: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit() {
  }

  send() {
    if (this.messageForm.valid) {
      const message = this.messageForm.get('message')?.value;
      console.log(message);
      // this.chatService.sendMessage({ message }).subscribe(response => {
      //   // Handle response from backend
      //   console.log('Message sent successfully', response);
      //   this.messageForm.reset();
      // });
    }
  }

}
