from typing import ClassVar

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import BaseSerializer
from rest_framework.viewsets import ModelViewSet

from service.post.models import Post
from service.post.serializers import PostCreateSerializer


class PostViewSet(ModelViewSet):
    serializer_classes: ClassVar[dict[str, BaseSerializer]] = {
        "add": PostCreateSerializer,
    }

    def get_serializer_class(self) -> BaseSerializer:
        return self.serializer_classes.get(self.action)

    def get_queryset(self):
        return Post.objects.filter(user_id=self.request.user)

    @action(methods=["POST"], detail=False, url_path="add", url_name="add")
    def add(self, request: Request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"user": self.request.user})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(data={"error": "Something went wrong."}, status=status.HTTP_400_BAD_REQUEST)
