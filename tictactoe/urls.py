from django.conf.urls import url

from .views import GameIndexView

urlpatterns = [
    url(r'^$', GameIndexView.as_view(), name="index"),
]