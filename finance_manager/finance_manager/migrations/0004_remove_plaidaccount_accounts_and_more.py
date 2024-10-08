# Generated by Django 5.0.3 on 2024-09-07 16:56

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finance_manager', '0003_plaidaccount_accounts_plaidaccount_updated_at_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='plaidaccount',
            name='accounts',
        ),
        migrations.RemoveField(
            model_name='plaidaccount',
            name='updated_at',
        ),
        migrations.AlterField(
            model_name='plaidaccount',
            name='access_token',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='plaidaccount',
            name='item_id',
            field=models.CharField(default=django.utils.timezone.now, max_length=255),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='plaidaccount',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
