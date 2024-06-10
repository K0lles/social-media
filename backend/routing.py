from django.urls import path

from backend.consumers import ChatConsumer

ws_urlpatterns = [
    path("ws/chat/", ChatConsumer.as_asgi())
]
