from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    is_parent = models.BooleanField(default=False)
    is_device = models.BooleanField(default=False)

class Parent(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    phone_number = models.CharField(max_length=10)
    address = models.CharField(max_length=30)
    city = models.CharField(max_length=30)
    state = models.CharField(max_length=2)
    zipcode = models.CharField(max_length=5)

    def __str__(self):
        return self.user.first_name + " " + self.user.last_name

class Device(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    registered_by = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name='admin')
    bus = models.ForeignKey('Bus', null=True, on_delete=models.SET_NULL)
    
    def __str__(self):
        return self.user.username
    
class Event(models.Model):
    enter = models.BooleanField()
    picture = models.ImageField(upload_to='events/', blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    device = models.ForeignKey('Device', null=True, on_delete=models.SET_NULL)
    student = models.ForeignKey('Student', null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.id + " (" + self.timestamp + ")"

class Bus(models.Model):
    name = models.CharField(max_length=50)
    #driver = models.CharField(max_length=60)

    def __str__(self):
        return self.name

class Student(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    age = models.PositiveIntegerField()
    grade = models.PositiveIntegerField()
    school = models.ForeignKey('School', null=True, on_delete=models.SET_NULL)
    bus = models.ForeignKey('Bus', null=True, on_delete=models.SET_NULL)
    picture = models.ImageField(upload_to='students/', blank=True)
    parent_one = models.ForeignKey('Parent', null=True, related_name='parent_one', on_delete=models.SET_NULL)
    parent_two = models.ForeignKey('Parent', null=True, related_name='parent_two', on_delete=models.SET_NULL)
    track = models.BooleanField(default=True)

    def __str__(self):
        return self.first_name + ' ' + self.last_name
    
class School(models.Model):
    name = models.CharField(max_length=50)
    address = models.CharField(max_length=30)
    city = models.CharField(max_length=30)
    state = models.CharField(max_length=2)
    zipcode = models.CharField(max_length=5)

    def __str__(self):
        return self.name

