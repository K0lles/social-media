from typing import ClassVar

from django.db.models import Count
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import BaseSerializer
from rest_framework.viewsets import ModelViewSet

from service.post.models import Post, Comment
from service.post.serializers import PostCreateSerializer, MyPostSerializer
from service.viewsets import BaseModelViewSet


class PostViewSet(ModelViewSet):
    serializer_classes: ClassVar[dict[str, BaseSerializer]] = {
        "add": PostCreateSerializer,
        "my_posts": MyPostSerializer,
    }

    def get_serializer_class(self) -> BaseSerializer:
        return self.serializer_classes.get(self.action)

    def get_queryset(self):
        return Post.objects.filter(user_id=self.request.user)

    @action(methods=["POST"], detail=False, url_path="add", url_name="add")
    def add(self, request: Request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data, context={"user": self.request.user}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(
            data={"error": "Something went wrong."}, status=status.HTTP_400_BAD_REQUEST
        )

    @action(methods=["GET"], detail=False, url_path="my-posts", url_name="my_posts")
    def my_posts(self, request, *args, **kwargs):
        posts = (
            Post.objects.filter(owner_id=self.request.user.id)
            .annotate(comments_amount=Count("comments", distinct=True))
            .order_by("-created_at")
        )
        serializer = self.get_serializer(posts, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class CommentViewSet(BaseModelViewSet):
    serializer_classes: ClassVar[dict[str, BaseSerializer]] = {}
