from django.urls import path
from hello import views
from .views import handle_new_election, DisplayElections, DisplayCompletedElections, DisplayArchivedElections, delete_election, UpdateElectionStatuses  

urlpatterns = [
    
    
    #path('loginFunc/', views.loginFunc, name='login_view'),
    path('CSRFTokenDispenser/', views.CSRFTokenDispenser, name='CSRFTokenDispenser'),
    path('api/form-data/', handle_new_election, name='handle_new_election'),
    path('api/elections/', DisplayElections.as_view(), name='election-list'),    
    path('api/completed-elections/', DisplayCompletedElections.as_view(), name='election-list'),
    path('api/elections/<int:id>/', delete_election, name='delete_election'),
    #path('insertAcc/', views.insertAcc, name='insertAcc'),
    path('api/get_user_elections/', views.get_user_elections, name='get_user_elections'),
    path('api/handle_Vote/', views.handle_Vote, name='handle_Vote'),
    path('api/get_paillier_public_key/', views.get_paillier_public_key, name='get_paillier_public_key'),
    path('api/archived-elections/', views.handle_archived_elections, name='handle_archived_elections'),
    path('api/view-archived-elections/', DisplayArchivedElections.as_view(), name="view-archived-elections"),
    path('api/update-election-statuses/', UpdateElectionStatuses.as_view(), name='update-election-statuses'),

    
    path('login/', views.loginFunc, name='login'),
    path('insertAcc/', views.insertAcc, name='insertAcc'),
    path('getAccList/', views.getAccList, name='getAccList'),
    path('delAcc/', views.delAcc, name='delAcc'),
    path('updateAcc/', views.updateAcc, name='updateAcc'),
    path('updateAccPassw/', views.updateAccPassw, name='updateAccPassw'),
    path('getDptList/', views.getDptList, name='getDptList'),
    path('insertAccBulk/', views.insertAccBulk, name='insertAccBulk')
]
