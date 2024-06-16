from django.db.models import Q, F
from rest_framework.exceptions import ValidationError
from rest_framework.fields import SerializerMethodField, BooleanField, CharField
from rest_framework.serializers import ModelSerializer

from service.chat.models import Message, Chat, ChatUser


class MessageCreateSerializer(ModelSerializer):
    def validate(self, attrs) -> dict:
        data = super().validate(attrs)
        if not (sender := self.context["sender"]):
            raise ValidationError("Something went wrong. Please reload the page and try again.")
        data["sender"] = sender
        return data

    class Meta:
        model = Message
        fields = "__all__"
        extra_kwargs = {"sender": {"allow_null": True}}


class MessageDisplaySerializer(ModelSerializer):
    # sender_image = SerializerMethodField(allow_null=True)
    sender_username = SerializerMethodField()

    # def get_sender_image(self, instance: Message) -> str:
    #     if instance.sender.image:
    #         return f"http://localhost:8000{instance.sender.image.url}"
    #         # return self.context["request"].build_absolute_uri(instance.sender.image.url)

    def get_sender_username(self, instance: Message) -> str:
        return instance.sender.username

    class Meta:
        model = Message
        fields = ("id", "sender_username", "text", "created_at")


class ChatListSerializer(ModelSerializer):
    last_message_text = CharField(allow_null=True)
    last_message_date = CharField(allow_null=True)
    chat_name = CharField()
    image = SerializerMethodField()

    def get_image(self, instance: dict):
        if instance["is_group"]:
            return f"assets/images/group-chat-image.jpg"
        user = ChatUser.objects.filter(~Q(user_id=self.context["request"].user.id)).first().user
        if user.image:
            return f"http://localhost:8000/media/images{user.image.url}"
        return None

    class Meta:
        model = Chat
        fields = ("id", "last_message_text", "is_group", "chat_name", "image", "last_message_date", "created_at")


class ChatDisplaySerializer(ModelSerializer):
    users = SerializerMethodField()

    def get_users(self, instance: Chat):
        chat_users = list(
            ChatUser.objects.filter(~Q(user_id=self.context["request"].user.id, chat_id=instance.id))
            .annotate(
                user_image=F("user__image"),
                user_username=F("user__username"),
            )
            .values("user_id", "user_username", "user_image")
        )
        for user in chat_users:
            if user["user_image"]:
                user["user_image"] = f"http://localhost:8000/media/{user['user_image']}"
            else:
                user["user_image"] = None
        return chat_users

    class Meta:
        model = Chat
        fields = ("id", "name", "is_group", "users", "created_at")


class SingleChatSerializer(ModelSerializer):
    user_id = SerializerMethodField()
    is_group = BooleanField(read_only=True)

    def get_user_id(self, instance: Chat):
        return instance.users.filter(~Q(user_id=self.context.get("request").user.id)).first().user_id

    class Meta:
        model = Chat
        fields = ("id", "user_id", "is_group")

    def create(self, validated_data):
        chat = Chat.objects.create(is_group=False)
        ChatUser(chat_id=chat.id, user_id=self.context["request"].data.get("user_id")).save()
        ChatUser(chat_id=chat.id, user_id=self.context.get("request").user.id).save()
        chat.refresh_from_db()
        return chat


class GroupChatSerializer(ModelSerializer):
    is_group = BooleanField(read_only=True)

    class Meta:
        model = Chat
        fields = ("id", "name", "users", "is_group")

    def create(self, validated_data):
        name = validated_data.get("name", "Group chat")
        chat = Chat.objects.create(name=name, is_group=True)
        for user_id in self.context["request"].data.get("users", []):
            ChatUser(user_id=user_id, chat_id=chat.id).save()
        ChatUser(user_id=self.context["request"].user.id, chat_id=chat.id).save()
        chat.refresh_from_db()
        return chat


class GroupChatDisplaySerializer(ModelSerializer):
    users = SerializerMethodField()

    def get_users(self, instance: Chat):
        return list(instance.users.filter(~Q(id=self.context["request"].user.id)).values_list("id", flat=True))

    class Meta:
        model = Chat
        fields = ("id", "name", "users", "is_group", "created_at")


# class MessageListSerializer(ModelSerializer):
#     sender_username = SerializerMethodField()
#
#     def get_sender_username(self, instance: Message):
#         return instance.sender.username
#
#     class Meta:
#         model = Message
#         fields = ("id", "text", "created_at", "sender_username")
