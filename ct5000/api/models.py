from django.db import models
from django.contrib.auth.models import User

class Parent(models.Model):
    user = models.OneToOneField('User', on_delete=models.CASCADE, primary_key=True)
    phone_number = models.CharField(max_length=10)
    address = models.CharField(max_length=30)
    city = models.CharField(max_length=30)
    state = models.CharField(max_length=2)
    zipcode = models.CharField(max_length=5)

class Device(models.Model):
    user = models.OneToOneField('User', on_delete=models.CASCADE, primary_key=True)
    bus = models.OneToOneField('Bus', null=True, on_delete.SET_NULL)

class Event(models.Model):
    enter = models.BooleanField()
    timestamp = models.DateTimeField(auto_now_add=True)
    stop = models.ForeignKeyField('Stop', null=True, on_delete.SET_NULL)
    device = models.ForeignKeyField('Device', null=True, on_delete.SET_NULL)

class Bus(models.Model):
    name = models.CharField(max_length=50)

class Stop(models.Model):
    bus = models.ForeignKey('Bus', null=True, on_delete.SET_NULL)
    pick_up = models.TimeField()
    drop_off = models.TimeField()
    location = models.CharField(max_length=150)

class Driver(models.Model):
    bus = models.ForeignKey('Bus', null=True, on_delete.SET_NULL)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    picture = models.ImageField(upload_to='drivers/')

class Student(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    age = models.PositiveIntegerField()
    grade = models.PositiveIntegerField()
    school = models.ForeignKey('School', null=True, on_delete.SET_NULL)
    bus = models.ForeignKey('Bus', null=True, on_delete.SET_NULL)
    picture = models.ImageField(upload_to='students/')
    parent_one = models.ForeignKey('Parent', null=True, related_name='parent_one')
    parent_two = models.ForeignKey('Parent', null=True, related_name='parent_two')
    
class School(models.Model):
    name = models.CharField(max_length=50)
    address = models.CharField(max_length=30)
    city = models.CharField(max_length=30)
    state = models.CharField(max_length=2)
    zipcode = models.CharField(max_length=5)
    
