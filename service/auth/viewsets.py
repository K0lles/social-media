from django.contrib.auth.models import User
from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.tokens import RefreshToken

from . import serializers


class UserModelViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_classes: dict[str, serializers.ModelSerializer] = {
        "sign_up": serializers.SignUpSerializer,
        "user_info": serializers.UserInfoSerializer,
        "user_update": serializers.UserInfoSerializer,
    }

    def get_serializer_class(self) -> serializers.ModelSerializer:
        return self.serializer_classes.get(self.action)

    def get_permissions(self) -> list[permissions.BasePermission]:
        if self.action == "sign_up":
            return [permissions.AllowAny()]
        return super().get_permissions()

    @action(methods=["POST"], detail=False, url_path="sign-up")
    def sign_up(self, request: Request, *args, **kwargs) -> Response:
        serializer: serializers.ModelSerializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=["GET"], detail=False, url_path="user-info")
    def user_info(self, request: Request, *args, **kwargs):
        serializer: serializers.ModelSerializer = self.get_serializer(
            instance=request.user
        )
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @action(methods=["POST"], detail=False, url_path="logout")
    def logout(self, request: Request, *args, **kwargs):
        if not self.request.user:
            return Response(
                data={"detail": "You are not logged in."}, status=status.HTTP_401_UNAUTHORIZED
            )
        if not request.data.get("refresh_token"):
            return Response(data={"detail": "Refresh token was not provided."}, status=status.HTTP_400_BAD_REQUEST)
        token = RefreshToken(request.data.get("refresh_token"))
        token.blacklist()
        return Response(status=status.HTTP_205_RESET_CONTENT)

    @action(methods=["PUT"], detail=False, url_path="user-update")
    def user_update(self, request: Request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, instance=request.user)
        if serializer.is_valid():
            serializer.save()
        return Response(data=serializer.validated_data, status=status.HTTP_200_OK)
