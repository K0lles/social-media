from drf_extra_fields.fields import Base64ImageField
from rest_framework.serializers import ModelSerializer

from service.post.models import Post


class PostCreateSerializer(ModelSerializer):
    image = Base64ImageField(allow_null=True)

    class Meta:
        model = Post
        fields = ("image", "text",)

    def create(self, validated_data):
        post = Post(
            **validated_data,
            owner_id=self.context["user"].id,
        )
        post.save()
        return post
