from rest_framework import serializers
from .models import CustomUser, UserProfile, AccountSettings, Transaction, Goal, PlaidAccount,Account,GoalAssociatedAccounts,Budget

# Serializer for CustomUser
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'first_name', 'last_name', 'password')
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password']
        )
        return user

    def update(self, instance, validated_data):
        # Update the user instance
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)

        # If password is provided, update it and hash it
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance

# Serializer for UserProfile
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['phone']

# Serializer for AccountSettings
class AccountSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountSettings
        fields = ['email_notifications']

# Serializer for CustomUser including profile and settings
class UserDetailSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()
    settings = AccountSettingsSerializer()

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'profile', 'settings']

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        settings_data = validated_data.pop('settings', {})

        # Update user fields
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        # Update profile fields
        profile = instance.profile
        profile.phone = profile_data.get('phone', profile.phone)
        profile.save()

        # Update settings fields
        settings = instance.settings
        settings.email_notifications = settings_data.get('email_notifications', settings.email_notifications)
        settings.save()

        return instance

# Serializer for Transaction
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'description', 'amount', 'date', 'transaction_type']
        read_only_fields = ['user']  # The user field will be automatically set in the view
class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'institution_name', 'plaid_account_id', 'account_name', 'user']
# Serializer for Goal

class GoalAssociatedAccountsSerializer(serializers.ModelSerializer):
    # If you want to display more details about the account, you can include a related field
    account = serializers.SerializerMethodField()

    class Meta:
        model = GoalAssociatedAccounts
        fields = ['goal', 'bankaccount_id', 'account']

    def get_account(self, obj):
        # This method returns more details about the account if needed
        account = Account.objects.filter(plaid_account_id=obj.bankaccount_id).first()
        if account:
            return {
                'name': account.account_name,
                'institution_name': account.institution_name,
                'plaid_account_id': account.plaid_account_id,
            }
        return None
class GoalSerializer(serializers.ModelSerializer):
    progress = serializers.SerializerMethodField()
    associated_accounts = GoalAssociatedAccountsSerializer(source='goalassociatedaccounts_set', many=True, read_only=True)

    class Meta:
        model = Goal
        fields = ['id', 'name', 'target_amount', 'current_amount', 'target_date', 'progress', 'associated_accounts']

    def get_progress(self, obj):
        return obj.calculate_progress()

class PlaidAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaidAccount
        fields = ['id', 'user', 'access_token', 'item_id', 'institution_name']

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['id', 'user', 'category', 'allocated_amount', 'spent_amount']
        read_only_fields = ['user']