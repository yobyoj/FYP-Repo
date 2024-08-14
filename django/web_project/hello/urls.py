from django.urls import path
from hello import views
from .views import handle_new_election, DisplayElections, DisplayCompletedElections, delete_election

urlpatterns = [
    path('loginFunc/', views.loginFunc, name='login_view'),
    path('CSRFTokenDispenser/', views.CSRFTokenDispenser, name='CSRFTokenDispenser'),
    path('api/form-data/', handle_new_election, name='handle_new_election'),
    path('api/elections/', DisplayElections.as_view(), name='election-list'),    
    path('api/completed-elections/', DisplayCompletedElections.as_view(), name='election-list'),
    path('api/elections/<int:id>/', delete_election, name='delete_election'),
    path('insertAcc/', views.insertAcc, name='insertAcc'),
    path('api/get_user_elections/', views.get_user_elections, name='get_user_elections'),
    path('api/handle_Vote/', views.handle_Vote, name='handle_Vote'),
    path('api/get_paillier_public_key/', views.get_paillier_public_key, name='get_paillier_public_key'),
    
]
