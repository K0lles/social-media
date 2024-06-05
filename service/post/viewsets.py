from rest_framework.viewsets import ModelViewSet

from service.post.models import Post


class PostViewSet(ModelViewSet):

    def get_queryset(self):
        return Post.objects.filter(user_id)
