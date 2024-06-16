from service.auth_users.models import User, UserSubscription
from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.tokens import RefreshToken

from . import serializers
from .serializers import UserInfoDisplay


class UserModelViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_classes: dict[str, serializers.ModelSerializer] = {
        "sign_up": serializers.SignUpSerializer,
        "user_info": serializers.UserInfoSerializer,
        "user_update": serializers.UserInfoSerializer,
        "another_user": serializers.AnotherUserSerializer,
        "users_for_search": serializers.UsersForSearchSeriliazer,
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
        serializer: serializers.ModelSerializer = self.get_serializer(instance=request.user)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @action(methods=["POST"], detail=False, url_path="logout")
    def logout(self, request: Request, *args, **kwargs):
        if not self.request.user:
            return Response(
                data={"detail": "You are not logged in."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        if not request.data.get("refresh_token"):
            return Response(
                data={"detail": "Refresh token was not provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        token = RefreshToken(request.data.get("refresh_token"))
        token.blacklist()
        return Response(status=status.HTTP_205_RESET_CONTENT)

    @action(methods=["PUT"], detail=False, url_path="user-update")
    def user_update(self, request: Request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, instance=request.user)
        if serializer.is_valid():
            serializer.save()
            representation_serializer = UserInfoDisplay(instance=User.objects.get(id=self.request.user.id))
            return Response(data=representation_serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                data={"error": "Something went wrong."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(methods=["GET"], detail=False, url_path="another-user", url_name="another_user")
    def another_user(self, request: Request, *args, **kwargs):
        if not (user_id := request.query_params.get("user_id", None)):
            return Response(data={"error": "No user id."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(
            data=self.get_serializer(
                instance=User.objects.get(id=user_id), context={"user": request.user, "request": request}
            ).data,
            status=status.HTTP_200_OK,
        )

    @action(methods=["POST"], detail=True, url_path="subscribe", url_name="subscribe")
    def subscribe(self, request, pk, *args, **kwargs):
        if UserSubscription.objects.filter(subscriber_id=request.user.id, on_user_id=pk).exists():
            return Response(
                data={"error": "You are already subscribed on this user"}, status=status.HTTP_400_BAD_REQUEST
            )
        subscription = UserSubscription(subscriber_id=request.user.id, on_user_id=pk)
        subscription.save()
        return Response(status=status.HTTP_200_OK)

    @action(methods=["POST"], detail=True, url_path="unsubscribe", url_name="unsubscribe")
    def unsubscribe(self, request, pk, *args, **kwargs):
        if not UserSubscription.objects.filter(subscriber_id=request.user.id, on_user_id=pk).exists():
            return Response(data={"error": "You were not subscribed on this user."}, status=status.HTTP_400_BAD_REQUEST)
        UserSubscription.objects.filter(subscriber_id=request.user.id, on_user_id=pk).delete()
        return Response(status=status.HTTP_200_OK)

    @action(methods=["GET"], detail=False, url_path="users-for-search", url_name="users_for_search")
    def users_for_search(self, request: Request, *args, **kwargs):
        users = User.objects.all().order_by("-date_joined")
        return Response(data=self.get_serializer(users, many=True).data, status=status.HTTP_200_OK)

