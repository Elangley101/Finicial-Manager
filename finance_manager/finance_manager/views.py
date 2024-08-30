from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from .models import CustomUser,Goal
from .serializers import UserSerializer,UserProfileSerializer, AccountSettingsSerializer,GoalSerializer
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
from rest_framework import generics, permissions
from .models import UserProfile, AccountSettings
from django.contrib.auth import get_user_model
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class UserRegisterView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            email = data['email']
            password = data['password']
            first_name = data.get('first_name', '')
            last_name = data.get('last_name', '')

            # Check if the email already exists
            if CustomUser.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already exists"}, status=400)

            # Create a new user
            user = CustomUser.objects.create(
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
    
User = get_user_model()

class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
    
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
    
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
import csv

class CSVUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request):
        file = request.FILES.get('file')
        if not file or not file.name.endswith('.csv'):
            return Response({'error': 'Please upload a valid CSV file.'}, status=status.HTTP_400_BAD_REQUEST)

        decoded_file = file.read().decode('utf-8').splitlines()
        reader = csv.DictReader(decoded_file)

        for row in reader:
            # Ensure category is properly managed and transaction is created
            category, created = Transaction.objects.get_or_create(name=row['Category'])
            Transaction.objects.create(
                user=request.user,
                date=row['Date'],
                description=row['Description'],
                amount=row['Amount'],
                category=category,
                type=row['Type']
            )

        return Response({"message": "CSV uploaded and processed successfully"}, status=status.HTTP_201_CREATED)

    
class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class AccountSettingsView(generics.RetrieveUpdateAPIView):
    queryset = AccountSettings.objects.all()
    serializer_class = AccountSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.accountsettings

class PasswordResetView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        user = request.user
        old_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not user.check_password(old_password):
            return Response({"error": "Wrong current password."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"success": "Password updated successfully."})
class TransactionSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user)
        
        summary = {}
        for transaction in transactions:
            month = transaction.date.strftime('%B')
            if month not in summary:
                summary[month] = {'Income': 0, 'Expenses': 0}
            if transaction.transaction_type == 'income':
                summary[month]['Income'] += transaction.amount
            else:
                summary[month]['Expenses'] += transaction.amount
        
        # Convert summary dict to list for the frontend
        data = [{'name': month, **values} for month, values in summary.items()]
        return JsonResponse(data, safe=False)
    


class GoalListView(generics.ListAPIView):
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)
