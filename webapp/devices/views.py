from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.template import loader

from .models import Device

# Create your views here.

@login_required(login_url='login')
def index(request):
    # Ordered by registration date, most recent
    deviceList = Device.objects.order_by('-regDate')

    context = {
        'deviceList': deviceList,
        }
    
    return render(request, 'devices/index.html', context)

@login_required(login_url='login')
# Displays the information stored in the database entry, show video list as well?
def detail(request, device_name):
    device = get_object_or_404(Device, name=device_name)
    
    return render(request, 'devices/detail.html', {'device': device})
