from django.db import models

class Video(models.Model):
	NORMAL = 0
	MISPLACED_LUGGAGE = 1
	VIOLENT_CONFRONTATION = 3
	THREATENING_OBJECT = 3
	EVENT_CHOICES = (
		(NORMAL, 'Normal'),
		(MISPLACED_LUGGAGE, 'Misplaced Luggage'),
		(VIOLENT_CONFRONTATION, 'Violent Confrontation'),
		(THREATENING_OBJECT, 'Threatening Object'),
	)
	name = models.CharField(max_length=255)
	event = models.IntegerField(choices=EVENT_CHOICES, default=NORMAL)
	size = models.IntegerField()
	upload = models.DateTimeField(auto_now_add=True)
	# device = models.ForeignKey('devices.Device', on_delete=models.CASCADE)
	# thumbnail = models.ImageField(upload_to='videos/thumbnails')
	file = models.FileField(upload_to='videos/')