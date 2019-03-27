from api.models import Parent, Device, Event, Bus, Driver, Student, School
from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'is_active')
        read_only_fields = ('last_login','date_joined')

class ParentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parent
        fields = ('user','phone_number','address','city','state','zipcode')
        
class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ('user','registered_by','bus')
		
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('id', 'first_name','last_name','age','grade','school','bus','picture','parent_one','parent_two', 'track')
		
class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('enter','picture','device','student')

class BusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bus
        fields = ('name',)
        
class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ('bus','first_name','last_name')

class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ('name','address','city','state','zipcode')
