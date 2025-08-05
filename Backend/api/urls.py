from django.urls import path
from .views import *
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AptiQuestionViewSet
from . import views
router = DefaultRouter()
router.register(r'aptiquestions', AptiQuestionViewSet)


router2 = DefaultRouter()
router2.register(r'complain', ComplaintView, basename='complain')

urlpatterns = [
    path("ai-interview/", AIInterviewView.as_view(), name="ai-interview"),
    path("follow-up-interview/", FollowUpInterviewView.as_view(), name="follow-interview"),
    path("specific-role-interview/", SpecificRoleInterview.as_view(), name="specific-role-interview"),
    path("one-minute-question/", OneMinuteQuestion.as_view(), name="one-minute-question"),
    path("generate-random-question/", GenerateRandomQuestion.as_view(), name="generate-random-question"),
    path("get-apti-questions/", GetAptiQuestions.as_view(), name="get-apti-questions"),
    path('', include(router.urls)),
    
    # URL for fetchigng the questions for the quiz
    
    path("get-quiz-data/",GetQuizData.as_view(),name="get-quiz-data"),
    
    # URL for Resume Extraction
    path("extract-resume/",ExtractResume.as_view(),name="extract-resume"),
    path("extract-resume-text/",ExtractResumeText.as_view(),name="extract-resume-text"),
    path("is_staff/",is_staff,name="is_staff"),
    path('send-email/', views.send_email, name='send_email'),
    
    # AI ASK
    path('ai-ask/',AIASK.as_view(),name='ai-ask'),
    path('group-discussion-topic/',GroupDiscussionTopix.as_view(),name='group-discussion-topic'),
    path('group-discussion/',GroupDiscussion.as_view(),name='group-discussion'),
    
    
    #  User History
    path('user-history/',UserHistory.as_view(),name='user-history'),
    
    
    path('debateData/', DebateData.as_view(), name='debate-data'),
    # Complaint
    path('', include(router2.urls)), 
    
    path('get-rooms/',GetRooms.as_view(),name='get-rooms'),
    path('get-debate-topic/',DebateTopix.as_view(),name='get-debate-topic'),
    
    path('rate/', RateUsCreateView.as_view(), name='rate-us'),
    path('admin-ratings/', AdminRatingsListView.as_view(), name='admin-ratings'),
    path('get-summary-resume/', GetSummaryResume.as_view(), name='summary-resume'),
]