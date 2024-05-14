from django.db.models import Case, F, Q, Subquery, When
from rest_framework import status
from rest_framework.response import Response

from service.chat.models import Message
from service.chat.serializers import MessageCreateSerializer
from service.viewsets import BaseModelViewSet


class MessageViewSet(BaseModelViewSet):
    serializer_classes = {"create": MessageCreateSerializer}

    def get_queryset(self):
        return (
            Message.objects.filter(
                Q(sender=self.request.user.id) | Q(receiver=self.request.user.id)
            )
            .annotate(
                chat_user_id=When(
                    Case(receiver_id=self.request.user.id), then=F("sender__username")
                ),
                default=F("sender__username"),
            )
            .distinct("chat_user_id")
            .values("chat_user_id")
        )

    def list(self, request, *args, **kwargs) -> Response:
        pass

    def create(self, request, *args, **kwargs) -> Response:
        # TODO: add websocket event
        serializer = self.get_serializer(
            data=request.data, context={"sender": self.request.user}
        )
        if serializer.is_valid():
            serializer.save()
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
