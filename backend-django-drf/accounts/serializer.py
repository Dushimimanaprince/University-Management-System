from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Student, Lecturer, Admin
from app.models import Department
from django.contrib.auth.models import User

class SignupSerializer(serializers.Serializer):
    email      = serializers.EmailField()
    password1  = serializers.CharField(write_only=True)
    password2  = serializers.CharField(write_only=True)
    first_name = serializers.CharField(max_length=50)
    last_name  = serializers.CharField(max_length=50)
    phone      = serializers.CharField(max_length=15)
    type       = serializers.ChoiceField(choices=["student", "lecturer", "admin"])
    department = serializers.CharField()
    degree     = serializers.ChoiceField(
                    choices=["Bac", "Mast", "Phd"],
                    required=False,
                    allow_blank=True
                )

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords don't match"})
        if data['type'] == 'lecturer' and not data.get('degree'):
            raise serializers.ValidationError({"degree": "Degree is required for lecturers"})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Email already registered"})
        return data
    
class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model= User
        fields= [
            'username','email','first_name','last_name'
        ]


class AdminStudentSerializer(serializers.ModelSerializer):
    id         = serializers.UUIDField(source='user.id', read_only=True) 
    username   = serializers.CharField(source='user.username')
    email      = serializers.EmailField(source='user.email')
    first_name = serializers.CharField(source='user.first_name')
    last_name  = serializers.CharField(source='user.last_name')
    department = serializers.CharField(source='department.depName')
    phone      = serializers.CharField()

    class Meta:
        model  = Student
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'department', 'phone']
        
class StudentUpdateSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    phone= serializers.CharField()
    department= serializers.CharField()
    degree= serializers.CharField()

class AdminLecturerSerializer(serializers.ModelSerializer):
    id         = serializers.UUIDField(read_only=True) 
    username   = serializers.CharField(source='user.username')
    email      = serializers.EmailField(source='user.email')
    first_name = serializers.CharField(source='user.first_name')
    last_name  = serializers.CharField(source='user.last_name')
    department = serializers.CharField(source='department.depName')
    degree = serializers.CharField(source='get_degree_display', read_only=True)
    phone      = serializers.CharField()

    class Meta:
        model  = Lecturer
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'department','degree','phone']

