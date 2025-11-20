from django.contrib.auth import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class SignupForm(UserCreationForm):
    class meta:
        model= User
        fields=['username','password1','password2']