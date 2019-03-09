from django.db import models

class Video(models.Model):
	name = models.CharField(max_length=255)
	time = models.DateTimeField(auto_now_add=True)
	file = models.FileField(upload_to='videos/')