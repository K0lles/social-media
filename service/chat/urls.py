from rest_framework.routers import SimpleRouter

from service.chat.viewsets import MessageViewSet, ChatViewSet

router = SimpleRouter()
router.register("messages", MessageViewSet, basename="messages")
router.register("", ChatViewSet, basename="chat")

urlpatterns = [] + router.urls
