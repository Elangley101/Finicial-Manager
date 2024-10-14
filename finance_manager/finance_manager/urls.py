from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .plaid_views import exchange_public_token_view,get_transactions_view,fetch_accounts_view,get_accounts_and_transactions,get_account_details,get_investment_details,get_loan_details,get_credit_card_details,get_401k_details,get_goal_account_balances,get_debt_accounts,get_debt_transactions, get_spending_insights, get_investment_performance
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
    UserManualTransactionListView,
    goal_list_create_view,
    delete_goal,
    BudgetListCreateView,
    BudgetDetailView,
    get_insights,
    get_credit_score,
    get_bill_reminders,
    get_goal_recommendations,
    get_exchange_rates,
    get_fraud_alerts,
    get_tax_report
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
    path('api/portfolio/', InvestmentPortfolioView.as_view(), name='investment_portfolio'),

    path('api/exchange_public_token/', exchange_public_token_view, name='exchange_public_token'),
    path('transactions/manual/', UserManualTransactionListView.as_view(), name='user-manual-transactions'),
    # URL for getting transactions (optional)
    path('api/get_transactions/', get_transactions_view, name='get_transactions'),

    # URL for fetching accounts (optional)
    path('api/fetch_accounts/', fetch_accounts_view, name='fetch_accounts'),
    path('api/plaid/accounts/', get_accounts_and_transactions, name='get_accounts_and_transactions'),
    path('api/plaid/account/<str:account_id>/', get_account_details, name='get_account_details'),

        # General account details for any account type
    path('api/plaid/account/<str:account_id>/', get_account_details, name='get_account_details'),
    
    # Specific endpoint for fetching investment account details
    path('api/plaid/investment/<str:account_id>/', get_investment_details, name='get_investment_details'),

    # Specific endpoint for fetching loan account details
    path('api/plaid/loan/<str:account_id>/', get_loan_details, name='get_loan_details'),
    
    # Specific endpoint for fetching credit card account details
    path('api/plaid/credit/<str:account_id>/', get_credit_card_details, name='get_credit_card_details'),
    
    # If you have a specific endpoint for 401k accounts
    path('api/plaid/401k/<str:account_id>/', get_401k_details, name='get_401k_details'),

    # Additional endpoints can be added here as needed..
    path('api/goals/', goal_list_create_view, name='goal-list-create'),

    path('api/goals/<int:goal_id>/', delete_goal, name='delete_goal'),  # URL for deleting a goal

     path('api/goals/<int:goal_id>/account-balances/', get_goal_account_balances, name='get_goal_account_balances'),
    path('api/budgets/', BudgetListCreateView.as_view(), name='budget-list-create'),
    path('api/budgets/<int:pk>/', BudgetDetailView.as_view(), name='budget-detail'),
    path('api/insights/', get_insights, name='get-insights'),
    path('api/debt-accounts/', get_debt_accounts, name='get_debt_accounts'),
    path('api/debt-transactions/', get_debt_transactions, name='get_debt_transactions'),
    path('api/spending-insights/', get_spending_insights, name='spending-insights'),
    path('api/investment-performance/', get_investment_performance, name='investment-performance'),
    path('api/credit-score/', get_credit_score, name='credit-score'),
    path('api/bill-reminders/', get_bill_reminders, name='bill-reminders'),
    path('api/goal-recommendations/', get_goal_recommendations, name='goal-recommendations'),
    path('api/exchange-rates/', get_exchange_rates, name='exchange-rates'),
    path('api/fraud-alerts/', get_fraud_alerts, name='fraud-alerts'),
    path('api/tax-report/', get_tax_report, name='tax-report'),
]
