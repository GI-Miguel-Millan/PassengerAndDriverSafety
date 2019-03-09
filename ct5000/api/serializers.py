from rest_framework import serializers
from apis.models import Parent, Device, Event, Bus, Stop, Driver, Student, School

class ParentSerializer(serializers.ModelSerializer):
    students = serializers.PrimaryKeyRelatedField(many=True, queryset=Students.objects.all())
    class Meta:
        model = Parent
        fields = ('username', 'first_name', 'last_name', 'email', 'phone_number', 'address', 'city', 'state', 'zipcode',')

class DeviceSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Device
        fields = ('username', 'bus')

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('enter', 'stop', 'device')
        read_only_fields = ('timestamp')

class BusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ('name')

class StopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = ('bus','pick_up','drop_off','location')

class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ('bus','first_name','last_name','picture')

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('first_name','last_name','age','grade','school','bus','picture','parent_one','parent_two')

class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        field = ('name','address','city','state','zipcode')
