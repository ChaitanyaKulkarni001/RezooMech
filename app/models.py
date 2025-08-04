from django.contrib.auth.models import AbstractUser
from django.db import models

USER_TYPE_CHOICES = (
    ("job_seeker", "Job Seeker"),
    ("hr", "HR"),
    ("admin", "Admin"),  # Admin typically handled by superuser
)

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    phone_no = models.CharField(max_length=15, unique=True)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    is_verified = models.BooleanField(default=False)
    email_otp = models.CharField(max_length=6, null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # still needed for AbstractUser

    def __str__(self):
        return f"{self.email} ({self.user_type})"
