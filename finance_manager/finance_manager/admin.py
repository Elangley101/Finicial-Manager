from django.contrib import admin
from .models import CustomUser, FinancialData, Transaction, UserProfile, AccountSettings

admin.site.register(CustomUser)
admin.site.register(FinancialData)
admin.site.register(Transaction)
admin.site.register(UserProfile)
admin.site.register(AccountSettings)
