from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserRegisterView,UserProfileView,AccountBalanceView,RecentTransactionsView,TransactionCreateView,CSVUploadView, AccountSettingsView, PasswordResetView
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/users/register/', UserRegisterView.as_view(), name='api_register'),
    path('api/users/profile/', UserProfileView.as_view(), name='user_profile'),
    path('api/accounts/', AccountBalanceView.as_view(), name='account_balance'),
    path('api/transactions/recent/', RecentTransactionsView.as_view(), name='recent_transactions'),
    path('api/transactions/', TransactionCreateView.as_view(), name='transaction-create'),
    path('api/upload-csv/', CSVUploadView.as_view(), name='upload-csv'),
    path('user/personal-information/', UserProfileView.as_view(), name='user-profile'),
    path('user/account-settings/', AccountSettingsView.as_view(), name='account-settings'),
    path('user/password-reset/', PasswordResetView.as_view(), name='password-reset'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
