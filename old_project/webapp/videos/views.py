form django.http import HttpResponse
from django.shortcuts import render
from .forms import VideoForm

def upload_video(requests):
	if request.method == 'POST':
		form = VideoForm(request.POST, request.FILES)
		if form.is_valid():
			form.save()
			return HttpResponse(status=200)
	else:
        form = VideoForm()
    return render(request, 'upload.html', {'video_form': form})

def video_list(request):
	return render(request, 'list.html', {'videos': Video.objects.all()})


def video_details(request, video_id):
	return render(request, 'video_details.html', {'video': Video.objects.get(id=video_id))})