from typing import Any

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
    class Meta:
        model = User
        fields = ("last_name", "first_name", "email", "username", "image",)

    def update(self, instance: User, validated_data: dict[str, Any]):
        for field, value in validated_data:
            setattr(instance, field, value)
        instance.save()
        return instance
