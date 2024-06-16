from django.core.exceptions import ObjectDoesNotExist
from drf_extra_fields.fields import Base64ImageField
from rest_framework.exceptions import ValidationError
from rest_framework.fields import IntegerField, SerializerMethodField, ListField, ImageField
from rest_framework.serializers import ModelSerializer

from service.post.models import Post, Comment


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


class AnotherPeoplePosts(ModelSerializer):
    owner_username = SerializerMethodField()
    owner_image = SerializerMethodField()
    comments_amount = IntegerField()

    def get_owner_username(self, instance: Post):
        return instance.owner.username

    def get_owner_image(self, instance: Post):
        if instance.owner.image:
            return self.context["request"].build_absolute_uri(instance.owner.image.url)
        return ""

    class Meta:
        model = Post
        fields = (
            "id",
            "image",
            "text",
            "created_at",
            "comments_amount",
            "owner_username",
            "owner_image",
            "owner_id",
        )


class AddCommentSerializer(ModelSerializer):
    post_id = IntegerField()

    class Meta:
        model = Comment
        fields = ("text", "post_id")

    def validate(self, attrs):
        data = super().validate(attrs)
        try:
            Post.objects.get(id=attrs.get("post_id"))
        except ObjectDoesNotExist:
            raise ValidationError("Wrong post_id indicated.")
        return data

    def create(self, validated_data):
        comment = Comment(**validated_data)
        comment.user_id = self.context["user"].id
        comment.save()
        return comment


class CommentDisplaySerializer(ModelSerializer):
    username = SerializerMethodField()
    user_image = SerializerMethodField()

    def get_username(self, instance: Comment) -> str:
        return instance.user.username

    def get_user_image(self, instance: Comment) -> str:
        if instance.user.image:
            return self.context["request"].build_absolute_uri(instance.user.image.url)
        return None

    class Meta:
        model = Comment
        fields = ("text", "username", "user_image", "created_at", "post_id")


class PostDetailSerializer(ModelSerializer):
    owner_username = SerializerMethodField()
    owner_image = SerializerMethodField()
    comments = SerializerMethodField()

    def get_owner_username(self, instance: Post) -> str:
        return instance.owner.username

    def get_owner_image(self, instance: Post) -> str:
        return self.context["request"].build_absolute_uri(instance.owner.image.url)

    def get_comments(self, instance: Post) -> list[dict]:
        comments = instance.comments.all().order_by("created_at")
        return CommentDisplaySerializer(instance=comments, many=True, context={"request": self.context["request"]}).data

    class Meta:
        model = Post
        fields = ("id", "text", "image", "owner_id", "owner_username", "owner_image", "comments", "created_at")
