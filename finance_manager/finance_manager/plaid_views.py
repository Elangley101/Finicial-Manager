import os
import plaid
from plaid.api import plaid_api
from plaid.model.transactions_get_request import TransactionsGetRequest
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.accounts_get_request import AccountsGetRequest
from .models import PlaidAccount,AccountBalance,CustomUser
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from datetime import datetime, timedelta
from dotenv import load_dotenv
from rest_framework.permissions import IsAuthenticated
from plaid import ApiClient, Configuration, Environment
from plaid.exceptions import ApiException
import json
from rest_framework.permissions import IsAuthenticated
from plaid.model.sandbox_item_reset_login_request import SandboxItemResetLoginRequest


# Load environment variables
load_dotenv()

# Retrieve Plaid credentials from environment variables
PLAID_CLIENT_ID = os.getenv('PLAID_CLIENT_ID')
PLAID_SECRET = os.getenv('PLAID_SECRET')

# Initialize Plaid client
plaid_environment = Environment.Sandbox  # Use Development or Production as needed

# Create Plaid API configuration object
configuration = Configuration(
    host=plaid_environment,
    api_key={
        'clientId': PLAID_CLIENT_ID,
        'secret': PLAID_SECRET,
    }
)

# Create an API client instance using the configuration
api_client = ApiClient(configuration)

# Initialize the Plaid API client with the API client instance
plaid_client = plaid_api.PlaidApi(api_client)

def exchange_public_token(public_token):
    print(f"Received public token: {public_token}")

    try:
        # Explicitly pass client_id, secret, and public_token as required by the API
        exchange_request = ItemPublicTokenExchangeRequest(
            client_id=PLAID_CLIENT_ID,
            secret=PLAID_SECRET,
            public_token=public_token
        )
        print(f"Created ItemPublicTokenExchangeRequest: {exchange_request}")

        # Perform the exchange request
        exchange_response = plaid_client.item_public_token_exchange(exchange_request)
        print(f"Exchange response: {exchange_response}")

        # Extract access token and item ID
        access_token = exchange_response['access_token']
        item_id = exchange_response['item_id']

        print(f"Access token: {access_token}, Item ID: {item_id}")
        return access_token, item_id
    except plaid.ApiException as e:
        # Print the error details
        print(f"Error exchanging public token: {e.status} {e.reason}")
        print(f"HTTP response headers: {e.headers}")
        print(f"HTTP response body: {e.body}")
        raise Exception(f"Error exchanging public token: {e}")
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_account_details(request, account_id):
    try:
        plaid_account = PlaidAccount.objects.get(user=request.user, account_id=account_id)
        access_token = plaid_account.access_token

        # Fetch detailed account information using access token and account_id
        accounts = get_accounts_from_plaid(access_token)

        # Fetch transactions for this account
        start_date = (datetime.now() - timedelta(days=30)).date()
        end_date = datetime.now().date()
        transactions_request = TransactionsGetRequest(
            access_token=access_token,
            start_date=start_date,
            end_date=end_date
        )
        transactions_response = plaid_client.transactions_get(transactions_request)

        # Return detailed data including investments, transactions, etc.
        return Response({
            'account': accounts,
            'transactions': transactions_response['transactions'],
            'investments': [],  # Add logic to fetch investments if applicable
        }, status=status.HTTP_200_OK)
    
    except PlaidAccount.DoesNotExist:
        return Response({"error": "Account not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": f"Error fetching account details: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
def get_accounts_from_plaid(access_token):
    try:
        # Create a request for fetching accounts using the access_token
        accounts_request = AccountsGetRequest(access_token=access_token)
        # Call the Plaid API to get the accounts
        accounts_response = plaid_client.accounts_get(accounts_request)
        
        # Return the accounts from the response
        return accounts_response.to_dict()  # Convert the response to a dictionary for easier processing
    except plaid.ApiException as e:
        # Handle specific Plaid API errors
        raise Exception(f"Plaid API error: {e.body}")
    except Exception as e:
        # Handle other unexpected errors
        raise Exception(f"Error getting accounts: {str(e)}")

# API View: Create Link Token
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_link_token(request):
    print(PLAID_CLIENT_ID)
    try:
        user_id = str(request.user.id)  # Assuming user is authenticated
        print(PLAID_CLIENT_ID)
        # Generate a new link token using the Plaid API
        link_token_request = LinkTokenCreateRequest(
            user={'client_user_id': user_id},
            client_name="Finance_Manager",  # Display name in Plaid Link
            products=['transactions'],
            country_codes=['US'],
            language='en'
        )
        link_token_response = plaid_client.link_token_create(link_token_request)

        # Return the link token to the frontend
        return Response({'link_token': link_token_response['link_token']}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': f"Error creating link token: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def exchange_public_token_view(request):
    try:
        public_token = request.data.get('public_token')
        institution_name = request.data.get('institution', None)  # Optionally store the institution name

        if not public_token:
            return Response({'error': 'Public token is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Exchange public token for access token and item ID
        access_token, item_id = exchange_public_token(public_token)

        # Check if there's already a PlaidAccount for the user and the specific institution
        existing_account = PlaidAccount.objects.filter(user=request.user, institution_name=institution_name).exists()

        if existing_account:
            return Response({'error': 'This institution is already linked.'}, status=status.HTTP_400_BAD_REQUEST)

        # Save the access token and item ID in the database, associated with the user (for new institution)
        plaid_account, created = PlaidAccount.objects.update_or_create(
            user=request.user,
            access_token=access_token,
            item_id=item_id,
            institution_name=institution_name  # Storing the institution name with this account
        )

        return Response({'access_token': access_token, 'item_id': item_id}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': f"Error exchanging public token: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_accounts_view(request):
    try:
        plaid_account = PlaidAccount.objects.get(user=request.user)
        access_token = plaid_account.access_token
        accounts = get_accounts_from_plaid(access_token)

        # Process and save accounts in AccountBalance
        for account in accounts.get('accounts', []):
            AccountBalance.objects.update_or_create(
                plaid_account=plaid_account,
                account_id=account['account_id'],
                defaults={
                    'name': account['name'],
                    'type': account['type'],
                    'subtype': account['subtype'],
                    'current_balance': account['balances']['current'],
                    'available_balance': account['balances'].get('available', None),
                    'limit': account['balances'].get('limit', None),
                    'iso_currency_code': account['balances'].get('iso_currency_code', 'USD'),
                    'unofficial_currency_code': account['balances'].get('unofficial_currency_code', None),
                }
            )

        return Response({"accounts": accounts}, status=status.HTTP_200_OK)
    except PlaidAccount.DoesNotExist:
        return Response({"error": "No Plaid account linked"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": f"Error fetching accounts: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# API View: Fetch Transactions using access token
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_transactions_view(request):
    access_token = request.query_params.get('access_token')
    start_date = request.query_params.get('start_date', (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d'))
    end_date = request.query_params.get('end_date', datetime.now().strftime('%Y-%m-%d'))

    if not access_token:
        return Response({"error": "Access token not provided"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        transactions_request = TransactionsGetRequest(
            access_token=access_token,
            start_date=start_date,
            end_date=end_date
        )
        transactions_response = plaid_client.transactions_get(transactions_request)
        return Response({"transactions": transactions_response['transactions']}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"Error fetching transactions: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# API View: Get both Accounts and Transactions
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_accounts_and_transactions(request):
    try:
        user = request.user
        plaid_accounts = PlaidAccount.objects.filter(user=user)

        if not plaid_accounts.exists():
            return Response({"error": "No Plaid accounts linked"}, status=status.HTTP_404_NOT_FOUND)

        all_accounts_data = []
        all_transactions_data = []

        for plaid_account in plaid_accounts:
            access_token = plaid_account.access_token

            # Fetch accounts using access token
            accounts = get_accounts_from_plaid(access_token)

            # Define the start and end date for transactions (last 30 days)
            start_date = (datetime.now() - timedelta(days=30)).date()
            end_date = datetime.now().date()

            # Fetch transactions using access token and date range
            transactions_request = TransactionsGetRequest(
                access_token=access_token,
                start_date=start_date,
                end_date=end_date
            )

            transactions_response = plaid_client.transactions_get(transactions_request)

            # Parse transactions data
            transactions_data = [
                {
                    "account_id": transaction.account_id,
                    "amount": transaction.amount,
                    "date": transaction.date,
                    "name": transaction.name,
                    "merchant_name": transaction.merchant_name,
                    "category": transaction.category,
                    "pending": transaction.pending
                }
                for transaction in transactions_response['transactions']
            ]

            # Parse accounts data
            accounts_data = [
                {
                    "name": account.get('name'),
                    "type": account.get('type'),
                    "subtype": account.get('subtype'),
                    "balance": account.get('balances', {}).get('current', 'Balance not available')
                }
                for account in accounts.get('accounts', [])
            ]

            # Add fetched data to results
            all_accounts_data.extend(accounts_data)
            all_transactions_data.extend(transactions_data)

        # Return the aggregated accounts and transactions data
        return Response({
            'accounts': all_accounts_data,
            'transactions': all_transactions_data,
        }, status=status.HTTP_200_OK)

    except ApiException as e:
        # Safely handle Plaid API exceptions
        try:
            error_response = json.loads(e.body) # type: ignore
            return Response({"error": f"Plaid API error: {error_response}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except json.JSONDecodeError:
            return Response({"error": "Failed to parse error response from Plaid"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        # General exception handling
        return Response({"error": f"Error fetching accounts or transactions: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)






@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reset_plaid_login(request):
    try:
        # Fetch the user's Plaid account
        user = request.user
        plaid_account = PlaidAccount.objects.filter(user=user).first()

        if not plaid_account:
            return Response({"error": "Access token is required"}, status=status.HTTP_400_BAD_REQUEST)

        access_token = plaid_account.access_token
        print(access_token)

        # Create the reset login request for sandbox
        reset_login_request = SandboxItemResetLoginRequest(
            access_token=access_token
        )
        print(reset_login_request, 'request')

        # Call the Plaid API for resetting the login
        try:
            response = plaid_client.sandbox_item_reset_login(reset_login_request)
            print(response, 'response from Plaid')

            # Return success message if reset works
            return Response({"message": "Login reset successfully", "reset_response": response.to_dict()}, status=status.HTTP_200_OK)

        except ApiException as api_exception:
            print(f"Plaid API error: {api_exception}")
            return Response({"error": f"Plaid API error: {api_exception.body}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        print(f"General error: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_plaid_link_token(request):
    try:
        # Retrieve the user's Plaid account
        user = request.user
        plaid_account = PlaidAccount.objects.filter(user=user).first()

        if not plaid_account:
            return Response({"error": "No Plaid accounts linked"}, status=404)

        # Check for ITEM_LOGIN_REQUIRED error and trigger update mode if needed
        try:
            accounts = get_accounts_from_plaid(plaid_account.access_token)
        except ApiException as e:
            error_response = json.loads(e.body)
            if error_response.get("error_code") == "ITEM_LOGIN_REQUIRED":
                # Create new link token with access_token for update mode
                link_token_request = LinkTokenCreateRequest(
                    user={'client_user_id': str(user.id)},
                    client_name="Finance_Manager",
                    country_codes=['US'],
                    language='en',
                    access_token=plaid_account.access_token  # Use the existing access_token for update mode
                )
                link_token_response = plaid_client.link_token_create(link_token_request)
                return Response({'link_token': link_token_response['link_token'], 'action': 'update_link'}, status=status.HTTP_200_OK)
            
            return Response({"error": f"Plaid API error: {error_response}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": "Plaid account is valid"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
