from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse, HttpResponseRedirect

from django.urls import reverse

from django.views import generic

from .models import Student, Parent

# Create your views here.

# View for parent after login
class ParentView(generic.ListView):
    template_name = 'parent.html'
    context_object_name = 'childList'

    def get_queryset(self):
        p_id = Parent.objects.get(user_id='2')
        return Student.objects.filter(parent_one=p_id)

# View for a parent to update one of their children's(student) info
def updateStudent(request, stud_id):
    student = get_object_or_404(Student, pk=stud_id)
    
    if request.method == 'POST':
        student.picture = request.FILES[0]
        student.track = request.POST['tracking']
        student.save()
        return HttpResponseRedirect(reverse('api:parent', args='2'))

    #return HttpResponseRedirect(reverse('api:parent', args='2'))

    return render(request, 'updateC.html', {'student': student})
