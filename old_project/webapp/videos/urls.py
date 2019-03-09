from django.urls import path, include
from . import views

urlpatterns = [
    path('upload/', views.upload_video, name='upload'),
    path('', views.video_list, name='list'),
    path('<int:video_id>/', views.vote, name='vote'),
]