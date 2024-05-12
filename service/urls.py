from django.urls import include, path


urlpatterns = [
    path("auth/", include("service.auth.urls")),
]
