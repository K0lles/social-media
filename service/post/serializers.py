from drf_extra_fields.fields import Base64ImageField
from rest_framework.fields import IntegerField
from rest_framework.serializers import ModelSerializer

from service.post.models import Post


class PostCreateSerializer(ModelSerializer):
    image = Base64ImageField(allow_null=True)

    class Meta:
        model = Post
        fields = (
            "image",
            "text",
        )

    def create(self, validated_data):
        post = Post(
            **validated_data,
            owner_id=self.context["user"].id,
        )
        post.save()
        return post


class MyPostSerializer(ModelSerializer):
    comments_amount = IntegerField()

    class Meta:
        model = Post
        fields = (
            "id",
            "image",
            "text",
            "created_at",
            "comments_amount",
        )
