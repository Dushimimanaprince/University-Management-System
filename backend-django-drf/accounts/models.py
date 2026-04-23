from django.db import models
import uuid
from django.contrib.auth.models import User


class BaseModel(models.Model):
    id= models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    class Meta:
        abstract= True

class Department(models.Model):
    depName= models.CharField()


class Lecturer(BaseModel):
    class DegreeChoice(models.TextChoices):
        BACHELORS = "Bac", "Bachelors"
        MASTERS = "Mast", "Masters"
        PHD = "Phd", "PhD"

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    degree = models.CharField(max_length=10, choices=DegreeChoice.choices)
    phone = models.CharField(max_length=15, unique=True)

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.lecture_code})"


class Student(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)

    phone = models.CharField(max_length=15, unique=True)

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.student_code})"


class Admin(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15, unique=True)

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.admin_code})"