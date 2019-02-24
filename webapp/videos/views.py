from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from videos.forms import VideoForm
from videos.models import Video

@csrf_exempt
def upload_video(request):
	if request.method == 'POST':
		form = VideoForm(request.POST, request.FILES)
		if form.is_valid():
			video = form.save(commit=False)
			video.name = request.FILES['file'].name
			video.size = request.FILES['file'].size
			video.save()
			return HttpResponseRedirect(reverse('list'))
	else:
		form = VideoForm()
	return render(request, 'upload.html', {'video_form': form})

def video_list(request):
	return render(request, 'list.html', {'videos': Video.objects.all()})
	
def video_details(request, video_id):
	return render(request, 'video_details.html', {'video': Video.objects.get(id=video_id)})
	
def video_delete(request, video_id):
	if request.method == 'POST':
		video = Video.objects.get(id=video_id)
		video.delete()
		return HttpResponseRedirect(reverse('list'))
	else:
		return render(request, 'video_delete.html', {'video': Video.objects.get(id=video_id)})
	