from django.contrib.auth.models import User
from django.db.models import (
    DO_NOTHING,
    BooleanField,
    CharField,
    DateTimeField,
    ForeignKey,
    ManyToManyField,
    Model,
    TextField, CASCADE,
)


class Chat(Model):
    name = CharField(blank=True, null=True)
    users = ManyToManyField(User, related_name="participants", through="ChatUser")
    is_group = BooleanField(default=False)
    created_at = DateTimeField(auto_now_add=True)


class ChatUser(Model):
    user = ForeignKey(User, related_name="participant", on_delete=DO_NOTHING)
    chat = ForeignKey(Chat, related_name="chat", on_delete=CASCADE)


class Message(Model):
    sender = ForeignKey(User, on_delete=DO_NOTHING, related_name="sender")
    receiver = ForeignKey(User, on_delete=DO_NOTHING, related_name="receiver")
    text = TextField()
    created_at = DateTimeField(auto_now_add=True)
