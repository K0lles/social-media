from rest_framework import status
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from service.post.models import Post


class PostViewSet(ModelViewSet):

    def get_queryset(self):
        return Post.objects.filter(user_id=self.request.user)

    @action(methods=["POST"], detail=False, url_path="add")
    def add_post(self, request: Request, *args, **kwargs):
        post_data = request.data
        post_data.update({"user_id": self.request.user.id})
        breakpoint()
        serializer = self.get_serializer(data=post_data)
        breakpoint()
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.validated_data, status=status.HTTP_200_OK)
        return Response(data={"error": "Something went wrong."}, status=status.HTTP_400_BAD_REQUEST)
