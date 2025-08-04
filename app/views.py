from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.crypto import get_random_string
from django.contrib.auth import authenticate

from .models import CustomUser

# Utility
def generate_otp():
    return get_random_string(length=6, allowed_chars="0123456789")


# ✅ Register View
class RegisterUserView(APIView):
    def post(self, request):
        data = request.data
        name = data.get("name")
        email = data.get("email")
        phone_no = data.get("phone_no")
        password = data.get("password")
        user_type = data.get("user_type")

        if not all([name, email, phone_no, password, user_type]):
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if user_type not in ['job_seeker', 'hr', 'admin']:
            return Response({"error": "Invalid user type."}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "Email already registered."}, status=status.HTTP_400_BAD_REQUEST)

        otp = generate_otp()

        try:
            send_mail(
                subject="Job Portal - Verify Your Email",
                message=f"Hi {name}, your OTP for email verification is: {otp}",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
            )
        except Exception as e:
            return Response({"error": f"Failed to send OTP: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        user = CustomUser.objects.create_user(
            username=email.split("@")[0] + get_random_string(length=3),
            email=email,
            phone_no=phone_no,
            first_name=name,
            user_type=user_type,
            email_otp=otp,
            is_verified=False,
            password=password,
        )

        return Response({"success": "OTP sent to your email.", "user_id": user.id}, status=status.HTTP_201_CREATED)


# ✅ Verify OTP View
class VerifyOTPView(APIView):
    def post(self, request, user_id):
        otp = request.data.get("otp")

        if not otp:
            return Response({"error": "OTP is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(id=user_id, email_otp=otp)
            user.is_verified = True
            user.email_otp = None
            user.save()
            return Response({"success": "Email verified successfully!"}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({"error": "Invalid OTP or User ID."}, status=status.HTTP_400_BAD_REQUEST)


# ✅ Login View
class LoginUserView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(email=email)

            if not user.is_verified:
                return Response({"error": "Email is not verified."}, status=status.HTTP_403_FORBIDDEN)

            user_auth = authenticate(username=email, password=password)

            if user_auth:
                refresh = RefreshToken.for_user(user)
                return Response({
                    "message": f"Login successful for {user.user_type}.",
                    "user_id": user.id,
                    "user_type": user.user_type,
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

        except CustomUser.DoesNotExist:
            return Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)
