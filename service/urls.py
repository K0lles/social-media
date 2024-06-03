from django.urls import include, path

urlpatterns = [
    path("auth_users/", include("service.auth_users.urls")),
]
