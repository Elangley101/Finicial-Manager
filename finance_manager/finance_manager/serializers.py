
from rest_framework import serializers
from .models import CustomUser,UserProfile,AccountSettings,Transaction,Goal
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'first_name', 'last_name', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password']
        )
        return user
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['phone']

class AccountSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountSettings
        fields = ['email_notifications']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()
    settings = AccountSettingsSerializer()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'profile', 'settings']

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        settings_data = validated_data.pop('settings', {})

        # Update user fields
        instance.username = validated_data.get('username', instance.username)
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
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'description', 'amount', 'date', 'transaction_type']
        read_only_fields = ['user']  # The user field will be automatically set in the view


class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ['id', 'name', 'target_amount', 'current_amount', 'target_date']
