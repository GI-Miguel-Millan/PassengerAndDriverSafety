from api import views
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('admins/', views.UserList.as_view()),
    path('admins/<int:pk>/', views.UserDetail.as_view()),
    path('users/current/', views.CurrentUser.as_view()),
    path('users/admins/', views.AdminList.as_view()),
    path('students/', views.StudentList.as_view()),
    path('students/<int:pk>/', views.StudentDetail.as_view()),
    path('students/<int:student_id>/events/', views.StudentEvents.as_view()),
    path('events/', views.EventList.as_view()),
    path('events/<int:pk>/', views.EventDetail.as_view()),
    path('parents/', views.ParentList.as_view()),
    path('parents/<int:pk>/', views.ParentDetail.as_view()),
    path('parents/<int:parent_id>/students/', views.ParentStudents.as_view()),
    path('parents/students/', views.CurrentParentStudents.as_view()),
    path('devices/', views.DeviceList.as_view()),
    path('devices/<int:pk>/', views.DeviceDetail.as_view()),
    path('buses/', views.BusList.as_view()),
    path('buses/<int:pk>/', views.BusDetail.as_view()),
    path('schools/', views.SchoolList.as_view()),
    path('schools/<int:pk>/', views.SchoolDetail.as_view()),
    path('drivers/', views.DriverList.as_view()),
    path('drivers/<int:pk>/', views.DriverDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
