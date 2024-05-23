from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer


class SignUpSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ("first_name", "last_name", "username", "email", "password")

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
        exclude = ("password",)
