from .models import Transaction

def analyze_spending(user):
    transactions = Transaction.objects.filter(user=user)
    category_totals = {}

    for transaction in transactions:
        category = transaction.category
        amount = transaction.amount
        if category in category_totals:
            category_totals[category] += amount
        else:
            category_totals[category] = amount

    # Example rule-based insights
    insights = []
    for category, total in category_totals.items():
        if total > 500:  # Example threshold
            insights.append(f"You have spent a lot on {category}. Consider reducing expenses in this category.")

    return insights
