from django.urls import path, include
from videos import views

urlpatterns = [
    path('upload/', views.upload_video, name='upload'),
    path('', views.video_list, name='list'),
    path('<int:video_id>/', views.video_details, name='details'),
	path('<int:video_id>/delete/', views.video_delete, name='delete'),
]