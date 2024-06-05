from rest_framework.routers import SimpleRouter

from service.post.viewsets import PostViewSet

simple_router = SimpleRouter()
simple_router.register("", PostViewSet, basename="")

urlpatterns = [] + simple_router.urls
