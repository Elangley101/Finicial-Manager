import os
import plaid
from plaid.api import plaid_api
from plaid.model.transactions_get_request import TransactionsGetRequest
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.accounts_get_request import AccountsGetRequest
from .models import PlaidAccount
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from settings or environment
PLAID_CLIENT_ID = os.getenv('PLAID_CLIENT_ID')
PLAID_SECRET = os.getenv('PLAID_SECRET')

# Initialize Plaid client
plaid_client = plaid_api.PlaidApi(plaid.Configuration(
    host=plaid.Environment.Sandbox,  # Switch to Development or Production as needed
    api_key={
        'client_id': PLAID_CLIENT_ID,
        'secret': PLAID_SECRET,
    }
))

# Helper function to exchange public token for access token

def exchange_public_token(public_token):
    try:
        exchange_request = ItemPublicTokenExchangeRequest(public_token=public_token)
        exchange_response = plaid_client.item_public_token_exchange(exchange_request)
        return exchange_response['access_token'], exchange_response['item_id']
    except Exception as e:
        raise Exception(f"Error exchanging public token: {str(e)}")
@api_view(['POST'])
def exchange_public_token_view(request):
    public_token = request.data.get('public_token')

    if not public_token:
        return Response({"error": "Public token not provided"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        access_token, item_id = exchange_public_token(public_token)

        # Store the access token and item ID in the database
        plaid_account, created = PlaidAccount.objects.get_or_create(user=request.user)
        plaid_account.access_token = access_token
        plaid_account.item_id = item_id
        plaid_account.save()

        return Response({"message": "Access token stored successfully"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['POST'])
def create_link_token(request):
    try:
        user_id = str(request.user.id)  # Assuming the user is authenticated

        # Generate a new link token using the Plaid API
        link_token_request = LinkTokenCreateRequest(
            user={'client_user_id': user_id},
            products=['transactions'],  # Add other Plaid products if needed
            client_name="Your App Name",
            country_codes=['US'],
            language='en',
            redirect_uri='https://your-app.com/callback',  # Optional for OAuth institutions
        )
        link_token_response = plaid_client.link_token_create(link_token_request)

        return Response({'link_token': link_token_response['link_token']}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# Helper function to fetch accounts using access token
def get_accounts_from_plaid(access_token):
    try:
        request = AccountsGetRequest(access_token=access_token)
        response = plaid_client.accounts_get(request)
        return response['accounts']
    except Exception as e:
        raise Exception(f"Error fetching accounts: {str(e)}")

# API view to exchange public token and store access token
@api_view(['POST'])
def exchange_public_token_view(request):
    public_token = request.data.get('public_token')

    if not public_token:
        return Response({"error": "Public token not provided"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        access_token, item_id = exchange_public_token(public_token)

        # Store the access token and item ID in the database
        plaid_account, created = PlaidAccount.objects.get_or_create(user=request.user)
        plaid_account.access_token = access_token
        plaid_account.item_id = item_id
        plaid_account.save()

        return Response({"message": "Access token stored successfully"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# API view to fetch transactions using access token
@api_view(['GET'])
def get_transactions_view(request):
    access_token = request.query_params.get('access_token')
    start_date = request.query_params.get('start_date', '2021-01-01')
    end_date = request.query_params.get('end_date', '2021-12-31')

    if not access_token:
        return Response({"error": "Access token not provided"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        request_data = TransactionsGetRequest(
            access_token=access_token,
            start_date=start_date,
            end_date=end_date
        )
        response = plaid_client.transactions_get(request_data)
        return Response({"transactions": response['transactions']}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# API view to fetch accounts after exchanging public token
@api_view(['POST'])
def fetch_accounts_view(request):
    public_token = request.data.get('public_token')

    if not public_token:
        return Response({"error": "Public token not provided"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Exchange public token for access token
        access_token, item_id = exchange_public_token(public_token)

        # Fetch accounts using access token
        accounts = get_accounts_from_plaid(access_token)

        if accounts:
            accounts_data = [
                {
                    "name": account['name'],
                    "type": account['type'],
                    "subtype": account['subtype'],
                    "balance": account['balances']['current']
                }
                for account in accounts
            ]
            return Response({"accounts": accounts_data}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Failed to fetch accounts"}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['GET'])
def get_transactions_view(request):
    access_token = request.query_params.get('access_token')  # Access token passed as a query parameter
    start_date = request.query_params.get('start_date', '2021-01-01')  # Default start date
    end_date = request.query_params.get('end_date', '2021-12-31')  # Default end date

    if not access_token:
        return Response({"error": "Access token not provided"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Request object to fetch transactions
        request_data = TransactionsGetRequest(
            access_token=access_token,
            start_date=start_date,
            end_date=end_date
        )

        # Fetch transactions from Plaid API
        response = plaid_client.transactions_get(request_data)
        return Response({"transactions": response['transactions']}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
from plaid.model.accounts_get_request import AccountsGetRequest
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import PlaidAccount

@api_view(['POST'])
def fetch_accounts_view(request):
    access_token = request.data.get('access_token')

    if not access_token:
        return Response({"error": "Access token not provided"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Request object to fetch accounts
        request_data = AccountsGetRequest(access_token=access_token)

        # Fetch accounts from Plaid API
        response = plaid_client.accounts_get(request_data)
        accounts = response['accounts']  # List of accounts

        # Prepare and return account data
        accounts_data = [
            {
                "name": account['name'],
                "type": account['type'],
                "subtype": account['subtype'],
                "balance": account['balances']['current']
            }
            for account in accounts
        ]

        return Response({"accounts": accounts_data}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
load_dotenv()

# Now you can access the environment variables
PLAID_CLIENT_ID = os.getenv('PLAID_CLIENT_ID')
PLAID_SECRET = os.getenv('PLAID_SECRET')



@api_view(['GET'])
def get_accounts_and_transactions(request):
    try:
        # Ensure the user is authenticated
        user = request.user
        if not user.is_authenticated:
            return Response({"error": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

        # Fetch the user's Plaid account information from the database
        plaid_account = PlaidAccount.objects.get(user=user)
        access_token = plaid_account.access_token

        # Fetch accounts using Plaid API
        accounts_request = AccountsGetRequest(access_token=access_token)
        accounts_response = plaid_client.accounts_get(accounts_request)

        # Fetch transactions using Plaid API
        start_date = (datetime.datetime.now() - datetime.timedelta(days=30)).strftime('%Y-%m-%d')
        end_date = datetime.datetime.now().strftime('%Y-%m-%d')

        transactions_request = TransactionsGetRequest(
            access_token=access_token,
            start_date=start_date,
            end_date=end_date
        )
        transactions_response = plaid_client.transactions_get(transactions_request)

        # Serialize accounts and transactions
        accounts_data = accounts_response['accounts']
        return Response({
            'accounts': accounts_data,
            'transactions': transactions_response['transactions'],
        }, status=status.HTTP_200_OK)

    except PlaidAccount.DoesNotExist:
        return Response({"error": "No Plaid account linked"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)