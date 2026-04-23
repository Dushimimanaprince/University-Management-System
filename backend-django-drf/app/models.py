
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

from accounts.models import Lecturer, Student,BaseModel,Department

class Course(BaseModel):
    class TimeChoices(models.TextChoices):
        MORNING = "08:30", "8:30 AM"
        MIDDAY = "11:00", "11:00 AM"
        AFTERNOON = "14:30", "2:30 PM"
        EVENING = "18:30", "6:30 PM"

    class DayChoices(models.TextChoices):
        MONDAY = "Mon", "Monday"
        TUESDAY = "Tue", "Tuesday"
        WEDNESDAY = "Wed", "Wednesday"
        THURSDAY = "Thu", "Thursday"
        FRIDAY = "Fri", "Friday"

    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    course_code = models.CharField(max_length=10, unique=True)
    course_name = models.CharField(max_length=100) 
    course_time = models.CharField(max_length=5, choices=TimeChoices.choices)
    course_day = models.CharField(max_length=3, choices=DayChoices.choices)
    credits = models.IntegerField()
    lecturer = models.ForeignKey(Lecturer, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.course_name} ({self.course_code})"


class Enrollment(BaseModel):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    active= models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["student", "course"], name="unique_enrollment")
        ]

    def __str__(self):
        return f"{self.student} → {self.course}"


class Grade(BaseModel):
    enrollment = models.OneToOneField(Enrollment, on_delete=models.CASCADE)
    assignment = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    midterm = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    quiz = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    final_exam = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    score= models.DecimalField(max_digits=8,decimal_places=2,default=False)

    def __str__(self):
        return f"Grade for {self.enrollment} — {self.score}"


class Payment(BaseModel):
    class StatusChoices(models.TextChoices):
        PENDING = "Pend", "Pending"
        COMPLETED = "Comp", "Completed"
        FAILED = "Fail", "Failed"

    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    enrollment = models.ForeignKey(Enrollment, on_delete=models.SET_NULL, null=True)  
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=StatusChoices.choices, default=StatusChoices.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return f"{self.student} — {self.amount} ({self.status})"