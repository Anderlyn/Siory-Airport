from django.shortcuts import render
from django.http import HttpResponse


def index(request):
  return HttpResponse("Hi there this is an Python app!")