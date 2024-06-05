from django.urls import include, path

urlpatterns = [
    path("auth/", include("service.auth_users.urls")),
    path("posts/", include("service.post.urls")),
]
