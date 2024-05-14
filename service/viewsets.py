from rest_framework import serializers
from rest_framework.viewsets import ModelViewSet


class BaseModelViewSet(ModelViewSet):
    serializer_classes = {}

    def get_serializer_class(self) -> serializers.ModelSerializer:
        return self.serializer_classes.get(self.action)
