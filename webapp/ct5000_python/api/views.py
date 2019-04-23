from api.models import Parent, Device, Event, Bus, Student, School
from api.serializers import UserSerializer, AdminSerializer, ParentUserSerializer, ParentSerializer, DeviceSerializer, DeviceUserSerializer, EventSerializer, BusSerializer, StudentSerializer, SchoolSerializer
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
        print(request.user)
        serializer_class = self.get_serializer_class()(request.user)
        return Response(serializer_class.data)
        
#class CurrentUser(generics.UpdateAPIView):
    #queryset = User.objects.all()
    #serializer_class = ParentUserSerializer
    
    #def get_object(self):
        #return self.request.user(last_login=

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
        instance = serializer.save()
        add_student(instance.bus.id, instance.id, instance.picture)

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
        instance = serializer.save()
        device = Device.objects.get(pk=instance.device_id)
        person = identify(device.bus_id, instance.picture.url)
        print(person)
        if person is not None:
            try:
                instance.student_id = Student.objects.get(pk=int(person))
                instance.save()
            except Exception as e:
                print("Hit exception.")
                print(e)
            try:
                parents = Parent.objects.filter(student__id=instance.student_id).value_list('user__email', flat=True)
                subject = 'An Event has Occurred!'
                message = 'You child has entered the bus.' if instance.enter else 'Your child has exited the bus.'
                from_email = 'admin@isrow.net'
                send_mail(subject, message, from_email, parents)
            except Exception as e:
                print(e)
                print("Failed to send email notifications.")
            
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
        
class ParentStudentsEvents(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_queryset(self):
        parent_id = self.kwargs['parent_id']
        last_login = User.objects.get(pk=parent_id).last_login
        if last_login != None:
            return self.queryset.filter((Q(student__parent_one__pk=parent_id) | Q(student__parent_two__pk=parent_id)) & Q(timestamp__gte=last_login))
        return self.queryset.filter(Q(student__parent_one__pk=parent_id) | Q(student__parent_two__pk=parent_id))
        
class CurrentParentStudentsEvents(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_queryset(self):
        queryset = Event.objects.all()
        if self.request.user.is_parent is False:
            return queryset
        parent_id = self.request.user.id
        last_login = self.request.user.last_login
        if last_login != None:
            return self.queryset.filter((Q(student__parent_one__pk=parent_id) | Q(student__parent_two__pk=parent_id)) & Q(timestamp__gte=last_login))
        return self.queryset.filter(Q(student__parent_one__pk=parent_id) | Q(student__parent_two__pk=parent_id))

class StudentEvents(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_queryset(self):
        student_id = self.kwargs['student_id']
        return self.queryset.filter(student__id=student_id)
