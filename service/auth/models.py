from django.db import models
from django.contrib.auth.models import User as BaseUser


class User(BaseUser):
    image = models.ImageField(upload_to='images/', null=True)
