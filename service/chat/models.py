from service.auth_users.models import User
from django.db.models import (
    DO_NOTHING,
    BooleanField,
    CharField,
    DateTimeField,
    ForeignKey,
    ManyToManyField,
    Model,
    TextField,
    CASCADE,
)


class Chat(Model):
    name = CharField(blank=True, null=True, max_length=255)
    users = ManyToManyField(User, related_name="participants", through="ChatUser")
    is_group = BooleanField(default=False)
    created_at = DateTimeField(auto_now_add=True)


class ChatUser(Model):
    user = ForeignKey(User, related_name="participant", on_delete=DO_NOTHING)
    chat = ForeignKey(Chat, related_name="chat_users", on_delete=CASCADE)


class Message(Model):
    sender = ForeignKey(User, on_delete=DO_NOTHING, related_name="sender")
    receiver = ForeignKey(User, on_delete=DO_NOTHING, related_name="receiver")
    chat = ForeignKey(Chat, on_delete=DO_NOTHING, related_name="messages")
    text = TextField()
    created_at = DateTimeField(auto_now_add=True)
