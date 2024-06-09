from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    image = models.ImageField(upload_to="images/", null=True)


class UserSubscription(models.Model):
    subscriber = models.ForeignKey(User, on_delete=models.CASCADE, related_name="subscriber")
    on_user = models.ForeignKey(User, models.CASCADE, related_name="on_user")
    created_at = models.DateTimeField(auto_now_add=True)
