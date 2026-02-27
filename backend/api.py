import requests 
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib import messages
from .models import Finance, Student

def pay_fees(request):
    student = get_object_or_404(Student, user=request.user)
    finance_record = Finance.objects.filter(student=student, status='unpaid').first()
    context= {}

    if request.method == "POST":
        if not finance_record:            
            context["error"]= "You have no unpaid fees."
            return render(request, "school/payment.html")

        student_acc = request.POST.get("bankCode")
        amount = request.POST.get("amount")
        university_acc = "20250101"

        api_url = "http://127.0.0.1:8001/api/process-payments/"

        payload = {
            "student_account": student_acc,
            "university_account": university_acc,
            "amount": str(amount)
        }

        try:
            response = requests.post(api_url, json=payload)
            response_data = response.json()

            if response.status_code == 200 and response_data.get('status') == 'success':
                finance_record.status = "paid"
                finance_record.save()
                context["success"]= response_data.get("success", "Payment Approved")
                return redirect("index") 
            
            else:
                error_message = response_data.get('error', 'Unknown error occurred.')
                context["error"]= response_data.get("error","Something went wrong")

        except requests.exceptions.RequestException:
            context["error"]="Could not connect to the micro-finance system. Make sure it is running!"

    return render(request, "school/payment.html",context)