from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response 
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .models import Student,Lecturer,Admin,Department
from .serializer import SignupSerializer,UsersSerializer,AdminStudentSerializer,StudentUpdateSerializer
from .serializer import AdminLecturerSerializer
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

import random

def get_token(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    }

def generate_code(type):
    number = random.randint(10000, 99999) 
    if type == "student":
        return f"STU-{number}"
    elif type == "lecturer":
        return f"LEC-{number}"
    elif type == "admin":
        return f"ADM-{number}"

@api_view(['POST'])
def signup(request):
    serializer = SignupSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data

    try:
        department = Department.objects.get(id=data['department'])
    except Department.DoesNotExist:
        return Response({"error": "Department not found"}, status=status.HTTP_404_NOT_FOUND)

    usercode = generate_code(data['type'])
    while User.objects.filter(username=usercode).exists():
        usercode = generate_code(data['type'])

    user = User.objects.create_user(
        username=usercode,
        email=data['email'],
        password=data['password1'],
        first_name=data['first_name'],
        last_name=data['last_name']
    )

    if data['type'] == "student":
        Student.objects.create(user=user, department=department, phone=data['phone'])
    elif data['type'] == "lecturer":
        Lecturer.objects.create(user=user, department=department, phone=data['phone'], degree=data['degree'])
    elif data['type'] == "admin":
        Admin.objects.create(user=user, department=department, phone=data['phone'])

    tokens = get_token(user)
    return Response({
        'message': "Account Created Successfully",
        'usercode': usercode,
        **tokens
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def departments(request):
    deps = Department.objects.all()
    data = [{"id": str(d.id), "name": d.depName} for d in deps]
    return Response(data)

@api_view(['GET'])
def degrees(request):
    data = [
        {'value': value, 'display': display}
        for value, display in Lecturer.DegreeChoice.choices
    ]
    return Response(data)

@api_view(["POST"])
def signin(request):
    usercode = request.data.get("usercode")
    password = request.data.get("password")

    if not usercode or not password:
        return Response(
            {"error": "Usercode and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=usercode, password=password)

    if not user:
        return Response(
            {"error": "Invalid usercode or password"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if hasattr(user, 'student'):
        user_type = "student"
    elif hasattr(user, 'lecturer'):
        user_type = "lecturer"
    elif hasattr(user, 'admin'):
        user_type = "admin"
    else:
        user_type = "unknown"

    tokens = get_token(user)
    return Response({
        "message": "Login Successful",
        "usercode": user.username,
        "type": user_type,
        **tokens
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])  
def get_student(request):
    user = request.user
    student= user.student
    return Response({
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'phone': user.student.phone,  
        'department':student.department.depName
    })
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_lecturer(request):
    user = request.user

    if not hasattr(user, 'lecturer'):
        return Response(
            {"error": "This account is not a lecturer"},
            status=status.HTTP_403_FORBIDDEN
        )

    lecturer = user.lecturer
    return Response({
        'usercode': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'phone': lecturer.phone,
        'department': lecturer.department.depName,
        'degree': lecturer.get_degree_display(),
    })
@api_view(["GET"])
def getusers(request):
    users= User.objects.all()
    serializer=UsersSerializer(users, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_admin(request):
    user= request.user

    if not hasattr(user,'admin'):
        return Response({"error":"You are not allowed to access this Page"},
                        status=status.HTTP_403_FORBIDDEN)
    
    admin= user.admin
    
    return Response({
        'usercode': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'phone': admin.phone,
        'department': admin.department.depName,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_students(request):
    students = Student.objects.all().select_related('user', 'department')
    serializer = AdminStudentSerializer(students, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_student_detail(request, pk):
    student = get_object_or_404(Student, id=pk)
    serializer = AdminStudentSerializer(student)
    return Response(serializer.data)


@api_view(["PUT"])                           
@permission_classes([IsAuthenticated])
def admin_update_student(request, pk):
    student = get_object_or_404(Student, id=pk)
    serializer = StudentUpdateSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data


    student.user.email      = data['email']
    student.user.first_name = data['first_name']
    student.user.last_name  = data['last_name']
    student.user.save()


    student.phone = data['phone']

    department = get_object_or_404(Department, depName=data['department'])
    student.department = department
    student.save()

    return Response({"message": "Student updated successfully"}, status=status.HTTP_200_OK)



@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def admin_delete_student(request, pk):
    student = get_object_or_404(Student, id=pk)
    student.user.delete()   
    return Response({"message": "Student deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_lectures(request):
    lecturers = Lecturer.objects.all().select_related('user', 'department')
    serializer = AdminLecturerSerializer(lecturers, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_lecturer_details(request,pk):
    lecturer= get_object_or_404(lecturer,id=pk)
    serializer= AdminLecturerSerializer(lecturer,many=True)
    return Response(serializer.data)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_lecturers(request,pk):
    serializer= StudentUpdateSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    data= serializer.validated_data

    lecturer= get_object_or_404(Lecturer,id=pk)
    lecturer.user.email = data['email']
    lecturer.user.first_name = data['first_name']
    lecturer.user.last_name = data['last_name']
    lecturer.user.save()

    lecturer.phone= data['phone']
    lecturer.degree= data['degree']
    department= get_object_or_404(Department, depName=data['department'])

    lecturer.department= department

    lecturer.save()

    return Response({
        "success":"Lecturer Updated Successfully"
    }, status=status.HTTP_200_OK)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_lecturers(request,pk):
    pass