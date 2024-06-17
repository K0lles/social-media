from django.db.models import Case, F, Q, When, Subquery, OuterRef, CharField
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from service.chat.models import Message, Chat, ChatUser
from . import serializers
from service.viewsets import BaseModelViewSet


class MessageViewSet(BaseModelViewSet):
    serializer_classes = {
        "create": serializers.MessageCreateSerializer,
        "list": serializers.MessageDisplaySerializer,
    }

    def list(self, request, *args, **kwargs) -> Response:
        messages = Message.objects.filter(chat_id=self.request.query_params.get("chat_id"))
        return Response(data=self.get_serializer(messages, many=True).data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data, context={"sender": self.request.user})
        if serializer.is_valid():
            serializer.save()
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChatViewSet(BaseModelViewSet):
    serializer_classes = {
        "list": serializers.ChatListSerializer,
        "retrieve": serializers.ChatDisplaySerializer,
        "create_single_chat": serializers.SingleChatSerializer,
        "create_group_chat": serializers.GroupChatSerializer,
    }

    def list(self, request, *args, **kwargs):
        chats = (
            Chat.objects.filter(chat_users__user_id=self.request.user.id)
            .annotate(
                last_message_text=Subquery(
                    Message.objects.filter(chat_id=OuterRef("id")).order_by("-created_at").values("text")[:1]
                ),
                # last_message_user_id=Subquery(Message.objects.filter(chat_id=OuterRef("id")).order_by("-created_at").values("sender_id")[:1]),
                chat_name=Case(
                    When(is_group=True, then=F("name")),
                    default=Subquery(ChatUser.objects.filter(chat_id=OuterRef("id")).values("user__username")[:1]),
                    output_field=CharField(),
                ),
                last_message_date=Subquery(
                    Message.objects.filter(chat_id=OuterRef("id")).order_by("-created_at").values("created_at")[:1]
                ),
            )
            .order_by("-last_message_date", "-created_at")
            .values("id", "chat_name", "is_group", "last_message_text", "last_message_date", "created_at")
        )
        response = self.get_serializer(chats, many=True, context={"request": request}).data
        return Response(data=response, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        chat = Chat.objects.get(id=kwargs["pk"])
        return Response(data=self.get_serializer(chat, context={"request": request}).data, status=status.HTTP_200_OK)

    @action(methods=["POST"], detail=False, url_path="create-single-chat", url_name="create_single_chat")
    def create_single_chat(self, request: Request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            chat = serializer.save()
            return Response(
                data=serializers.ChatDisplaySerializer(chat, context={"request": request}).data,
                status=status.HTTP_200_OK,
            )
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["POST"], detail=False, url_path="create-group-chat", url_name="create_group_chat")
    def create_group_chat(self, request: Request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            chat = serializer.save()
            return Response(
                data=serializers.GroupChatDisplaySerializer(chat, context={"request": request}).data,
                status=status.HTTP_200_OK,
            )
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
