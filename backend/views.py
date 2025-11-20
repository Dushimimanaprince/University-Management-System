from django.shortcuts import render,get_object_or_404,redirect
from .models import *
import json
from django.db.models import Sum


def index(request):

    student= get_object_or_404(Student, user=request.user)
    enrollment= Enrollment.objects.filter(student=student).select_related('course')

    credits= enrollment.aggregate(total=Sum('course__credits'))['total'] or 0
    total_fee= credits * 19200

    context={'student':student,
             'enrollment':enrollment,
             'total_fee':total_fee}

    return render (request,'school/student.html',context)

def addCourse(request):

    student= Student.objects.get(user=request.user)
    if request.method == "POST":
        raw_data = request.POST.get('course')  
        course_data = json.loads(raw_data)
        courseCode= course_data['code']

        course= Course.objects.get(courseCode=courseCode)


        Enrollment.objects.create(
            student=student,
            course=course,
        )
        
        
    enrollment= Enrollment.objects.filter(student=student).select_related('course')
    courses= Course.objects.all()
    context= {
        'courses':courses,
        'enrollment':enrollment
    }
    return render(request, 'school/addCourse.html', context)
