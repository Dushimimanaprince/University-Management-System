from django.urls import path
from . import views

urlpatterns = [

    path('lecturers/', views.get_lecturers),
    path('register/course/', views.register_course),
    path('courses/', views.get_all_courses),    
    path('courses/<uuid:pk>/', views.get_course),  
    path('courses/<uuid:course_id>/enroll/', views.add_course),
    path('enrolled/',views.enrolled_courses),
    path('lecturer/courses/',views.lectures_courses),
    path('course/<uuid:pk>/students/', views.lecturer_course_details),
    path("course/<uuid:course_id>/students/<uuid:student_id>/grade/", views.grading),

]