from django.db import models

import os, string

# Create your models here.

class Device(models.Model)
    # The key the device connects with for verification
    key = models.CharField(max_length=10)

    # The date and time the device entry was registered to the Database
    regDate = models.DateTimeField('date registered')

    # Who registered the device, the user/admin who made the Database entry
    regBy = models.CharField(max_length=50)

    
    def __str__(self):
        text = self.pk + " " + self.key + " " + self.regDate

        return text

    
    def GenerateKey(self):
        # key = os.urandom(10), Couldn't find a way to create a key of fixed length with this method. Outputs random string of random length. Uses bytes to determine length?

        key = ''.join(random.SystemRandom().choice(string.ascii_letters + string.digits +"!@#$%^&*?") for _ in range(10))

        print(key)

        return key


    def CompareKey(self, kValue):
        return self.key == kValue
