from api.models import Parent, Device, Event, Bus, Driver, Student, School
from api.serializers import UserSerializer, ParentSerializer, DeviceSerializer, EventSerializer, BusSerializer, DriverSerializer, StudentSerializer, SchoolSerializer
from django.contrib.auth.models import User
from rest_framework import generics
from face-detection.face import create_group, add_student, identify, delete_student

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ParentList(generics.ListCreateAPIView):
    queryset = Parent.objects.all()
    serializer_class = ParentSerializer

class ParentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Parent.objects.all()
    serializer_class = ParentSerializer

class DeviceList(generics.ListCreateAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer

class DeviceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer

class StudentList(generics.ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    def perform_create(self, serializer):
        face.add_student(self.request.bus, self.request.id, self.request.picture)

class StudentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class EventList(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    def perform_create(self, serializer):
        person = face.identify(self.request.bus, self.request.picture)
        if person is not None
            serializer.save(student=self.request.student)

class EventDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
	
class BusList(generics.ListCreateAPIView):
    queryset = Bus.objects.all()
    serializer_class = BusSerializer
    def perform_create(self, serializer):
        face.create_group(self.request.name)

class BusDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Bus.objects.all()
    serializer_class = BusSerializer

class DriverList(generics.ListCreateAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer

class DriverDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
	
class SchoolList(generics.ListCreateAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer

class SchoolDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
