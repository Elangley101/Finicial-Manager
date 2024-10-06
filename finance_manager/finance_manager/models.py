from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _
from decimal import Decimal
from django.conf import settings

# Custom User Manager
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

# Custom User Model
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=30, blank=True)
    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)
    is_active = models.BooleanField(_('active'), default=True)
    is_staff = models.BooleanField(_('staff status'), default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

# Account Settings Model
class AccountSettings(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    notify_transactions = models.BooleanField(default=True)
    theme = models.CharField(max_length=20, default='light')
    language = models.CharField(max_length=10, default='en')

    def __str__(self):
        return f"{self.user.email} - Settings"

# Financial Data Model
class FinancialData(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    account_name = models.CharField(max_length=255)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.account_name}"

# Transaction Model
class Transaction(models.Model):
    TRANSACTION_TYPE_CHOICES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]

    CATEGORY_CHOICES = [
        ('groceries', 'Groceries'),
        ('rent', 'Rent'),
        ('salary', 'Salary'),
        ('entertainment', 'Entertainment'),
        ('utilities', 'Utilities'),
        ('transportation', 'Transportation'),
        ('dining', 'Dining'),
        ('healthcare', 'Healthcare'),
        ('insurance', 'Insurance'),
        ('savings', 'Savings'),
        ('investments', 'Investments'),
        ('debt_payment', 'Debt Payment'),
        ('charity', 'Charity'),
        ('education', 'Education'),
        ('personal_care', 'Personal Care'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField()
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    type = models.CharField(max_length=7, choices=TRANSACTION_TYPE_CHOICES)

    def __str__(self):
        return f"{self.description} - {self.amount} ({self.type})"

# UserProfile Model
class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return self.user.email

class Account(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    institution_name = models.CharField(max_length=255)
    plaid_account_id = models.CharField(max_length=255)  # This is the account ID from the Plaid API
    account_name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.account_name} ({self.institution_name})"

class Goal(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    target_amount = models.DecimalField(max_digits=10, decimal_places=2)
    current_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    target_date = models.DateField()
    accounts = models.ManyToManyField(Account, through='GoalAccount', related_name='goals')

    def __str__(self):
        return self.name

class GoalAccount(models.Model):
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)

    def __str__(self):
        return f"Goal: {self.goal.name}, Account: {self.account.account_name}"
    
class GoalAssociatedAccounts(models.Model):
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE)
    bankaccount_id = models.CharField(max_length=255)  # Change from ForeignKey to CharField


    def __str__(self):
        return f"Goal: {self.goal.name}, Account ID: {self.bankaccount_id}"


# Investment Model
class Investment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    value = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    growth = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'))


# BankAccount Model
class BankAccount(models.Model):
    ACCOUNT_TYPE_CHOICES = [
        ('checking', 'Checking'),
        ('savings', 'Savings'),
        ('credit', 'Credit'),
        ('loan', 'Loan'),
        ('investment', 'Investment'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    account_number = models.CharField(max_length=30, unique=True)
    bank_name = models.CharField(max_length=255)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPE_CHOICES)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.bank_name} - {self.account_number} ({self.account_type})"



# Plaid Account Model for storing Plaid tokens
class PlaidAccount(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    access_token = models.CharField(max_length=255)
    item_id = models.CharField(max_length=255)
    institution_name = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.email} - {self.institution_name}'

class PlaidTransaction(models.Model):
    plaid_account = models.ForeignKey(PlaidAccount, on_delete=models.CASCADE, related_name='transactions')
    transaction_id = models.CharField(max_length=255, unique=True)  # Unique Plaid transaction ID
    account_id = models.CharField(max_length=255)  # ID of the Plaid account associated with this transaction
    name = models.CharField(max_length=255)  # Transaction name
    amount = models.DecimalField(max_digits=10, decimal_places=2)  # Transaction amount
    date = models.DateField()  # Transaction date
    merchant_name = models.CharField(max_length=255, null=True, blank=True)  # Optional merchant name
    category = models.JSONField(null=True, blank=True)  # Category of the transaction (can be a list of categories)
    pending = models.BooleanField(default=False)  # Whether the transaction is pending or not
    created_at = models.DateTimeField(auto_now_add=True)  # Automatically set the time of creation
    updated_at = models.DateTimeField(auto_now=True)  # Automatically update time on model save

    def __str__(self):
        return f"{self.name} - {self.amount} on {self.date}"

class AccountBalance(models.Model):
    plaid_account = models.ForeignKey(PlaidAccount, on_delete=models.CASCADE, related_name='balances')
    account_id = models.CharField(max_length=255)  # The Plaid account ID
    name = models.CharField(max_length=255)  # Account name
    type = models.CharField(max_length=100)  # Type of account (e.g., depository, credit, loan)
    subtype = models.CharField(max_length=100, null=True, blank=True)  # Subtype of the account (e.g., checking, savings)
    current_balance = models.DecimalField(max_digits=12, decimal_places=2)  # Current balance
    available_balance = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)  # Available balance (optional)
    limit = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)  # Credit limit (optional)
    iso_currency_code = models.CharField(max_length=3, null=True, blank=True)  # ISO currency code (e.g., USD)
    unofficial_currency_code = models.CharField(max_length=10, null=True, blank=True)  # Unofficial currency code (if present)
    created_at = models.DateTimeField(auto_now_add=True)  # Automatically set the time of creation
    updated_at = models.DateTimeField(auto_now=True)  # Automatically update time on model save

    def __str__(self):
        return f"{self.name} - {self.current_balance} {self.iso_currency_code}"