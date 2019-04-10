from api.models import Parent, Device, Event, Bus, Student, School
from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth.hashers import make_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ('id', 'last_login', 'date_joined', 'username', 'password', 'first_name', 'last_name', 'email', 'is_active','is_parent', 'is_device', 'is_staff', 'is_superuser')
        read_only_fields = ('id', 'last_login', 'date_joined')
		
class AdminSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
	
    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data["username"],
            password=make_password(validated_data["password"]),
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            email=validated_data["email"],
            is_active=True,
            is_staff=True,
            is_superuser=True)
        return user
		
    class Meta:
        model = User
        fields = ('id', 'last_login', 'date_joined', 'username', 'password', 'first_name', 'last_name', 'email')
        read_only_fields = ('id', 'last_login', 'date_joined')

class ParentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parent
        fields = ('phone_number', 'address', 'city', 'state', 'zipcode')

class ParentUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    parent = ParentSerializer()

    def to_representation(self, obj):
        representation = super().to_representation(obj)
        parent_representation = representation.pop('parent')
        if (parent_representation is not None):
            for key in parent_representation:
                representation[key] = parent_representation[key]
        return representation

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data["username"],
            password=make_password(validated_data["password"]),
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            email=validated_data["email"],
            is_active=True,
            is_parent=True)
        parent_data = validated_data.pop('parent')
        parent = Parent.objects.create(
            user=user,
            phone_number=parent_data["phone_number"],
            address=parent_data["address"],
            city=parent_data["city"],
            state=parent_data["state"],
            zipcode=parent_data["zipcode"])
        return user

    def update(self, instance, validated_data):
        instance.username=validated_data["username"]
        instance.password=make_password(validated_data["password"])
        instance.first_name=validated_data["first_name"]
        instance.last_name=validated_data["last_name"]
        instance.email=validated_data["email"]
        instance.is_active=validated_data["is_active"]
        instance.save()
        parent_data = validated_data.pop('parent')
        parent = Parent.objects.get(user=instance.id)
        parent.phone_number=parent_data["phone_number"]
        parent.address=parent_data["address"]
        parent.city=parent_data["city"]
        parent.state=parent_data["state"]
        parent.zipcode=parent_data["zipcode"]
        parent.save()
        return instance

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'first_name', 'last_name', 'email', 'last_login', 'date_joined', 'is_active', 'is_parent', 'parent')
        read_only_fields = ('id', 'last_login', 'date_joined', 'is_parent')

class DeviceSerializer(serializers.ModelSerializer):
    registered_by = serializers.StringRelatedField()
    registered_by_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(is_superuser=True), source='user')
    bus = serializers.StringRelatedField()
    bus_id = serializers.PrimaryKeyRelatedField(queryset=Bus.objects.all(), source='bus')
    class Meta:
        model = Device
        fields = ('registered_by', 'registered_by_id', 'bus', 'bus_id')
        read_only_fields = ('registered_by', 'bus')


class DeviceUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    device = DeviceSerializer()

    def _user(self, obj):
        request = getattr(self.context, 'request', None)
        if request:
            return request.user

    def to_representation(self, obj):
        representation = super().to_representation(obj)
        device_representation = representation.pop('device')
        if (device_representation is not None):
            for key in device_representation:
                representation[key] = device_representation[key]
        return representation

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data["username"],
            password=make_password(validated_data["password"]),
            is_active=True,
            is_device=True)
        device_data = validated_data.pop('device')
        device = Device.objects.create(
            user=user,
            bus_id=device_data["bus"].id,
            registered_by_id=device_data["user"].id)
        return user
        
    def update(self, instance, validated_data):
        instance.username=validated_data["username"]
        instance.password=make_password(validated_data["password"])
        instance.is_active=validated_data["is_active"]
        instance.save()
        device_data = validated_data.pop('device')
        device = Device.objects.get(user=instance)
        device.bus = device_data["bus"].id
        device.registered_by=device_data["user"].id
        device.save()
        return instance

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'last_login', 'date_joined', 'is_active', 'is_device', 'device')
        read_only_fields = ('id', 'last_login', 'date_joined', 'is_device')

class StudentSerializer(serializers.ModelSerializer):
    parent_one = serializers.StringRelatedField()
    parent_two = serializers.StringRelatedField()
    parent_one_id = serializers.PrimaryKeyRelatedField(queryset=Parent.objects.all(), source='parent_one', required=False)
    parent_two_id = serializers.PrimaryKeyRelatedField(queryset=Parent.objects.all(), source='parent_two', required=False)
    school = serializers.StringRelatedField()
    school_id = serializers.PrimaryKeyRelatedField(queryset=School.objects.all(), source='school', required=False)
    bus = serializers.StringRelatedField()
    bus_id = serializers.PrimaryKeyRelatedField(queryset=Bus.objects.filter(), source='bus', required=False)
    class Meta:
        model = Student
        fields = ('id', 'first_name', 'last_name', 'age', 'grade', 'school', 'school_id', 'bus', 'bus_id', 'picture', 'parent_one', 'parent_two', 'parent_one_id', 'parent_two_id','track')
        read_only_fields = ('id', 'school', 'bus', 'parent_on', 'parent_two')

class EventSerializer(serializers.ModelSerializer):
    device = serializers.StringRelatedField()
    device_id = serializers.PrimaryKeyRelatedField(queryset=Device.objects.all(), source='device', required=False)
    student = serializers.StringRelatedField()
    student_id = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all(), source='student', required=False)
    class Meta:
        model = Event
        fields = ('id', 'timestamp', 'enter', 'picture', 'device', 'device_id', 'student', 'student_id')
        read_only_fields = ('id', 'timestamp', 'device', 'student')

class BusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bus
        fields = ('id','name',)
        
class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ('id','name', 'address', 'city', 'state', 'zipcode')
