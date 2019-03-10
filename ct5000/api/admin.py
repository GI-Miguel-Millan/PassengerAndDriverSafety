from django.contrib import admin


from .models import Parent, Device, Event, Bus, Driver, Student, School
# Register your models here.

admin.site.register(Parent)
admin.site.register(Event)
admin.site.register(Device)
admin.site.register(Bus)
admin.site.register(Driver)
admin.site.register(Student)
admin.site.register(School)
