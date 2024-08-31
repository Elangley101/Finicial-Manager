from django.shortcuts import render
from rest_framework import generics, status, permissions
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from rest_framework.parsers import MultiPartParser
import json
import csv
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser, Goal, Transaction, UserProfile, AccountSettings
from .serializers import UserSerializer, UserProfileSerializer, AccountSettingsSerializer, GoalSerializer, TransactionSerializer
from django.contrib.auth import get_user_model

# User Registration View
@method_decorator(csrf_exempt, name='dispatch')
class UserRegisterView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            email = data['email']
            password = data['password']
            first_name = data.get('first_name', '')
            last_name = data.get('last_name', '')

            if CustomUser.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already exists"}, status=400)

            user = CustomUser.objects.create(
                email=email,
                password=make_password(password),
                first_name=first_name,
                last_name=last_name
            )

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            tokens = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }

            return JsonResponse({"message": "User registered successfully", "tokens": tokens}, status=201)

        except KeyError as e:
            return JsonResponse({"error": f"Missing field: {str(e)}"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

# User Profile View
class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

# Account Balance View
class AccountBalanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        accounts = Transaction.objects.filter(user=request.user)
        data = [{"account_name": account.description, "balance": account.amount} for account in accounts]
        return Response(data)

# Recent Transactions View
class RecentTransactionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user).order_by('-date')[:10]
        data = [{"date": t.date, "description": t.description, "amount": t.amount, "category": t.category} for t in transactions]
        return Response(data)

# Transaction Create View
class TransactionCreateView(View):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = json.loads(request.body)
        user = request.user

        transaction = Transaction.objects.create(
            user=user,
            date=data['date'],
            description=data['description'],
            amount=data['amount'],
            category=data['category'],
            type=data['type']
        )
        
        return JsonResponse({
            "message": "Transaction added successfully",
            "transaction": {
                "id": transaction.id,
                "date": transaction.date,
                "description": transaction.description,
                "amount": transaction.amount,
                "category": transaction.category,
                "type": transaction.type
            }
        })

# CSV Upload View
class CSVUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request):
        file = request.FILES.get('file')
        if not file or not file.name.endswith('.csv'):
            return Response({'error': 'Please upload a valid CSV file.'}, status=status.HTTP_400_BAD_REQUEST)

        decoded_file = file.read().decode('utf-8').splitlines()
        reader = csv.DictReader(decoded_file)

        for row in reader:
            Transaction.objects.create(
                user=request.user,
                date=row['Date'],
                description=row['Description'],
                amount=row['Amount'],
                category=row['Category'],
                type=row['Type']
            )

        return Response({"message": "CSV uploaded and processed successfully"}, status=status.HTTP_201_CREATED)

# Account Settings View
class AccountSettingsView(generics.RetrieveUpdateAPIView):
    queryset = AccountSettings.objects.all()
    serializer_class = AccountSettingsSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.accountsettings

# Password Reset View
class PasswordResetView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        user = request.user
        old_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not user.check_password(old_password):
            return Response({"error": "Wrong current password."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"success": "Password updated successfully."})

# Transaction Summary View
class TransactionSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user)
        
        summary = {}
        for transaction in transactions:
            month = transaction.date.strftime('%B')
            if month not in summary:
                summary[month] = {'Income': 0, 'Expenses': 0}
            if transaction.type == 'income':
                summary[month]['Income'] += transaction.amount
            else:
                summary[month]['Expenses'] += transaction.amount
        
        data = [{'name': month, **values} for month, values in summary.items()]
        return JsonResponse(data, safe=False)

# Goal List View
class GoalListView(generics.ListAPIView):
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)
class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# View to handle User Profile additional details (like phone)
class UserProfileDetailView(generics.RetrieveUpdateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.userprofile

# View to handle Account Settings retrieval and update
class AccountSettingsView(generics.RetrieveUpdateAPIView):
    queryset = AccountSettings.objects.all()
    serializer_class = AccountSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.accountsettings

class PasswordResetView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        old_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not user.check_password(old_password):
            return Response({"error": "Wrong current password."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"success": "Password updated successfully."})