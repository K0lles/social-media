from rest_framework.routers import SimpleRouter

from service.chat.viewsets import MessageViewSet

router = SimpleRouter()
router.register("", MessageViewSet, basename="chat")

urlpatterns = [] + router.urls
