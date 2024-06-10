import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class ChatConsumer(WebsocketConsumer):

    def connect(self):
        print(self.scope["user"])
        pass

    def receive(self, text_data=None, bytes_data=None):
        json_text = json.loads(text_data)
        message = json_text["message"]

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message
            }
        )
