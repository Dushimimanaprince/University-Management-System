from django.shortcuts import render, redirect
import datetime
from .models import *
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login,logout
from .forms import SignupForm
from django.http import HttpResponse

def register(request):

    if request.method == "POST":
        form = SignupForm(request.POST, request.FILES)

        if form.is_valid():
            

            # Get form fields (correct names!)
            role = request.POST.get("role")
            email = request.POST.get("email")
            first_name = request.POST.get("firstName")
            last_name = request.POST.get("lastName")
            dateOfBirth = request.POST.get("dateOfBirth")
            phone = request.POST.get("phone")
            gender = request.POST.get("gender")
            degree= request.POST.get("degree")

            # Email validation
            if role in ["lecturer", "admin"]:
                try:
                    EmailValidation.objects.get(email=email, role=role)
                except EmailValidation.DoesNotExist:
                    return HttpResponse("<script>alert('Your email is not approved for this role!'); window.history.back();</script>")

            # Generate ID
            year = str(datetime.date.today().year)[-2:]

            if role == "student":
                type_code = 1
                count = Student.objects.filter(created_at__year=datetime.date.today().year).count() + 1
            elif role == "lecturer":
                type_code = 2
                count = Lecturer.objects.filter(created_at__year=datetime.date.today().year).count() + 1
            elif role == "admin":
                type_code = 3
                count = Admin.objects.filter(created_at__year=datetime.date.today().year).count() + 1
            else:
                return HttpResponse("<script>alert('Invalid role selected!'); window.history.back();</script>")

            sequence = str(count).zfill(2)
            final_id = f"{year}{type_code}{sequence}"
            user = form.save()



            if role == "student":
                departmentID = request.POST.get("department")
                if not departmentID:
                    return HttpResponse("<script>alert('Please select a department!'); window.history.back();</script>")

                department_obj = Department.objects.get(id=departmentID)

                Student.objects.create(
                    user=user,
                    department=department_obj,
                    studentID=int(final_id),
                    first_name=first_name,
                    last_name=last_name,
                    dateOfBirth=dateOfBirth,
                    email=email,
                    phone=phone,
                    gender=gender
                )

            elif role == "lecturer":
                Lecturer.objects.create(
                    user=user,
                    LecturerID=int(final_id),
                    first_name=first_name,
                    last_name=last_name,
                    dateOfBirth=dateOfBirth,
                    email=email,
                    phone=phone,
                    gender=gender,
                    degree= degree
                )

            elif role == "admin":
                Admin.objects.create(
                    user=user,
                    adminID=int(final_id),
                    first_name=first_name,
                    last_name=last_name,
                    dateOfBirth=dateOfBirth,
                    email=email,
                    phone=phone,
                    gender=gender
                )
            login(request, user)
            return redirect("signin")

    else:
        form = SignupForm()

    departmentz = Department.objects.all()

    return render(request, 'school/Auth.html', {
        'form': form,
        'departmentz': departmentz
    })

def signin(request):
    if request.method == "POST":
        form = AuthenticationForm(request, data= request.POST)
        if form.is_valid():
            user= form.get_user()
            login(request,user)
            if hasattr (user,'student'):
                return redirect('index')
            elif hasattr(user,'lecturer'):
                return redirect('teacher')
            elif hasattr(user, 'admin'):
                return redirect('admin')
            else:
                return HttpResponse("""
                    <script>
                        alert('You do not have a valid role!');
                        window.location.href='/signin/';
                    </script>
                """)

        else:
            # Wrong credentials
            return HttpResponse("""
                <script>
                    alert('Wrong username or password!');
                    window.location.href='/signin/';
                </script>
            """)

    else:
        form = AuthenticationForm()

    context=  {'form': form}

    return render(request, 'school/login.html',context)


