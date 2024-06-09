import base64
from typing import Any

from drf_extra_fields.fields import Base64ImageField
from rest_framework.fields import SerializerMethodField

from service.auth_users.models import User, UserSubscription
from rest_framework.serializers import ModelSerializer


class SignUpSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ("first_name", "last_name", "username", "email", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data: dict) -> User:
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserInfoSerializer(ModelSerializer):
    image = Base64ImageField(required=False, allow_null=True)
    subscribers_amount = SerializerMethodField(read_only=True)
    is_subscribed = SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "last_name",
            "username",
            "first_name",
            "email",
            "image",
            "subscribers_amount",
            "is_subscribed",
        )
        extra_kwargs = {"username": {"read_only": True}, "id": {"read_only": True}}

    def get_subscribers_amount(self, instance: User):
        return UserSubscription.objects.filter(on_user_id=instance.id).count()

    def get_is_subscribed(self, instance: User):
        if not (current_user := self.context.get("user")):
            return False
        return UserSubscription.objects.filter(subscriber_id=current_user.id, on_user_id=instance.id).exists()

    def update(self, instance: User, validated_data: dict[str, Any]):
        for field, value in validated_data.items():
            if value:
                setattr(instance, field, value)
        instance.save()
        return instance


class UserInfoDisplay(ModelSerializer):
    image = SerializerMethodField()
    subscribers_amount = SerializerMethodField(read_only=True)

    def get_image(self, user):
        if user.image:
            with open(user.image.path, "rb") as image_file:
                return base64.b64encode(image_file.read()).decode("utf-8")
        return None

    def get_subscribers_amount(self, instance: User):
        return UserSubscription.objects.filter(on_user_id=instance.id).count()

    class Meta:
        model = User
        fields = (
            "last_name",
            "first_name",
            "email",
            "image",
            "subscribers_amount",
        )


class AnotherUserSerializer(ModelSerializer):
    image = SerializerMethodField(required=False, allow_null=True)
    subscribers_amount = SerializerMethodField(read_only=True)
    is_subscribed = SerializerMethodField(read_only=True)

    def get_image(self, instance: User) -> str:
        if instance.image:
            return self.context["request"].build_absolute_uri(instance.image.url)

    def get_subscribers_amount(self, instance: User):
        return UserSubscription.objects.filter(on_user_id=instance.id).count()

    def get_is_subscribed(self, instance: User):
        if not (current_user := self.context.get("user")):
            return False
        return UserSubscription.objects.filter(subscriber_id=current_user.id, on_user_id=instance.id).exists()

    class Meta:
        model = User
        fields = (
            "id",
            "last_name",
            "username",
            "first_name",
            "email",
            "image",
            "subscribers_amount",
            "is_subscribed",
        )
