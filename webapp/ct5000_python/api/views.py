from api.models import Parent, Device, Event, Bus, Driver, Student, School
from api.serializers import UserSerializer, ParentUserSerializer, ParentSerializer, DeviceSerializer, DeviceUserSerializer, EventSerializer, BusSerializer, DriverSerializer, StudentSerializer, SchoolSerializer
from django.db.models import Q
from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
User = get_user_model()
from facedetection import face

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CurrentUser(APIView):
    def get_serializer_class(self):
        if self.request.user.is_parent:
            return ParentUserSerializer
        elif self.request.user.is_device:
            return DeviceUserSerializer
        else:
            return UserSerializer

    def get(self, request):
        serializer_class = self.get_serializer_class()(request.user)
        return Response(serializer_class.data)

class ParentList(generics.ListCreateAPIView):
    serializer_class = ParentUserSerializer
    def get_queryset(self):
        queryset = User.objects.filter(is_parent=True)
        return queryset

class ParentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = ParentUserSerializer
    	
class DeviceList(generics.ListCreateAPIView):
    serializer_class = DeviceUserSerializer
    def get_queryset(self):
        queryset = User.objects.filter(is_device=True)
        return queryset

class DeviceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = DeviceUserSerializer

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
        if person is not None:
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

class ParentStudents(generics.ListAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def get_queryset(self):
        parent_id = self.kwargs['parent_id']
        return self.queryset.filter(Q(parent_one__pk=parent_id) | Q(parent_two__pk=parent_id))

class CurrentParentStudents(generics.ListAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def get_queryset(self):
        if(self.request.user.is_parent):
            parent_id = self.request.user.id
            return self.queryset.filter(Q(parent_one__pk=parent_id) | Q(parent_two__pk=parent_id))

class StudentEvents(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_queryset(self):
        student_id = self.kwargs['student_id']
        return self.queryset.filter(student__id=student_id)
