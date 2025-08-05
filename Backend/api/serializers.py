from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)  # Ensure email is included and required

    class Meta:
        model = User
        fields = ["username", "email", "password"]  # Include email in the fields
        extra_kwargs = {
            "password": {"write_only": True},# Ensure password is write-only
            # "is_admin" : {"read_only":True} 
        }

    def create(self, validated_data):
        # Override create to handle password hashing
        print(validated_data)
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        print(user)
        return user
    

class AptiQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AptiQuestion
        fields = '__all__'  
        
# Serializer for Quiz Questions


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["id", "language", "topic", "statement", "options", "correct_answer", "explanation"]

class ProgrammingLanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgrammingLanguage
        fields = ["id", "name"]


class DebateEntrySerializer(serializers.ModelSerializer):
    # Optionally, you can map the incoming "userSide" key to the model field "user_side"
    userSide = serializers.CharField(source="user_side")

    class Meta:
        model = DebateEntry
        # We expose id, topic and userSide (which maps to user_side)
        fields = ['id', 'topic', 'userSide']
        
        
class ComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = '__all__'
        
        
class RatingSerializer(serializers.ModelSerializer):
    
    class Meta:
        
        model = Rating
        fields = '__all__'