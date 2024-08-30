from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
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
    GoalListView
)

urlpatterns = [
    # Authentication routes
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/goals/', GoalListView.as_view(), name='goal-list'),
    # User registration and profile
    path('api/users/register/', UserRegisterView.as_view(), name='api_register'),
    path('api/users/profile/', UserProfileView.as_view(), name='user_profile'),
    path('api/transactions/summary/', TransactionSummaryView.as_view(), name='transaction-summary'),
    # Account and transaction-related routes
    path('api/accounts/', AccountBalanceView.as_view(), name='account_balance'),
    path('api/transactions/recent/', RecentTransactionsView.as_view(), name='recent_transactions'),
    path('api/transactions/', TransactionCreateView.as_view(), name='transaction_create'),

    # File upload
    path('api/upload-csv/', CSVUploadView.as_view(), name='upload_csv'),

    # User settings and password reset
    path('user/personal-information/', UserProfileView.as_view(), name='user_profile'),
    path('user/account-settings/', AccountSettingsView.as_view(), name='account_settings'),
    path('user/password-reset/', PasswordResetView.as_view(), name='password_reset'),

    # Optional: Registration path outside of API (if needed)
    path('register/', UserRegisterView.as_view(), name='register'),
]
