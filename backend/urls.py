from django.urls import path
from . import views,auth

urlpatterns = [
    path('',views.index, name="index"),
    path('Sign-Up',auth.register, name="register"),
    path('Add/Course',views.addCourse, name="add_course"),
]
