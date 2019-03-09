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
    regBy = models.ForeignKey('User', null=True, related_name='admin')
    bus = models.OneToOneField('Bus', null=True, on_delete.SET_NULL)

class Event(models.Model):
    enter = models.BooleanField()
    picture = models.ImageField(upload_to='events/')
    timestamp = models.DateTimeField(auto_now_add=True)
    device = models.ForeignKeyField('Device', null=True, on_delete.SET_NULL)
    student = models.ForeignKeyField('Student', null=True, on_delete.SET_NULL)
    

class Bus(models.Model):
    name = models.CharField(max_length=50)

class Driver(models.Model):
    bus = models.ForeignKey('Bus', null=True, on_delete.SET_NULL)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)

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
    track = models.BooleanField(deafault=True)
    
class School(models.Model):
    name = models.CharField(max_length=50)
    address = models.CharField(max_length=30)
    city = models.CharField(max_length=30)
    state = models.CharField(max_length=2)
    zipcode = models.CharField(max_length=5)
    
