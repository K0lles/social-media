from rest_framework.routers import SimpleRouter

from service.post.viewsets import PostViewSet, CommentViewSet

simple_router = SimpleRouter()
simple_router.register("", PostViewSet, basename="")
simple_router.register("comments", CommentViewSet, basename="comments")

urlpatterns = [] + simple_router.urls
