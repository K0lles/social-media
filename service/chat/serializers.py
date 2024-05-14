from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ModelSerializer

from service.chat.models import Message


class MessageCreateSerializer(ModelSerializer):
    def validate(self, attrs) -> dict:
        data = super().validate(attrs)
        if not (sender := self.context["sender"]):
            raise ValidationError(
                "Something went wrong. Please reload the page and try again."
            )
        data["sender"] = sender
        return data

    class Meta:
        model = Message
        fields = "__all__"
        extra_kwargs = {"sender": {"allow_null": True}}
