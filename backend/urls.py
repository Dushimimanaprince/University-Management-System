from django.urls import path
from . import views,auth

urlpatterns = [
    path('',views.index, name="index"),
    path('Sign-Up',auth.register, name="register"),
    path('Sign-In',auth.signin, name="signin"),
    path('Add/Course',views.addCourse, name="add_course"),
    path('Leturers-Portal',views.teachers, name="teacher"),
    path('Admins-Portal',views.admins, name="admin"),
    path('Register-Courses',views.courses, name="courses"),
    path('Timetable/view',views.timetable, name="table"),
    path('course-grading/<str:courseCode>/',views.course_grades, name="course_grade"),
]
