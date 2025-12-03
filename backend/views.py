from django.shortcuts import render,get_object_or_404,redirect
from .models import *
import json
from django.db.models import Sum
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required

@login_required(login_url='signin')
def index(request):

    student= get_object_or_404(Student, user=request.user)
    enrollment= Enrollment.objects.filter(student=student).select_related('course')

    credits= enrollment.aggregate(total=Sum('course__credits'))['total'] or 0
    total_fee= credits * 19200

    context={'student':student,
             'enrollment':enrollment,
             'total_fee':total_fee}

    return render (request,'school/student.html',context)

@login_required
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


@login_required
def teachers(request):
    lecturer = get_object_or_404(Lecturer, user=request.user)
    enrollment= lecturer.courses.all()
    count= enrollment.count()
    students= Enrollment.objects.filter(
        course__lecturer=lecturer,
        active=True
    ).values('student').count()
    
    context= {
        'lecturer':lecturer,
        'enrollment':enrollment,
        'count':count,
        'students':students
    }
    return render(request,'school/teacher.html',context)


@login_required
def admins(request):
    admins= get_object_or_404(Admin, user=request.user)

    context={'admins':admins}
    return render(request, 'school/admin.html',context)

@login_required
def courses(request):

    if request.method == "POST":
        departmentID= request.POST.get('department')
        courseCode= request.POST.get('courseCode')
        courseName= request.POST.get('courseName')
        credits= request.POST.get('credits')
        courseDay= request.POST.get('courseDay')
        courseTime= request.POST.get('courseTime')
        lecturerID= request.POST.get('lecturer')
        roomID= request.POST.get('room')

        department= Department.objects.get(id=departmentID)
        room= Room.objects.get(id=roomID)
        lecturers= Lecturer.objects.get(id__in=lecturerID)


        conflict= Course.objects.filter(
            courseDay= courseDay,
            courseTime= courseTime,
            room= room
        ).exists()

        if conflict:
            return HttpResponse("""
                    <script>There is courses which are have conflict</script>                
                """)
        
        lecturer_conflict = Course.objects.filter(
            courseDay=courseDay,
            courseTime=courseTime,
            lecturer=lecturers
        ).exists()

        if lecturer_conflict:
            return HttpResponse("""
                <script>
                    alert("This lecturer already has another course at this time!");
                    window.history.back();
                </script>
            """)
        
        course= Course.objects.create(
                department=department,
                courseCode=courseCode,
                courseName=courseName,
                courseDay=courseDay,
                courseTime=courseTime,
                credits=credits,
                room=room
            )

        course.lecturer.add(lecturers)

    rooms= Room.objects.all()
    teachers= Lecturer.objects.all()
    courses= Course.objects.all()
    departments= Department.objects.all()

    context={
            'rooms':rooms,
            'teachers':teachers,
            'courses':courses,
            'departments':departments,
        }


    return render(request, 'school/courses.html', context)

@login_required
def timetable(request):
    
    return render(request ,'school/timetable.html')


def course_grades(request,courseCode):
    course= get_object_or_404(Course, courseCode=courseCode)

    enrollment= Enrollment.objects.filter(
        course=course,
        active=True
    )

    if request.method == "POST":
        if "save_row" in request.POST:
            student_id= request.POST.get("save_row")

            enroll = Enrollment.objects.filter(
                 student__studentID= student_id,
                 course= course,
                 active=True
            ).first()

            if not enroll:
                   return redirect(request.path)

            assignment= float(request.POST.get(f"assignments_{student_id}",) or 0)
            quiz= float(request.POST.get(f"quiz_{student_id}") or 0)
            attendance= float(request.POST.get(f"attendance_{student_id}")or 0)
            mid= float(request.POST.get(f"mid_{student_id}")or 0)
            final= float(request.POST.get(f"final_{student_id}")or 0)

            if not final:
                return redirect(request.path)

            total= (
                        assignment + quiz + attendance + mid + final
                    )
            if total > 100:

                return HttpResponse("""
                    <script>
                        alert('You can't upload above >100 marks');
                                
                        </script>
                        """)
            
            if total >=80:
                grade= 'A'
            elif total >=70:
                grade= 'B'
            elif total >=60:
                grade= 'C'
            elif total >=50:
                grade= 'D'
            else:
                grade ='F'

            Grade.objects.create(
                enrollment= enroll,
                assignment=assignment,
                quiz=quiz,
                attendance=attendance,
                mid_term= mid,
                final_exam= final,
                score= total,
                rating= grade
            )
            
            enroll.active= False
            enroll.save()
            return redirect(request.path)
        
        if "delete_row" in request.POST:
             student_id= request.POST.get("delete_row")

             enroll= Enrollment.objects.filter(
                  student__studentID= student_id,
                  course=course,
                  active=True
             )
             if enroll : 
                  enroll.delete()
                  return redirect(request.path)
        
                
                    
    context={
        'course':course,
        'enrollment':enrollment
    }

    return render(request,'school/grades.html',context)