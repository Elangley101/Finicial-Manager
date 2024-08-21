from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import CustomUser
from .serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.http import JsonResponse
from django.views import View
from django.utils import timezone
from .models import Transaction
from django.contrib.auth.models import User
import json
import csv
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt

class UserRegisterView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            email = data['email']
            password = data['password']
            first_name = data.get('first_name', '')
            last_name = data.get('last_name', '')

            # Check if the email already exists
            if User.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already exists"}, status=400)

            # Create a new user
            user = User.objects.create(
                username=email,  # Use email as the username
                email=email,
                password=make_password(password),  # Hash the password before saving
                first_name=first_name,
                last_name=last_name
            )

            return JsonResponse({"message": "User registered successfully"}, status=201)

        except KeyError as e:
            return JsonResponse({"error": f"Missing field: {str(e)}"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
class AccountBalanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        accounts = Transaction.objects.filter(user=request.user)
        data = [{"account_name": account.account_name, "balance": account.balance} for account in accounts]
        return Response(data)
    
class RecentTransactionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user).order_by('-date')[:10]
        data = [{"date": t.date, "description": t.description, "amount": t.amount, "category": t.category} for t in transactions]
        return Response(data)
    

class TransactionCreateView(View):
    def post(self, request):
        data = json.loads(request.body)
        
        # Assuming the user is authenticated and you have user information
        user = request.user  # or get the user from the user_id if sent via frontend

        # Retrieve or create the category based on the provided category name
        category, created = Transaction.objects.get_or_create(name=data['category'])

        # Create the transaction
        transaction = Transaction.objects.create(
            user=user,
            date=data['date'],
            description=data['description'],
            amount=data['amount'],
            category=category,
            type=data['type']
        )
        
        return JsonResponse({
            "message": "Transaction added successfully",
            "transaction": {
                "id": transaction.id,
                "date": transaction.date,
                "description": transaction.description,
                "amount": transaction.amount,
                "category": transaction.category.name,
                "type": transaction.type
            }
        })
    
class CSVUploadView(View):
    def post(self, request):
        csv_file = request.FILES['file']

        if not csv_file.name.endswith('.csv'):
            return JsonResponse({'error': 'File is not CSV'}, status=400)

        # Decode the CSV file
        decoded_file = csv_file.read().decode('utf-8').splitlines()
        reader = csv.DictReader(decoded_file)

        user = request.user  # Replace with appropriate user logic

        for row in reader:
            # Retrieve or create the category based on the provided category name
            category, created = Transaction.objects.get_or_create(name=row['Category'])

            # Create a new transaction entry
            Transaction.objects.create(
                user=user,
                date=row['Date'],
                description=row['Description'],
                amount=row['Amount'],
                category=category,
                type=row['Type']
            )

        return JsonResponse({"message": "CSV uploaded and processed successfully"})
    

