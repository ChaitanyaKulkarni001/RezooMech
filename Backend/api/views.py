from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import google.generativeai as genai
import os
import pdfplumber
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import speech_recognition as sr
from pydub import AudioSegment
import json



# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
# model = genai.GenerativeModel("gemini-1.5-flash")

# Google API Key
# API_KEY = "AIzaSyAnpEybMeLXj5UZ3KGAMiG-9d_cxpdhto8"

# Create your views here.
def convert_wav_to_mp3(wav_path, mp3_path):
    try:
        audio = AudioSegment.from_file(wav_path, format="wav")
        audio.export(mp3_path, format="mp3", bitrate="192k")
        print(f"Conversion successful! MP3 saved at: {mp3_path}")
    except Exception as e:
        print(f"Error during conversion: {e}")

# Convert to PCM WAV
def convert_to_pcm_wav(input_path, output_path):
    try:
        audio = AudioSegment.from_file(input_path)
        audio = audio.set_frame_rate(16000).set_channels(1).set_sample_width(2)
        audio.export(output_path, format="wav")
        print(f"Converted to PCM WAV: {output_path}")
    except Exception as e:
        print("Error converting file:", e)

# Create a new User
class CreateUserView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer

# Configure Google Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
print(os.getenv("GEMINI_API_KEY"))

# Prepare voice file
def prepare_voice_file(path: str) -> str:
    if os.path.splitext(path)[1] == ".wav":
        return path 
    elif os.path.splitext(path)[1] in (".mp3", ".m4a", ".ogg", ".flac"):
        audio_file = AudioSegment.from_file(path, format=os.path.splitext(path)[1][1:])
        wav_file = os.path.splitext(path)[0] + ".wav"
        audio_file.export(wav_file, format="wav")
        return wav_file
    else:
        raise ValueError(f"Unsupported audio format: {os.path.splitext(path)[1]}")

# Transcribe audio
def transcribe_audio(wav_path):
    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(wav_path) as source:
            audio_data = recognizer.record(source)
        transcription = recognizer.recognize_google(audio_data)
        return transcription
    except Exception as e:
        print(f"Error in transcribe_audio: {e}")
        raise

# Reusable function for audio handling
def handle_audio_file(audio_file):
    upload_dir = "uploaded_audios/"
    os.makedirs(upload_dir, exist_ok=True)
    file_name = audio_file.name
    if not file_name.endswith(".wav"):
        file_name = f"{file_name.split('.')[0]}.wav"
    file_path = os.path.join(upload_dir, file_name)
    with open(file_path, "wb") as f:
        for chunk in audio_file.chunks():
            f.write(chunk)
    wav_file = prepare_voice_file(file_path)
    convert_to_pcm_wav(wav_file, wav_file)
    transcription = transcribe_audio(wav_file)
    return transcription

# For Practice Interview only
class AIInterviewView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, *args, **kwargs):
        audio_file = request.FILES.get("audio")
        question = request.data.get("question")
        if not audio_file:
            return Response({"error": "No audio file uploaded."}, status=400)

        try:
            transcription = handle_audio_file(audio_file)
            analysis_prompt = f"""
Imagine you are an experienced interview coach giving feedback to a candidate. The interview question is: '{question}', and the candidate's response is: '{transcription}'.

Please rate the response on a scale of 1 to 10 based on clarity, relevance, confidence, and structure. Then, provide detailed, constructive feedback in a friendly, conversational tone—like you're personally guiding the candidate.provide in json format, with keys as rating and feedback, and values as the rating and feedback. provide me a json code. but do not include any other text or even ``` in respose. Just text.
"""
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(analysis_prompt)
            content = response.text
            print("content",content)
            
            python_object = json.loads(content)

            print(python_object.keys())
                
            # Within your view after generating the response:
            try:
                
                InteractionHistory.objects.create(
                    user=request.user,
                    interaction_type='PRACTISE_INTERVIEW',  # or appropriate type
                    question=question,
                    transcription=transcription,
                    ai_response=python_object['feedback'],
                    metadata={'audio_file': audio_file.name,
                            'rating': python_object['rating']
                            }  # add extra info if needed
                )
            except Exception as e:
                print("error ",e)
                

            return Response({"analysis": python_object['feedback'],"rating": python_object['rating']}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Follow-up Interview
class FollowUpInterviewView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, *args, **kwargs):
        audio_file = request.FILES.get("audio")
        question = request.data.get("question")
        additional_info = request.data.get("AdditionalKnownInfo")

        if additional_info:
            additional_info = f"Additionally, we know about the candidate that {additional_info}."

        if not audio_file:
            return Response({"error": "No audio file uploaded."}, status=400)

        try:
            transcription = handle_audio_file(audio_file)
            analysis_prompt = f"""
You are acting as an experienced job interviewer. The interview question is: '{question}', and the candidate's response is: '{transcription}'.

1. Provide constructive feedback on the candidate's response, highlighting strengths and suggesting improvements. {additional_info}
2. Ask the next logical follow-up question, ensuring relevance to the previous answer. 
3. provide in json format, with keys as question and feedback, and values as the question and feedback. provide me a json code. but do not include any other text or even ``` in respose. Just text
.
"""
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(analysis_prompt)
            content = response.text
            print(type(content))
            
            
            python_object = json.loads(content)
            # Within your view after generating the response:
            InteractionHistory.objects.create(
                user=request.user,
                
                interaction_type='SPECIFIC_ROLE_INTERVIEW',
                question=question,
                transcription=transcription,
                ai_response=python_object['feedback'],
                metadata={'audio_file': audio_file.name,
                          'question': python_object['question']
                          } 
            )

            
            return Response({"analysis": python_object['feedback'],"next_question":python_object['question'] , "transcription": transcription}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SpecificRoleInterview(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (JSONParser, MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        # Extract data from the request
        profession = request.data.get('profession')
        experience_level = request.data.get('experienceLevel')
        years_of_experience = request.data.get('yearsOfExperience')
        company_specific = request.data.get('companySpecific')
        company_name = request.data.get('companyName')
        additional_info = request.data.get('additionalInfo')
        isMock = request.data.get('isMock') or False

        try:
            # Configure GenAI
            genai.configure(api_key="AIzaSyAnpEybMeLXj5UZ3KGAMiG-9d_cxpdhto8")
            model = genai.GenerativeModel("gemini-1.5-flash")

            # Improved Prompt
            if isMock:
                analysis_prompt=f"""Profession: {profession}
                - Experience Level: {experience_level}
                - Years of Experience: {years_of_experience}
                - Company-Specific Role: {"Yes" if company_specific else "No"}
                - Company Name: {company_name if company_specific else "General"}
                - Additional Information: {additional_info}
                
                Generate 5 Questions as a mock interview questions for the given candidate profile. The questions should be relevant to the candidate's profession and experience level. Reflect real-world challenges they might face in this role. Assess skills such as problem-solving, teamwork, adaptability, and leadership (if applicable). For company-specific roles, align the question with the company's culture and work environment. Ensure variety in each response return only 5 questions e.g. 1.Tell me about yourself 2.tell your strengths ..."""
            else:
                analysis_prompt = f"""
                Generate a behavioral interview question tailored to the following candidate profile:

                - **Profession:** {profession}
                - **Experience Level:** {experience_level}
                - **Years of Experience:** {years_of_experience}
                - **Company-Specific Role:** {"Yes" if company_specific else "No"}
                - **Company Name:** {company_name if company_specific else "General"}
                - **Additional Information:** {additional_info}

                The question should:
                - Be relevant to the candidate's profession and experience level.
                - Reflect real-world challenges they might face in this role.
                - Assess skills such as problem-solving, teamwork, adaptability, and leadership (if applicable).
                - For company-specific roles, align the question with the company's culture and work environment.
                Please Note that, just provide the question, no other text. not even the text "here are some question", or any another "()"
                """

            # Generate the interview question
            response = model.generate_content(analysis_prompt)
            content = response.text

            return Response({"question": content}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class OneMinuteQuestion(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, *args, **kwargs):
        audio_file = request.FILES.get("audio")
        question = request.data.get("question")
        

        if not audio_file:
            return Response({"error": "No audio file uploaded."}, status=400)

        try:
            transcription = handle_audio_file(audio_file)
            analysis_prompt = f"""for one minute speak on '{question}', the response of a user is '{transcription}'. Provide feedback on the response and suggest improvements., provide with a friendly tone and only provide response, no another text.
"""         
            genai.configure(api_key="AIzaSyAnpEybMeLXj5UZ3KGAMiG-9d_cxpdhto8")

            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(analysis_prompt)
            content = response.text
        
            try:
                
                InteractionHistory.objects.create(
                    user=request.user,
                    interaction_type='RAPID_FIRE',  # or appropriate type
                    question=question,
                    transcription=transcription,
                    ai_response=content,
                    metadata={'audio_file': audio_file.name,
                           
                            }  # add extra info if needed
                )
            except Exception as e:
                print("error ",e)
            
            
        
            return Response({"analysis": content, "transcription": transcription}, status=status.HTTP_200_OK)

        
        
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
# Random Question or Situational Question
class GenerateRandomQuestion(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (JSONParser, MultiPartParser, FormParser)
    def post(self, request, *args, **kwargs):
        IsSituationalQuestion = request.data.get('IsSituationalQuestion') or False
        AdditionalInfo = request.data.get('AdditionalInfo')
        try:      
            genai.configure(api_key="AIzaSyAnpEybMeLXj5UZ3KGAMiG-9d_cxpdhto8")
            model = genai.GenerativeModel("gemini-1.5-flash")
            if IsSituationalQuestion:
                analysis_prompt = f"Generate a Situational Question for an IT Interview with knwon Info as {AdditionalInfo} Present hypothetical scenarios to assess how candidates might handle work-related situations Return only quesion. Ensure Variety in each response."
            else:
                analysis_prompt = "Generate a random and unique topic to speak on for one minute. Ensure variety in each response."

            response = model.generate_content(analysis_prompt)
            content = response.text
            return Response({"question": content}, status=status.HTTP_200_OK)
        except Exception as e:
            print("eerpr",e)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# Mock Interview Question


# Database connection
from rest_framework import viewsets
from .models import *
from .serializers import *
# Database connection for AptiQuestions
class AptiQuestionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = AptiQuestion.objects.all()
    serializer_class = AptiQuestionSerializer

# Get Apti Questions
class GetAptiQuestions(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        questions = AptiQuestion.objects.all().order_by('?')[:10] # Change this number for getting numbers of random X questions    
        serializer = AptiQuestionSerializer(questions, many=True)
        return Response(serializer.data)
    

# Quiz Section
from rest_framework.pagination import PageNumberPagination
class QuestionPagination(PageNumberPagination):
    page_size = 10  # Set the number of questions per page
    page_size_query_param = 'page_size'
    max_page_size = 50  #
    
class GetQuizData(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = QuestionPagination
    
    def get(self,request):
        language = request.query_params.get("language")

        if not language:
            return Response({"error": "Language parameter is required"}, status=400)

        # Fetch filtered questions
        questions = Question.objects.filter(language=language)

        # Apply pagination manually
        paginator = self.pagination_class()
        paginated_questions = paginator.paginate_queryset(questions, request)
        print("GET WUIX data")
        try:
                print("In database")
                InteractionHistory.objects.create(
                    user=request.user,
                    interaction_type='CODE_QUIZ',  # or appropriate type
                    transcription="No Transcription",
                    ai_response="AI FEEDBACK",
                    metadata={'attempted_qustions': "paginated_questions"
                            }  # add extra info if needed
                )
        except Exception as e:
            print("error ",e)
            
        
        # Serialize and return paginated response
        serializer = QuestionSerializer(paginated_questions, many=True)
        return paginator.get_paginated_response(serializer.data)
    
from django.core.files.storage import default_storage
from pdf2image import convert_from_path
import pytesseract

class ExtractResume(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        if 'pdf' not in request.FILES:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        pdf_file = request.FILES['pdf']
        file_path = default_storage.save(pdf_file.name, pdf_file)
        print("1")
        text = ""
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            
            if not text:  # If no text found, try OCR
                images = convert_from_path(file_path)
                text = "\n".join(pytesseract.image_to_string(img) for img in images)

            genai.configure(api_key="AIzaSyAnpEybMeLXj5UZ3KGAMiG-9d_cxpdhto8")
            model = genai.GenerativeModel("gemini-1.5-flash")
            # return Response({"text": text}, status=status.HTTP_200_OK)
            analysis_prompt = f"I am conducting an Interview, i have a resume of the interviewee , I have extract text from it and the interviewee wants me to give pros and conse of his resume, the text extracted is  {text}, Return the result as a valid JSON object with keys Pros, Cons, and LatexCode. Do not wrap your answer in triple backticks or any markdown. Ensure that any backslashes, newlines, or quotes in the LaTeX code are properly escaped (e.g., use \\\\ for each backslash and \\n for newlines) Return the result as a valid JSON object with keys: Pros, Cons, LatexCode. Do not include any markdown formatting such as triple backticks (```) or any extra text. Only output the raw JSON.      "
            response = model.generate_content(analysis_prompt)
            content = response.text
            print("2")
            print(content)
            content = content.replace('\\', '\\\\')
            try:
                python_object = json.loads(content)
            except Exception as e:
                print("error in json load ", e)

            print(python_object.keys())
            print("3")
            # Within your view after generating the response:
            try:
                
                InteractionHistory.objects.create(
                    user=request.user,
                    interaction_type='RESUME',  # or appropriate type
                    question = "No Question",
                    transcription = text,
                    ai_response="Provides detailed analysis",
                    metadata={
                            'Pros': python_object['Pros'],
                            'Cons': python_object['Cons'],
                            'LatexCode' : python_object['LatexCode']
                            }  # add extra info if needed
                    
                )
                print("5")
            except Exception as e:
                print("error ",e)
                

            return Response({"Pros": python_object['Pros'],"Cons": python_object['Cons'],"LatexCode": python_object['LatexCode']}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
           


class ExtractResumeText(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        if 'pdf' not in request.FILES:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        pdf_file = request.FILES['pdf']
        file_path = default_storage.save(pdf_file.name, pdf_file)

        text = ""
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            
            if not text:  # If no text found, try OCR
                images = convert_from_path(file_path)
                text = "\n".join(pytesseract.image_to_string(img) for img in images)
            return Response({"text": text}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes  
@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def is_staff(request):
    print(request.user)
    return JsonResponse({"is_staff": request.user.is_staff})


from django.core.mail import EmailMessage

@api_view(['POST'])
def send_email(request):
    data = request.data
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    # Send email
    subject = f"{name} sent you a message ! from CarrerXpert AI"
    body = f"Message: {message}\n\nFrom: {email} \n\n CarrerXpert AI Service"

    email_msg = EmailMessage(
        subject,
        body,
        'your-email@gmail.com',  # Your email (sender)
        ['kulkarnichaitanya001@gmail.com'],  # Recipient(s)
        reply_to=[email],  # This will set the user's email as the reply-to
    )

    email_msg.send()

    return Response({'message': 'Email sent successfully!'})


class AIASK(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, *args, **kwargs):
        try :
                
            UserQuery = request.data.get("UserQuery")
            currentQuestion = request.data.get("currentQuestion")
            currentCorrectAnswer = request.data.get("currentCorrectAnswer")
            currentExplanation = request.data.get("currentExplanation")
            currentTopic = request.data.get("currentTopic")
            aiAskHistory = request.data.get("aiAskHistory")
            
            genai.configure(api_key="AIzaSyAnpEybMeLXj5UZ3KGAMiG-9d_cxpdhto8")
            model = genai.GenerativeModel("gemini-1.5-flash")
            # return Response({"text": text}, status=status.HTTP_200_OK)
            analysis_prompt = f"The User wants a detailed Explanation, for question {currentQuestion}, with correct answer {currentCorrectAnswer}, and explanation {currentExplanation}, and the topic is {currentTopic}, the user has asked this question with previous history {aiAskHistory} , provide just response in explaining manner, no other text., remove highliting or hash, keep the response 2-3 lines."
            response = model.generate_content(analysis_prompt)
            content = response.text
            
            return Response({"text": content}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
        
        
class GroupDiscussionTopix(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    def get(self, request, *args, **kwargs):
        try :
            genai.configure(api_key="AIzaSyAnpEybMeLXj5UZ3KGAMiG-9d_cxpdhto8")
            model = genai.GenerativeModel("gemini-1.5-flash")
            # return Response({"text": text}, status=status.HTTP_200_OK)
            analysis_prompt = f"Generate a Group Discussion Topic, for a group of 4 people, the topic should be relevant and should be able to discuss for 10 minutes, Give response only text of topic, no other text, ensure variety in each response. topic should be realted to some natural subjects or general subjects Just provide a single topic"
            response = model.generate_content(analysis_prompt)
            content = response.text
            
            return Response({"text": content}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
 

class GroupDiscussion(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, *args, **kwargs):
        history = request.data.get("history", "")
        audio_file = request.FILES.get("audio")
        topic = request.data.get("topic", "")
        if not audio_file:
            return Response({"error": "No audio file uploaded."}, status=400)

        try:
            transcription = handle_audio_file(audio_file)
            genai.configure(api_key="AIzaSyAnpEybMeLXj5UZ3KGAMiG-9d_cxpdhto8")
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            analysis_prompt = (
                f"Group Discussion Topic: {topic}\n"
                f"Conversation History: {history}\n"
                f"User's Latest Comment: {transcription}\n\n"
                "Please generate realistic, engaging responses as if three participants—Sanchita, Ankoor, and Chaitanya—"
                "are actively discussing the topic. Format the output as a JSON object with keys 'Sanchita', 'Ankoor', "
                "and 'Chaitanya'. The output should contain only valid JSON without any extra commentary."
            )
            response = model.generate_content(analysis_prompt)
            content = response.text
            print(content)
            
            try:
                InteractionHistory.objects.create(
                    user=request.user,
                    interaction_type="GROUP_DISCUSSION",
                    question=topic,
                    transcription=transcription,
                    ai_response=content,
                    metadata={"request_type": "GD Topic Request",
                              "history": history}
                )
            except Exception as e:
                print("Error saving interaction history:", e)
            
            # Optionally, include the user's transcription as part of the response for TTS if needed.
            return Response({"text": content, "userComment": transcription}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class UserHistory(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        history = InteractionHistory.objects.filter(user=request.user).order_by('-timestamp')
        # Serialize the data as needed
        serialized_data = [{
            "type": record.interaction_type,
            "timestamp": record.timestamp,
            "question": record.question,
            "transcription": record.transcription,
            "ai_response": record.ai_response,
            "metadata": record.metadata
        } for record in history]
        return Response(serialized_data)


class DebateData(APIView):
    def post(self, request, format=None):
        serializer = DebateEntrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ComplaintView(viewsets.ModelViewSet):
    
    queryset = Complaint.objects.all().order_by('-created_at')
    serializer_class = ComplaintSerializer
    parser_classes = (MultiPartParser, FormParser)
    
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        # Override or add the username field from the authenticated user (if available)
        if request.user and request.user.is_authenticated:
            data['username'] = request.user.username
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        
        """Restrict complaints to admins only"""
        if self.request.user.is_staff:  # Allow only admin users
            return Complaint.objects.all().order_by('-created_at')
        return Complaint.objects.none()  # Return empty queryset for non-admins

class GetRooms(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        rooms = DebateEntry.objects.all().order_by('-created_at')
        serializer = DebateEntrySerializer(rooms, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
# Debate topic 

        
class DebateTopix(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    def get(self, request, *args, **kwargs):
        try :
            genai.configure(api_key="AIzaSyAnpEybMeLXj5UZ3KGAMiG-9d_cxpdhto8")
            model = genai.GenerativeModel("gemini-1.5-flash")
            # return Response({"text": text}, status=status.HTTP_200_OK)
            analysis_prompt = f"Generate a Group Debate Topic, for a group of 4 people, the topic should be relevant and should be able to discuss for 10 minutes, Give response only text of topic, no other text, ensure variety in each response. Just provide a single topic"
            response = model.generate_content(analysis_prompt)
            content = response.text
            
            return Response({"text": content}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class RateUsCreateView(generics.CreateAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer

# Endpoint for admins to fetch all ratings
class AdminRatingsListView(generics.ListAPIView):
    queryset = Rating.objects.all().order_by('-created_at')
    serializer_class = RatingSerializer
    # permission_classes = [permissions.IsAdminUser]
    
    

class GetSummaryResume(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    
    def post(self, request, *args, **kwargs):
        Data = request.data.get("data", "")
        print("Data is ",Data)
        analysis_prompt = (
    f"Using the following resume data: {Data}, please generate a concise, "
    "professional summary that highlights key skills, experiences, and achievements. "
    "Return your response as plain text without any additional formatting or commentary. (witout ``` or any other text)"
)

        try:
            
            genai.configure(api_key="AIzaSyAnpEybMeLXj5UZ3KGAMiG-9d_cxpdhto8")
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            
            response = model.generate_content(analysis_prompt)
            content = response.text
            print(content)
            
            # Optionally, include the user's transcription as part of the response for TTS if needed.
            return Response({"text": content}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)