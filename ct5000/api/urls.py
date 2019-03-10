from django.urls import path

from . import views

app_name = 'api'

urlpatterns = [
    # path for login
    #path()
    
    # path for parent view
    path('parent/<int:parent_id>', views.ParentView.as_view(), name='parent'),

    # path for update child/student view
    path('parent/student/<int:stud_id>', views.updateStudent, name='updateStud'),
]
