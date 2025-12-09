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
    path('Student/Course-Delete/<int:id>/',views.delete_course, name="deleted"),
    path('Timetable/view',views.timetable, name="table"),
    path('Student/Transcript',views.transcript, name="transc"),
    path('course-grading/<str:courseCode>/',views.course_grades, name="course_grade"),
]
