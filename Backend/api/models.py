from django.db import models
from django.contrib.auth.models import User

class AptiQuestion(models.Model):
    question = models.TextField()
    options = models.JSONField()  
    correct_answer = models.CharField(max_length=1, choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D')])
    explanation = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.question[:50]  # Return a short preview of the question

#  The Quiz Section



class ProgrammingLanguage(models.Model):
    name = models.CharField(max_length=50, unique=True)  # C, C++, Python, Java

    def __str__(self):
        return self.name

class Question(models.Model):
    language = models.ForeignKey(ProgrammingLanguage, on_delete=models.CASCADE)  
    topic = models.CharField(max_length=255)  # Topic heading
    statement = models.TextField()  # Question text
    options = models.JSONField()  # Store 4 options as a JSON object
    correct_answer = models.CharField(max_length=255)  # Correct answer
    explanation = models.TextField()  # Explanation for the correct answer

    def __str__(self):
        return f"{self.language.name} - {self.topic}"



# User History


class InteractionHistory(models.Model):
    INTERACTION_TYPES = [
        ('PRACTISE_INTERVIEW', 'Practise_Interview'),
        ('FOLLOWUP_INTERVIEW', 'Followup_Interview'),
        ('SPECIFIC_ROLE_INTERVIEW', 'Specific_Role_Interview'),
        ('RAPID_FIRE', 'Rapid_Fire_Interview'),
        ('CODE_QUIZ', 'Code_Quiz'),
        ('RESUME', 'Resume_Analysis'),
        ('GROUP_DISCUSSION', 'Group Discussion'),
        
        # add other types as needed
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    interaction_type = models.CharField(max_length=50, choices=INTERACTION_TYPES)
    timestamp = models.DateTimeField(auto_now_add=True)
    question = models.TextField(null=True, blank=True)
    transcription = models.TextField(null=True, blank=True)
    ai_response = models.TextField(null=True, blank=True)
    metadata = models.JSONField(null=True, blank=True)  # store any additional info

    def __str__(self):
        return f"{self.user.username} - {self.interaction_type} @ {self.timestamp}"



class DebateEntry(models.Model):
    topic = models.CharField(max_length=255)
    user_side = models.CharField(max_length=50)  # e.g., 'positive' or 'negative'
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.topic} - {self.user_side}"
    
# Complaint Model

class Complaint(models.Model):
    COMPLAINT_TYPES = (
        ('GD', 'General Complaint'),
        ('Debate', 'Debate Complaint'),
        ('Platform', 'Platform Complaint'),
    ) 
    username = models.CharField(max_length=255)
    complaint_type = models.CharField(max_length=20, choices=COMPLAINT_TYPES)
    description = models.TextField()
    violence_image = models.ImageField(upload_to='complaints/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)



class Rating(models.Model):
    username = models.CharField(max_length=100)
    rating = models.PositiveSmallIntegerField()  # 1 to 5
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} - {self.rating} Stars"