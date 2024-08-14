# serializers.py

from rest_framework import serializers
from .models import Election, OngoingElection, CompletedElection

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