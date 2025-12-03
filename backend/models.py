from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone



class Lecturer(models.Model):

    gender_choices= [('male','Male'),('female','Female')]
    degree= [('A0','A0'),
             ('masters','Masters'),
             ('phd','PHD')]
    user= models.OneToOneField(User, on_delete=models.CASCADE)
    LecturerID= models.IntegerField(unique=True)
    first_name= models.CharField(max_length=40)
    last_name= models.CharField(max_length=40)
    dateOfBirth= models.DateField()
    email= models.EmailField(unique=True)
    phone= models.CharField(max_length=12)
    gender= models.CharField(max_length=10, choices= gender_choices)
    degree= models.CharField(max_length=10, choices=degree)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f" {self.first_name} {self.last_name}"
    
class Admin(models.Model):
    gender_choices= [('male','Male'),('female','Female')]
    user= models.OneToOneField(User, on_delete=models.CASCADE)
    adminID= models.IntegerField(unique=True)
    first_name= models.CharField(max_length=40)
    last_name= models.CharField(max_length=40)
    dateOfBirth= models.DateField()
    email= models.EmailField(unique=True)
    phone= models.CharField(max_length=12)
    gender= models.CharField(max_length=10, choices= gender_choices)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f" {self.first_name} {self.last_name}"
    
  

class Faculity(models.Model):
    FaculiryID= models.CharField(max_length=12, unique=True)
    FaculiryName= models.CharField(max_length=20)

    def __str__(self):
        return self.FaculiryName

class Department(models.Model):
    Faculity= models.ForeignKey(Faculity, on_delete=models.CASCADE)
    DepID= models.CharField(max_length=20,unique=True)
    DepName= models.CharField(max_length=30)

    def __str__(self):
        return self.DepName

class Student(models.Model):
    department= models.ForeignKey(Department, on_delete=models.CASCADE, default=1)
    gender_choices= [('male','Male'),('female','Female')]
    user= models.OneToOneField(User, on_delete=models.CASCADE)
    studentID= models.IntegerField(unique=True)
    first_name= models.CharField(max_length=40)
    last_name= models.CharField(max_length=40)
    dateOfBirth= models.DateField()
    email= models.EmailField(unique=True)
    phone= models.CharField(max_length=12)
    gender= models.CharField(max_length=10, choices= gender_choices)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f" {self.first_name} {self.last_name}"


class Room(models.Model):
    room_number = models.CharField(max_length=10, unique=True)
    building = models.CharField(max_length=50)
    capacity = models.IntegerField()
    
    def __str__(self):
        return f"{self.building} - {self.room_number}"


class Course(models.Model):
    DAY_CHOICES = [
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
    ]

    TIME_CHOICES = [
        ('08:30', '08:30'),
        ('11:30', '11:30'),
        ('14:30', '14:30'),
        ('18:00', '18:00'),
    ]

    department= models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True
    )
    courseCode= models.CharField(max_length=12, unique=True)
    courseName= models.CharField(max_length=45)
    courseDay=  models.CharField(max_length=20, choices=DAY_CHOICES)
    courseTime=  models.CharField(max_length=20, choices=TIME_CHOICES)
    lecturer= models.ManyToManyField(Lecturer, related_name='courses')
    credits= models.PositiveBigIntegerField(default=3)
    room= models.ForeignKey(Room, on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return f" {self.courseCode} --> {self.courseName}"
  

class Enrollment(models.Model):

    student= models.ForeignKey(Student,on_delete=models.CASCADE)
    course= models.ForeignKey(Course,on_delete=models.CASCADE)
    enrollDate= models.DateField(auto_now_add=True)
    active= models.BooleanField(default=True)

    class Meta:
        unique_together=('student', 'course')

    def __str__(self):
        return f" {self.student} enrolled in {self.course}"
    
class Grade(models.Model):

    enrollment= models.OneToOneField(Enrollment, on_delete=models.CASCADE)
    assignment= models.FloatField(default=0)
    quiz= models.FloatField(default=0)
    attendance=models.FloatField(default=0)
    mid_term= models.FloatField(default=0)
    final_exam= models.FloatField(default=0)
    score= models.FloatField(default=0)
    rating= models.CharField(max_length=2)

    def __str__(self):
        return f"{self.enrollment.student} → {self.enrollment.course} : {self.score} ({self.rating})"
    
class EmailValidation(models.Model):
    roles_choices= [('lecturer','Lecturer'),('admin','Admin')]
    email= models.EmailField(unique=True)
    role= models.CharField(max_length=12, choices=roles_choices)

    def __str__(self):
        return f"{self.email} role {self.role}"
    


class Finance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    status_choices = [('paid','Paid'), ('unpaid','Unpaid')]
    status = models.CharField(max_length=10, choices=status_choices, default='unpaid')
    description = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.student} → {self.amount} ({self.status})"

    


