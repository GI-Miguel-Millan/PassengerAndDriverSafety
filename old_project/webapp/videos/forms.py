from django.forms import ModelForm

class VideoForm(ModelForm):
    class Meta:
        model = Video
        fields = ['name', 'file']