# serializers.py

from rest_framework import serializers
from .models import Election, OngoingElection, CompletedElection, ElectionVoterStatus, ArchivedElection

class ElectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Election
        fields = '__all__'
        
class OngoingElectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = OngoingElection
        fields = '__all__'
        
        
class CompletedElectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompletedElection
        fields = '__all__'
        
class ElectionVoterStatusSerializer(serializers.ModelSerializer):
    election_id = serializers.IntegerField(source='election.id')
    userid = serializers.IntegerField(source='user.userid')

    class Meta:
        model = ElectionVoterStatus
        fields = ['userid', 'election_id', 'has_voted']
        


class ArchivedElectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArchivedElection
        fields = '__all__'
