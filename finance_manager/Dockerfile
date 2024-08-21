FROM python:3.9

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the rest of the application into the container
COPY . .

# Set the entry point
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]