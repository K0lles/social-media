import base64
from typing import Any

from drf_extra_fields.fields import Base64ImageField
from rest_framework.fields import SerializerMethodField

from service.auth_users.models import User
from rest_framework.serializers import ModelSerializer


class SignUpSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ("first_name", "last_name", "username", "email", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data: dict) -> User:
        password = validated_data.pop("password")
        user = User(
            **validated_data
        )
        user.set_password(password)
        user.save()
        return user


class UserInfoSerializer(ModelSerializer):
    image = Base64ImageField()

    class Meta:
        model = User
        fields = ("last_name", "first_name", "email", "image",)

    def update(self, instance: User, validated_data: dict[str, Any]):
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        return instance


class UserInfoDisplay(ModelSerializer):
    image = SerializerMethodField()

    def get_image(self, user):
        if user.image:
            with open(user.image.path, "rb") as image_file:
                return base64.b64encode(image_file.read()).decode("utf-8")
        return None

    class Meta:
        model = User
        fields = ("last_name", "first_name", "email", "image",)
