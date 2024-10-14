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
from .models import CustomUser, Goal, Transaction, UserProfile, AccountSettings,Investment, Goal, BankAccount,Account,GoalAssociatedAccounts, Budget, BillReminder, FraudAlert, TaxReport
from .serializers import UserSerializer, UserProfileSerializer, AccountSettingsSerializer, GoalSerializer, TransactionSerializer, BudgetSerializer
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
from django.db import IntegrityError, transaction as db_transaction
from django.db.utils import OperationalError
from MySQLdb import Error as MySQLError
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.accounts_get_request import AccountsGetRequest
from plaid.model.accounts_get_request import AccountsGetRequest
from plaid.model.transactions_get_request import TransactionsGetRequest
from plaid.model.transactions_get_request_options import TransactionsGetRequestOptions
from datetime import datetime, timedelta
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .insights import analyze_spending
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import requests


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
            # Parse request body as JSON
            data = json.loads(request.body)
            
            # Extract required fields
            email = data.get('email')
            password = data.get('password')
            first_name = data.get('first_name', '')
            last_name = data.get('last_name', '')
            
            # Validate required fields
            if not email or not password:
                return JsonResponse({"error": "Email and password are required"}, status=400)
            
            # Check if the user already exists
            if CustomUser.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already exists"}, status=400)

            # Create the user
            user = CustomUser.objects.create(
                email=email,
                first_name=first_name,
                last_name=last_name
            )
            user.set_password(password)  # This handles password hashing
            user.save()

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            tokens = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }

            return JsonResponse({"message": "User registered successfully", "tokens": tokens}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
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

class CSVUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request):
        file = request.FILES.get('file')
        if not file or not file.name.endswith('.csv'):
            return Response({'error': 'Please upload a valid CSV file.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_file = file.read().decode('utf-8-sig').splitlines()
        except UnicodeDecodeError:
            return Response({'error': 'File could not be decoded. Please upload a valid CSV file.'}, status=status.HTTP_400_BAD_REQUEST)

        reader = csv.DictReader(decoded_file)
        transactions_df = []
        debts_df = []
        bank_accounts_df = []

        for row in reader:
            if 'bank_name' in row and 'account_number' in row:
                bank_accounts_df.append(row)
            elif 'transaction_type' in row and 'date' in row:
                transactions_df.append(row)
            elif 'debt_type' in row and 'due_date' in row:
                debts_df.append(row)

        transactions_created = 0
        debts_created = 0
        bank_accounts_created = 0

        try:
            with db_transaction.atomic():  # Ensure all inserts are atomic
                # Insert BankAccount
                for row in bank_accounts_df:
                    bank_account = BankAccount.objects.create(
                        user=request.user,  # Make sure this is the current user
                        account_number=row['account_number'],
                        bank_name=row['bank_name'],
                        account_type=row['account_type'],
                        balance=row['balance']
                    )
                    bank_accounts_created += 1

                # Insert Transactions
                for t_row in transactions_df:
                    try:
                        bank_account = BankAccount.objects.get(
                            user=request.user,
                            account_number=t_row['account_number']
                        )
                        Transaction.objects.create(
                            user=request.user,
                            date=datetime.strptime(t_row['date'], '%Y-%m-%d'),
                            description=t_row['description'],
                            amount=t_row['amount'],
                            category=t_row['category'],  # Ensure category matches the model choices
                            type=t_row['transaction_type']  # Map CSV's `transaction_type` to `type` field
                        )
                        transactions_created += 1
                    except BankAccount.DoesNotExist:
                        print(f"Bank account not found for transaction row: {t_row}")

            return Response({
                "message": "CSV uploaded and processed successfully",
                "bank_accounts_created": bank_accounts_created,
                "transactions_created": transactions_created,
                "debts_created": debts_created,
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error: {e}")
            return Response({'error': f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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


@api_view(['GET', 'POST'])
def goal_list_create_view(request):
    if request.method == 'GET':
        goals = Goal.objects.filter(user=request.user).prefetch_related('accounts')
        serializer = GoalSerializer(goals, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        selected_accounts = request.data.get('accounts', [])
        goal_serializer = GoalSerializer(data=request.data)
        
        if goal_serializer.is_valid():
            goal = goal_serializer.save(user=request.user)

            # Handle account associations with the goal
            for plaid_account_id in selected_accounts:
                try:
                    # Log the plaid_account_id to ensure we're getting it correctly
                    print(f"Attempting to associate account {plaid_account_id} with goal {goal.id}")

                    # Fetch or create the Account using plaid_account_id
                    account, created = Account.objects.get_or_create(
                        plaid_account_id=plaid_account_id,
                        user=request.user,
                        defaults={
                            'institution_name': 'Unknown',
                            'account_name': 'Unnamed'
                        }
                    )

                    # Now use account.id (the primary key) for the foreign key
                    GoalAssociatedAccounts.objects.create(
                        goal=goal,
                        bankaccount_id=plaid_account_id,  
                    )

                except Exception as e:
                    # Log detailed error information
                    print(f"Error associating account {plaid_account_id} with goal: {str(e)}")
                    return Response({"detail": f"Error associating account {plaid_account_id}: {str(e)}"},
                                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response(goal_serializer.data, status=status.HTTP_201_CREATED)

        return Response(goal_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_goal(request, goal_id):
    try:
        goal = Goal.objects.get(id=goal_id, user=request.user)  # Ensure the goal belongs to the authenticated user
        goal.delete()
        return Response({'message': 'Goal deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Goal.DoesNotExist:
        return Response({'error': 'Goal not found'}, status=status.HTTP_404_NOT_FOUND)


def get_accounts_from_plaid(access_token):
    try:
        request = AccountsGetRequest(access_token=access_token)
        response = client.accounts_get(request)
        return response['accounts']  # This contains the account data
    except Exception as e:
        print(f"Error fetching accounts: {e}")
        return None
def get_accounts_from_plaid(access_token):
    try:
        request = AccountsGetRequest(access_token=access_token)
        response = client.accounts_get(request)
        return response['accounts']  # This contains the account data
    except Exception as e:
        print(f"Error fetching accounts: {e}")
        return None

client = plaid_api.PlaidApi(api_client)  # Initialize the Plaid API client here

@api_view(['GET'])  # Explicitly allow GET requests
def get_accounts(request):
    # Retrieve the user's access token from session, DB, etc.
    access_token = request.session.get('plaid_access_token') 

    if not access_token:
        return Response({"error": "Access token not found"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Get accounts
        accounts_request = AccountsGetRequest(access_token=access_token)
        accounts_response = client.accounts_get(accounts_request)
        accounts = accounts_response["accounts"]

        # Get recent transactions (optional)
        start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        end_date = datetime.now().strftime('%Y-%m-%d')
        options = TransactionsGetRequestOptions(count=10)
        transactions_request = TransactionsGetRequest(
            access_token=access_token,
            start_date=start_date,
            end_date=end_date,
            options=options
        )
        transactions_response = client.transactions_get(transactions_request)
        transactions = transactions_response["transactions"]

        # Format accounts and transactions for frontend
        formatted_accounts = [
            {
                "name": acc["name"],
                "accountNumber": acc["mask"],
                "balance": acc["balances"]["current"],
                "official_name": acc["official_name"]
            } for acc in accounts
        ]
        
        formatted_transactions = [
            {
                "date": txn["date"],
                "description": txn["name"],
                "amount": txn["amount"],
                "category": txn["category"]
            } for txn in transactions
        ]

        return Response({
            "accounts": formatted_accounts,
            "transactions": formatted_transactions
        })

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class UserManualTransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return transactions that belong to the logged-in user
        return Transaction.objects.filter(user=self.request.user)
    

class BudgetListCreateView(generics.ListCreateAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BudgetDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

@api_view(['GET'])
def get_insights(request):
    if not request.user.is_authenticated:
        return Response({"error": "User must be authenticated"}, status=400)

    insights = analyze_spending(request.user)
    return Response({"insights": insights})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_credit_score(request):
    try:
        # Example API endpoint and headers (replace with actual API details)
        api_url = "https://api.creditscoreprovider.com/score"
        headers = {
            'Authorization': f"Bearer {os.getenv('CREDIT_SCORE_API_KEY')}",
            'Content-Type': 'application/json'
        }

        # Make a request to the credit score API
        response = requests.get(api_url, headers=headers)

        if response.status_code == 200:
            credit_score_data = response.json()
            return Response(credit_score_data, status=200)
        else:
            return Response({"error": "Failed to fetch credit score"}, status=response.status_code)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_bill_reminders(request):
    try:
        # Fetch recurring transactions (this is a simplified example)
        recurring_transactions = identify_recurring_transactions(request.user)

        # Update or create bill reminders based on recurring transactions
        for transaction in recurring_transactions:
            BillReminder.objects.update_or_create(
                user=request.user,
                name=transaction['name'],
                defaults={
                    'amount': transaction['amount'],
                    'due_date': transaction['next_due_date'],
                    'frequency': transaction['frequency']
                }
            )

        # Fetch all bill reminders for the user
        reminders = BillReminder.objects.filter(user=request.user)
        reminders_data = [{'name': reminder.name, 'amount': reminder.amount, 'due_date': reminder.due_date, 'frequency': reminder.frequency} for reminder in reminders]

        return Response(reminders_data, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

def identify_recurring_transactions(user):
    # Placeholder function to identify recurring transactions
    # In a real implementation, analyze transaction data to find recurring patterns
    return [
        {'name': 'Electricity Bill', 'amount': 100.00, 'next_due_date': datetime.now() + timedelta(days=30), 'frequency': 'monthly'},
        {'name': 'Netflix Subscription', 'amount': 15.99, 'next_due_date': datetime.now() + timedelta(days=30), 'frequency': 'monthly'}
    ]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_goal_recommendations(request):
    try:
        # Analyze user transactions and savings to generate recommendations
        recommendations = analyze_user_data_for_goals(request.user)

        return Response(recommendations, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

def analyze_user_data_for_goals(user):
    # Placeholder function to analyze user data and generate goal recommendations
    # In a real implementation, analyze transaction and savings data
    return [
        {'goal': 'Emergency Fund', 'suggested_amount': 1000.00, 'reason': 'Based on your spending patterns, it is recommended to have an emergency fund.'},
        {'goal': 'Vacation Savings', 'suggested_amount': 500.00, 'reason': 'Consider saving for a vacation based on your recent travel-related expenses.'}
    ]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_exchange_rates(request):
    try:
        # Example API endpoint and headers (replace with actual API details)
        api_url = "https://api.exchangeratesapi.io/latest"
        params = {
            'access_key': os.getenv('CURRENCY_API_KEY'),
            'base': 'USD'  # Base currency
        }

        # Make a request to the currency exchange API
        response = requests.get(api_url, params=params)

        if response.status_code == 200:
            exchange_rates = response.json()
            return Response(exchange_rates, status=200)
        else:
            return Response({"error": "Failed to fetch exchange rates"}, status=response.status_code)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_fraud_alerts(request):
    try:
        # Analyze transactions to detect potential fraud
        detect_fraud(request.user)

        # Fetch all fraud alerts for the user
        alerts = FraudAlert.objects.filter(user=request.user, is_resolved=False)
        alerts_data = [{'transaction_id': alert.transaction_id, 'description': alert.description, 'amount': alert.amount, 'date': alert.date} for alert in alerts]

        return Response(alerts_data, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

def detect_fraud(user):
    # Placeholder function to detect fraud
    # In a real implementation, analyze transaction data for anomalies
    transactions = Transaction.objects.filter(user=user, date__gte=datetime.now() - timedelta(days=30))
    for transaction in transactions:
        if transaction.amount > 1000:  # Example rule: flag transactions over $1000
            FraudAlert.objects.get_or_create(
                user=user,
                transaction_id=transaction.id,
                defaults={
                    'description': transaction.description,
                    'amount': transaction.amount,
                    'date': transaction.date
                }
            )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_tax_report(request):
    try:
        # Analyze transactions to generate tax report
        year = datetime.now().year
        total_deductible = calculate_deductible_expenses(request.user, year)

        # Create or update tax report
        tax_report, created = TaxReport.objects.update_or_create(
            user=request.user,
            year=year,
            defaults={'total_deductible': total_deductible}
        )

        report_data = {
            'year': tax_report.year,
            'total_deductible': tax_report.total_deductible,
            'created_at': tax_report.created_at
        }

        return Response(report_data, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

def calculate_deductible_expenses(user, year):
    # Placeholder function to calculate deductible expenses
    # In a real implementation, analyze transaction data for deductible categories
    transactions = Transaction.objects.filter(user=user, date__year=year)
    deductible_categories = ['Charity', 'Business', 'Medical']
    total_deductible = sum(transaction.amount for transaction in transactions if transaction.category in deductible_categories)
    return total_deductible