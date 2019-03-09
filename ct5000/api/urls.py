from django.urls import path

from . import views

app_name = 'api'

urlpatterns = [
    # path for login
    #path()
    
    # path for parent view
    path('parent/<int:pk>' views.ParentView.as_view(), name='parent'),

    # path for update child/student view
    path('parent/student/<int:pk>', views.updateStudent, name='updateStud'),
]
