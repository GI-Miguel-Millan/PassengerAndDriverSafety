from django.contrib import admin
from .models import Parent, Device, Event, Bus, Student, School
from django.contrib.auth.admin import UserAdmin
from .models import User

admin.site.register(User, UserAdmin)
admin.site.register(Parent)
admin.site.register(Device)
admin.site.register(Event)
admin.site.register(Bus)
admin.site.register(Student)
admin.site.register(School)
