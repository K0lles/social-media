from django.contrib.auth.models import User
from django.db.models import DO_NOTHING, DateTimeField, ForeignKey, Model, TextField


class Message(Model):
    sender = ForeignKey(User, on_delete=DO_NOTHING, related_name="sender")
    receiver = ForeignKey(User, on_delete=DO_NOTHING, related_name="receiver")
    text = TextField()
    created_at = DateTimeField(auto_now_add=True)
