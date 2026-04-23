from django.urls import path
from . import views

urlpatterns = [
    path('departments/', views.departments),
    path('degrees/', views.degrees),
    path('signup/', views.signup),
    path('signin/', views.signin),
    path("student-portal/",views.get_student),
    path('lecturer-portal/', views.get_lecturer),
    path('users/',views.getusers),
    path('admin/',views.get_admin),
    path('admin/students/', views.admin_students),
    path('admin/students/<uuid:pk>/',          views.admin_student_detail),
    path('admin/students/<uuid:pk>/update/',   views.admin_update_student),
    path('admin/students/<uuid:pk>/delete/',   views.admin_delete_student),
    path('admin/lecturers/', views.admin_lectures),
    path('admin/lecturers/<uuid:pk>/',   views.admin_lecturer_details),
    path('admin/lecturers/<uuid:pk>/update/',   views.update_lecturers),
    path('admin/lectures/<uuid:pk>/delete/',   views.delete_lecturers),



]   
