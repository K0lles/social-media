from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer


class SignUpSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ("first_name", "last_name", "username", "email", "password")


class UserInfoSerializer(ModelSerializer):
    class Meta:
        model = User
        exclude = ("password",)
