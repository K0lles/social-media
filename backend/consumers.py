import json
from typing import Any

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from django.db.models import Exists

from service.chat.models import Chat, ChatUser, Message
from service.chat.serializers import MessageDisplaySerializer


class ChatConsumer(WebsocketConsumer):

    def connect(self):
        self.user = self.scope["user"]
        if self.user is not None and not isinstance(self.user, AnonymousUser):
            subprotocols = self.scope["subprotocols"]
            self.accept(subprotocol=subprotocols[0] if subprotocols else None)
        else:
            self.close()

    def receive(self, text_data=None, bytes_data=None):
        json_text: dict[str, Any] = json.loads(text_data)
        if message_type := json_text.get("type", None):
            if message_type == "group_add":
                chat_id = json_text.get("chat_id")
                user_id = self.user.id
                if ChatUser.objects.filter(chat_id=chat_id, user_id=user_id).exists():
                    async_to_sync(self.channel_layer.group_add)(f"chat_{chat_id}", self.channel_name)
            if message_type == "send_message":
                chat_id = json_text.get("chat_id")
                print(chat_id)
                print(self.user.id)
                print(ChatUser.objects.filter(chat_id=chat_id, user_id=self.user.id).exists())
                if ChatUser.objects.filter(chat_id=chat_id, user_id=self.user.id).exists():
                    message = Message(chat_id=chat_id, sender_id=self.user.id, text=json_text.get("text"))
                    message.save()
                    async_to_sync(self.channel_layer.group_send)(
                        f"chat_{chat_id}",
                        {
                            "type": "chat_message",
                            "text": {"type": "new_message", "message": MessageDisplaySerializer(message).data},
                        }
                    )

    def chat_message(self, event):
        self.send(json.dumps(event["text"]))

    def disconnect(self, code):
        super().disconnect(code)
        chat_room = f"{self.user.id}"
        async_to_sync(self.channel_layer.group_discard)(chat_room, self.channel_name)
