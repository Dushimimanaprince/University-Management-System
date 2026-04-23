from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Course,Enrollment,Grade
from accounts.models import Lecturer,Student,Admin
from accounts.models import Department
from .serializer import RegisterCourseSerializer,CourseSerializer,EnrollmentSerializer,EnrollmentLecturerSerializer,GradingSerializer
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_course(request):
    serializer = RegisterCourseSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data

    try:
        department = Department.objects.get(id=data['department'])
    except Department.DoesNotExist:
        return Response({"error": "Department not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        lecturer = Lecturer.objects.get(user__username=data['lecturer'])
    except Lecturer.DoesNotExist:
        return Response({"error": "Lecturer not found"}, status=status.HTTP_404_NOT_FOUND)

    course = Course.objects.create(
        department=department,
        course_name=data['course_name'],
        course_code=data['course_code'],
        course_day=data['course_day'],
        course_time=data['course_time'],
        credits=data['credits'],
        lecturer=lecturer,       
    )

    return Response({
        "message": "Course created successfully",
        "course_code": course.course_code,
        "course_name": course.course_name,
    }, status=status.HTTP_201_CREATED) 


@api_view(['GET'])
def get_lecturers(request):
    lecturers = Lecturer.objects.select_related('user').all()
    data = [
        {
            "usercode": l.user.username,
            "name": f"{l.user.first_name} {l.user.last_name}",
            "department": l.department.depName,
            "degree": l.get_degree_display(),
        }
        for l in lecturers
    ]
    return Response(data)



@api_view(["GET"])
def get_course(request, pk):
    try:
        course = Course.objects.get(pk=pk)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = CourseSerializer(course)
    return Response(serializer.data)


@api_view(["GET"])
def get_all_courses(request):
    courses = Course.objects.select_related('department', 'lecturer__user').all()
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_course(request, course_id):
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

    student = get_object_or_404(Student, user=request.user)


    if Enrollment.objects.filter(student=student, course=course).exists():
        return Response(
            {"error": "You are already enrolled in this course"},
            status=status.HTTP_400_BAD_REQUEST
        )

    time_conflict = Enrollment.objects.filter(
        student=student,
        course__course_day=course.course_day,
        course__course_time=course.course_time,
    ).exists()

    if time_conflict:
        return Response(
            {"error": f"You already have a course on {course.get_course_day_display()} at {course.get_course_time_display()}"},
            status=status.HTTP_400_BAD_REQUEST
        )

    enroll = Enrollment.objects.create(student=student, course=course)
    serializer = EnrollmentSerializer(enroll)
    return Response(serializer.data, status=status.HTTP_201_CREATED)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def enrolled_courses(request):
    student = get_object_or_404(Student, user=request.user)
    enrollments = Enrollment.objects.filter(student=student).select_related('course__department', 'course__lecturer__user')
    serializer = EnrollmentSerializer(enrollments, many=True)  
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def lectures_courses(request):

    lecturer=  get_object_or_404(Lecturer,user=request.user)
    courses= Course.objects.filter(lecturer=lecturer)
    serializer= CourseSerializer(courses, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def lecturer_course_details(request, pk):

    lecturer = get_object_or_404(Lecturer, user=request.user)

    try:
        course = Course.objects.get(id=pk, lecturer=lecturer)
    except Course.DoesNotExist:
        return Response(
            {"error": "Course not found or not assigned to you"},
            status=status.HTTP_404_NOT_FOUND
        )

    enrolled = Enrollment.objects.filter(course=course,active=True).select_related(
        'student__user', 'course'
    )
    serializer = EnrollmentLecturerSerializer(enrolled, many=True)  

    return Response({
        "course_name": course.course_name,
        "course_code": course.course_code,
        "total_students": enrolled.count(),
        "students": serializer.data,
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def grading(request, student_id, course_id):       
    serializer = GradingSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    score = data['assignment'] + data['quiz'] + data['midterm'] + data['final_exam']

    lecturer   = get_object_or_404(Lecturer, user=request.user)
    student    = get_object_or_404(Student, id=student_id)
    course     = get_object_or_404(Course, id=course_id, lecturer=lecturer)
    enrollment = get_object_or_404(Enrollment, student=student, course=course)

    grade, created = Grade.objects.update_or_create(
        enrollment=enrollment,
        defaults={
            "assignment": data['assignment'],
            "midterm":    data['midterm'],
            "quiz":       data['quiz'],
            "final_exam": data['final_exam'],
            "score":      score,
        }
    )

    enrollment.active = False
    enrollment.save()

    return Response({
        "message": "Grade saved successfully",
        "score": score,
        "created": created,
    }, status=status.HTTP_200_OK)

