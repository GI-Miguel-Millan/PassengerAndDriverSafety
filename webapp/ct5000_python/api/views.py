from api.models import Parent, Device, Event, Bus, Driver, Student, School
from api.serializers import UserSerializer, AdminSerializer, ParentUserSerializer, ParentSerializer, DeviceSerializer, DeviceUserSerializer, EventSerializer, BusSerializer, DriverSerializer, StudentSerializer, SchoolSerializer
from django.db.models import Q
from django.contrib.auth import get_user_model
from facedetection.face import create_group, delete_group, add_student, delete_student, identify
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
User = get_user_model()
from facedetection import face

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = AdminSerializer
    def get_queryset(self):
        queryset = User.objects.filter(is_superuser=True)
        return queryset

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = AdminSerializer

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

class AdminList(generics.ListCreateAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = User.objects.filter(is_superuser=True)
        return queryset

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
    serializer_class = StudentSerializer
    queryset = Student.objects.all()

    def perform_create(self, serializer):
        add_student(self.request.data['bus'], self.request.data['first_name'] + ' ' + self.request.data['last_name'], self.request.data['picture'])
        super(StudentList, self).perform_create(serializer)
        
    def perform_destroy(self, instance):
        delete_student(instance.bus, instance.first_name + ' ' + instance.last_name)
        super(StudentList, self).perform_destroy(instance)

class StudentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class EventList(generics.ListCreateAPIView):
    serializer_class = EventSerializer
    queryset = Event.objects.all()

    def perform_create(self, serializer):
        person = identify(self.request.data['bus'], self.request.data['picture'])
        if person is not None:
            serializer.save(student=person)
        super(EventList, self).perform_create(serializer)


class EventDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class BusList(generics.ListCreateAPIView):
    queryset = Bus.objects.all()
    serializer_class = BusSerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        create_group(instance.id)

    def perform_destroy(self, instance):
        delete_group(instance.id)
        super(BusList, self).perform_destroy(instance)


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
    serializer_class = StudentSerializer

    def get_queryset(self):
        queryset = Student.objects.all()

        if self.request.user.is_parent is False:
            return queryset

        parent_id = self.request.user.id
        return Student.objects.filter(Q(parent_one__pk=parent_id) | Q(parent_two__pk=parent_id))

class StudentEvents(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_queryset(self):
        student_id = self.kwargs['student_id']
        return self.queryset.filter(student__id=student_id)
