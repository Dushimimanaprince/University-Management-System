from rest_framework import serializers
from .models import Course,Enrollment
from accounts.models import Lecturer

class RegisterCourseSerializer(serializers.Serializer):
    department  = serializers.CharField()
    course_code = serializers.CharField(max_length=10)
    course_name = serializers.CharField(max_length=100)
    course_time = serializers.ChoiceField(choices=Course.TimeChoices.choices)
    course_day  = serializers.ChoiceField(choices=Course.DayChoices.choices)
    credits     = serializers.IntegerField()
    lecturer    = serializers.CharField()  

    def validate(self, data):
        try:
            lecturer = Lecturer.objects.get(user__username=data['lecturer'])
        except Lecturer.DoesNotExist:
            raise serializers.ValidationError({"lecturer": "Lecturer not found"})


        if Course.objects.filter(
            course_time=data['course_time'],
            course_day=data['course_day'],
            lecturer=lecturer
        ).exists():
            raise serializers.ValidationError(
                {"error": "This lecturer already has a course at that time and day"}
            )

        if Course.objects.filter(course_code=data['course_code']).exists():
            raise serializers.ValidationError(
                {"course_code": "A course with this code already exists"}
            )

        return data
    

class CourseSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.depName', read_only=True)
    lecturer_name   = serializers.SerializerMethodField()
    course_time_display = serializers.CharField(source='get_course_time_display', read_only=True)
    course_day_display  = serializers.CharField(source='get_course_day_display', read_only=True)

    class Meta:
        model  = Course
        fields = [
            'id', 'course_code', 'course_name', 'department_name',
            'lecturer_name', 'course_time', 'course_time_display',
            'course_day', 'course_day_display', 'credits'
        ]

    def get_lecturer_name(self, obj):
        if obj.lecturer:
            return f"{obj.lecturer.user.first_name} {obj.lecturer.user.last_name}"
        return None



class EnrollmentSerializer(serializers.ModelSerializer):
    course_name         = serializers.CharField(source='course.course_name', read_only=True)
    course_code         = serializers.CharField(source='course.course_code', read_only=True)
    department          = serializers.CharField(source='course.department.depName', read_only=True)
    lecturer_name       = serializers.SerializerMethodField()
    course_day          = serializers.CharField(source='course.get_course_day_display', read_only=True)
    course_time         = serializers.CharField(source='course.get_course_time_display', read_only=True)
    credits             = serializers.IntegerField(source='course.credits', read_only=True)

    class Meta:
        model  = Enrollment
        fields = [
            'id', 'course_name', 'course_code', 'department',
            'lecturer_name', 'course_day', 'course_time',
            'credits', 'enrolled_at'
        ]

    def get_lecturer_name(self, obj):
        if obj.course.lecturer:
            return f"{obj.course.lecturer.user.first_name} {obj.course.lecturer.user.last_name}"
        return "—"
    

class EnrollmentLecturerSerializer(serializers.ModelSerializer):
    student_id    = serializers.UUIDField(source='student.id', read_only=True)  # ✅ add this
    student_code  = serializers.CharField(source='student.user.username', read_only=True)
    student_fname = serializers.CharField(source='student.user.first_name', read_only=True)
    student_lname = serializers.CharField(source='student.user.last_name', read_only=True)
    course_name   = serializers.CharField(source='course.course_name', read_only=True)
    course_code   = serializers.CharField(source='course.course_code', read_only=True)
    course_day    = serializers.CharField(source='course.get_course_day_display', read_only=True)
    course_time   = serializers.CharField(source='course.get_course_time_display', read_only=True)

    class Meta:
        model  = Enrollment
        fields = [
            'id',
            'student_id',   
            'student_code',
            'student_fname',
            'student_lname',
            'course_name',
            'course_code',
            'course_day',
            'course_time',
            'enrolled_at',
        ]
class GradingSerializer(serializers.Serializer):

    assignment= serializers.FloatField()
    midterm= serializers.FloatField()
    quiz= serializers.FloatField()
    final_exam= serializers.FloatField()
    
    def validate(self,data):

        if (data['assignment'] >=20):
            raise serializers.ValidationError({"error":"Assignment must have grades under 20"})
        
        if (data['quiz'] >=10):
            raise serializers.ValidationError({"error":"Quiz must have grades under 10"})
        
        if (data['midterm'] >=30):
            raise serializers.ValidationError({"error":"Mid-Terms must have grades under 30"})
        
        if (data['final_exam'] >=40):
            raise serializers.ValidationError({"error":"Final exam must have grades under 40"})
        
        return data
    

