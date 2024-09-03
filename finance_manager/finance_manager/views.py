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
from .models import CustomUser, Goal, Transaction, UserProfile, AccountSettings,Investment, Debt, Goal
from .serializers import UserSerializer, UserProfileSerializer, AccountSettingsSerializer, GoalSerializer, TransactionSerializer
from django.db import transaction as db_transaction
from django.contrib.auth import get_user_model
from datetime import datetime  
from plaid import ApiClient, Configuration
from rest_framework.decorators import api_view
from plaid.api import plaid_api
from plaid.model.country_code import CountryCode
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.products import Products
from plaid import ApiClient, Configuration
from dotenv import load_dotenv
import os
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser  # Ensure this is imported


env_path = os.path.join(os.path.dirname(__file__), 'env.env')
load_dotenv(dotenv_path=env_path)

# Now, you can access the environment variables
PLAID_CLIENT_ID = os.getenv('PLAID_CLIENT_ID')
PLAID_SECRET = os.getenv('PLAID_SECRET')
PLAID_ENV = os.getenv('PLAID_ENV')

if not PLAID_CLIENT_ID or not PLAID_SECRET:
    raise ValueError("PLAID_CLIENT_ID and PLAID_SECRET must be set")

# Ensure the Products enum value is correctly referenced
products_enum_value = Products('transactions')
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
@method_decorator(csrf_exempt, name='dispatch')
class TransactionCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        user = request.user

        transaction = Transaction.objects.create(
            user=user,
            date=data['date'],
            description=data['description'],
            amount=data['amount'],
            category=data['category'],
            type=data['type']
        )
        
        return Response({
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
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request):
        file = request.FILES.get('file')
        if not file or not file.name.endswith('.csv'):
            print('No CSV file uploaded or incorrect file format.')
            return Response({'error': 'Please upload a valid CSV file.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_file = file.read().decode('utf-8-sig').splitlines()
            print(f"File successfully decoded. Number of lines: {len(decoded_file)}")
        except UnicodeDecodeError:
            try:
                decoded_file = file.read().decode('ISO-8859-1').splitlines()
                print(f"File successfully decoded with ISO-8859-1 encoding. Number of lines: {len(decoded_file)}")
            except UnicodeDecodeError:
                print('File could not be decoded. Unsupported encoding.')
                return Response({'error': 'File could not be decoded. Please upload a valid CSV file.'}, status=status.HTTP_400_BAD_REQUEST)

        reader = csv.DictReader(decoded_file)

        expected_headers = ['Date', 'Description', 'Amount', 'Category', 'Type']
        if reader.fieldnames != expected_headers:
            print(f"Incorrect headers. Expected {expected_headers}, but got {reader.fieldnames}")
            return Response({'error': f"Incorrect headers. Expected {expected_headers}, but got {reader.fieldnames}"}, status=status.HTTP_400_BAD_REQUEST)

        transactions_created = 0

        for row in reader:
            try:
                date_str = row['Date']
                description = row['Description']
                amount = row['Amount']
                category = row['Category']
                type = row['Type']

                # Convert date to YYYY-MM-DD format
                date = datetime.strptime(date_str, '%m/%d/%Y').strftime('%Y-%m-%d')

                print(f"Date: {date}, Description: {description}, Amount: {amount}, Category: {category}, Type: {type}")
                
                transaction = Transaction.objects.create(
                    user=request.user,
                    date=date,
                    description=description,
                    amount=amount,
                    category=category,
                    type=type
                )
                transactions_created += 1
                print(f"Created Transaction: {transaction}")
            except KeyError as e:
                print(f'Missing expected field in row: {row}. Error: {e}')
                return Response({'error': f"Missing expected field in row: {row}. Error: {e}"}, status=status.HTTP_400_BAD_REQUEST)
            except ValueError as e:
                print(f'Error parsing date in row {row}: {e}')
                return Response({'error': f'Error parsing date in row: {row}. Error: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                print(f'Error creating transaction from row {row}: {e}')
                return Response({'error': f'Failed to process row: {row}. Error: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        print(f"Successfully created {transactions_created} transactions.")
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
        print(f"PLAID_ENVIRONMENT: {PLAID_ENVIRONMENT}")
        print(f"PLAID_CLIENT_ID: {PLAID_CLIENT_ID}")
        print(f"PLAID_SECRET: {PLAID_SECRET}")
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
    
class TransactionSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get all transactions for the logged-in user
        transactions = Transaction.objects.filter(user=request.user)
        
        # Initialize totals
        total_income = 0
        total_expense = 0
        
        # Calculate the totals
        for transaction in transactions:
            if transaction.type == 'income':
                total_income += transaction.amount
            elif transaction.type == 'expense':
                total_expense += transaction.amount
        
        # Return the summary data as JSON
        data = {
            'total_income': total_income,
            'total_expense': total_expense
        }
        return Response(data)
    
class InvestmentPortfolioView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        investments = Investment.objects.filter(user=request.user)
        portfolio = {
            'growth': sum([inv.growth for inv in investments]),
            'returns': sum([inv.value for inv in investments]),
            'assets': [{'name': inv.name, 'value': inv.value} for inv in investments]
        }
        return Response(portfolio)

class DebtAndLiabilitiesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        debts = Debt.objects.filter(user=request.user)
        debt_data = [{'name': debt.name, 'balance': debt.balance, 'interestRate': debt.interest_rate} for debt in debts]
        return Response(debt_data)

class SavingsAndGoalsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        goals = Goal.objects.filter(user=request.user)
        goals_data = [{'name': goal.name, 'targetAmount': goal.target_amount, 'savedAmount': goal.saved_amount} for goal in goals]
        return Response(goals_data)
# Setup the Plaid API client configuration
print(dir(Products))

# Check if environment variables are set
plaid_client_id = os.getenv('PLAID_CLIENT_ID')
plaid_secret = os.getenv('PLAID_SECRET')
if not plaid_client_id or not plaid_secret:
    raise ValueError("PLAID_CLIENT_ID and PLAID_SECRET must be set")

environment_url = os.getenv('PLAID_ENVIRONMENT', 'https://sandbox.plaid.com')

configuration = Configuration(
    host=environment_url,
    api_key={
        'clientId': plaid_client_id,
        'secret': plaid_secret,
    }
)
print(f"Configuration: {configuration}")

api_client = ApiClient(configuration)
client = plaid_api.PlaidApi(api_client)


@api_view(['POST'])
def create_link_token(request):
    if not request.user.is_authenticated:
        print("User is not authenticated.")
        return Response({"error": "User must be authenticated and have a valid ID"}, status=400)
    
    try:
        user_id = str(request.user.id)
        print(f"Authenticated User ID: {user_id}")

        user = LinkTokenCreateRequestUser(client_user_id=user_id)
        
        products_enum_value = Products('transactions')
        print(f"Selected Product: {products_enum_value}")

        link_token_request = LinkTokenCreateRequest(
            user=user,
            client_name="Finance_Manager",
            products=[products_enum_value],
            country_codes=[CountryCode('US')],
            language='en',
        )

        response = client.link_token_create(link_token_request)
        print("Link token created successfully.")
        return Response(response.to_dict())

    except Exception as e:
        print(f"Error during link token creation: {e}")
        return Response({"error": str(e)}, status=400)

@api_view(['GET'])
def test_authentication(request):
    if request.user.is_authenticated:
        return Response({"user_id": request.user.id, "username": request.user.username})
    else:
        return Response({"error": "User is not authenticated"}, status=400)