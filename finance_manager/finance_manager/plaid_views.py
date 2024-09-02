import plaid
from plaid.api import plaid_api
from plaid.model.transactions_get_request import TransactionsGetRequest
from plaid.model.transactions_get_request_options import TransactionsGetRequestOptions
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.country_code import CountryCode
from plaid.model.products import Products
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view

plaid_client = plaid_api.PlaidApi(plaid.Configuration(
    host=plaid.Environment.Sandbox,  # or Development or Production
    api_key={
        'client_id': settings.PLAID_CLIENT_ID,
        'secret': settings.PLAID_SECRET,
    }
))

@api_view(['POST'])
def exchange_public_token(request):
    public_token = request.data.get('public_token')
    request_data = ItemPublicTokenExchangeRequest(public_token=public_token)
    response = plaid_client.item_public_token_exchange(request_data)
    return Response({
        'access_token': response['access_token'],
        'item_id': response['item_id'],
    })

@api_view(['GET'])
def get_transactions(request):
    access_token = request.query_params.get('access_token')
    start_date = request.query_params.get('start_date', '2021-01-01')
    end_date = request.query_params.get('end_date', '2021-12-31')
    request_data = TransactionsGetRequest(
        access_token=access_token,
        start_date=start_date,
        end_date=end_date,
    )
    response = plaid_client.transactions_get(request_data)
    return Response(response['transactions'])
