from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .plaid_views import exchange_public_token_view,get_transactions_view,fetch_accounts_view,get_accounts_and_transactions,get_account_details,reset_plaid_login,get_plaid_link_token
from .views import (
    UserRegisterView,
    UserProfileView,
    AccountBalanceView,
    RecentTransactionsView,
    TransactionCreateView,
    CSVUploadView,
    AccountSettingsView,
    PasswordResetView,
    TransactionSummaryView,
    GoalListView,
    UserProfileDetailView,
    InvestmentPortfolioView,
    SavingsAndGoalsView,
    create_link_token,
    get_accounts,
    
)

urlpatterns = [
    # Authentication routes
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User registration and profile
    path('api/users/register/', UserRegisterView.as_view(), name='api_register'),
    path('api/users/profile/', UserProfileView.as_view(), name='user_profile'),
    path('api/users/profile-details/', UserProfileDetailView.as_view(), name='user-profile-details'),
    path('api/users/account-settings/', AccountSettingsView.as_view(), name='account-settings'),
    path('api/users/password-reset/', PasswordResetView.as_view(), name='password_reset'),

    # Account and transaction-related routes
    path('api/accounts/', AccountBalanceView.as_view(), name='account_balance'),
    path('api/transactions/recent/', RecentTransactionsView.as_view(), name='recent_transactions'),
    path('api/transactions/', TransactionCreateView.as_view(), name='transaction_create'),
    path('api/transaction-summary/', TransactionSummaryView.as_view(), name='transaction-summary'),

    # File upload
    path('api/upload-csv/', CSVUploadView.as_view(), name='upload_csv'),

    # Optional: Registration path outside of API (if needed)
    path('register/', UserRegisterView.as_view(), name='register'),
    path('api/create_link_token/', create_link_token, name='create_link_token'),  # Add this line
    # Goals
    path('api/goals/', GoalListView.as_view(), name='goal-list'),

    path('api/portfolio/', InvestmentPortfolioView.as_view(), name='investment_portfolio'),
    path('api/goals/', SavingsAndGoalsView.as_view(), name='goals'),

    path('api/exchange_public_token/', exchange_public_token_view, name='exchange_public_token'),

    # URL for getting transactions (optional)
    path('api/get_transactions/', get_transactions_view, name='get_transactions'),

    # URL for fetching accounts (optional)
    path('api/fetch_accounts/', fetch_accounts_view, name='fetch_accounts'),
    path('api/plaid/accounts', get_accounts_and_transactions, name='get_accounts_and_transactions'),
    path('plaid/account/<str:account_id>/', get_account_details, name='get_account_details'),
    path('api/get_plaid_link_token/', get_plaid_link_token, name='get_plaid_link_token'),
    path('api/reset_plaid_login/',reset_plaid_login, name='reset_plaid')
]

