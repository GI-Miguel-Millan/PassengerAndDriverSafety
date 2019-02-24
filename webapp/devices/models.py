from django.db import models

import os, string, random

from django.utils import timezone

# Create your models here.

class Device(models.Model):
    # Name given by the user/admin who is registering the device
    name = models.CharField(max_length=255)
    
    # The key the device connects with for verification
    key = models.CharField(max_length=10, editable=False)

    # The date and time the device entry was registered to the Database
    regDate = models.DateTimeField('date registered', auto_now_add=True)

    # Who registered the device, the user/admin who made the Database entry
    regBy = models.CharField(max_length=50)

    # To be used to avoid needing to delete an entry in the DB, which would delete the related videos
    active = models.BooleanField(default=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if (self.key == ''):
            self.key = self.GenerateKey()

        #if (self.regBy == ''):
            
        
        #models.Model.save(self)
        
    def __str__(self):
        text = self.name #+ ' ' + self.key + ' ' + self.regDate

        return text

    def GenerateKey(self):
        # key = os.urandom(10), Couldn't find a way to create a key of fixed length with this method. Outputs random string of random length. Uses bytes to determine length?
        
        key = ''.join(random.SystemRandom().choice(string.ascii_letters + string.digits +"!@#$%^&*?") for _ in range(10))
        
        print(key)
        
        return key

    def CompareKey(self, kValue):
        return self.key == kValue
