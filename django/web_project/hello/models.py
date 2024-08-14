# hello/models.py
from django.db import models
from django.db.models import JSONField

class Department(models.Model):
    departmentid = models.AutoField(primary_key=True)
    departmentname = models.CharField(max_length=255, unique=True)

    class Meta:
        db_table = 'departments'

    def __str__(self):
        return self.departmentname
    
class UserType(models.Model):
    usertypeid = models.AutoField(primary_key=True)
    usertype = models.CharField(max_length=255, unique=True)

    class Meta:
        db_table = 'user_types'

    def __str__(self):
        return self.usertype

    
class UserAccount(models.Model):
    userid = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    firstname = models.CharField(max_length=255)
    lastname = models.CharField(max_length=255)
    usertype = models.CharField(max_length=255, default='Voter')
    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        to_field='departmentname',  # Reference the 'departmentname' field in the Department model
        db_column='department'  # Column name in the UserAccount table
    )

    class Meta:
        db_table = 'user_accounts'

    def __str__(self):
        return f"{self.firstname} {self.lastname} ({self.username})"



class Election(models.Model):
    STATUS_CHOICES = [
        ('Scheduled', 'Scheduled'),
        ('Completed', 'Completed'),
        ('Ongoing', 'Ongoing'),
        ('Archived', 'Archived'), 
    ]

    ELECTION_TYPE_CHOICES = [
        ('Candidates', 'Candidates'),
        ('Topics', 'Topics'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    startDate = models.DateTimeField()
    endDate = models.DateTimeField()
    timezone = models.CharField(max_length=50, blank=True, null=True)
    electionType = models.CharField(max_length=10, choices=ELECTION_TYPE_CHOICES, default='Candidates')
    candidates = models.JSONField(blank=True, null=True)
    topics = models.JSONField(blank=True, null=True)
    voters = models.JSONField(blank=True, null=True)
    votersDept = models.JSONField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Scheduled')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'elections'

    def __str__(self):
        return self.title

class OngoingElection(models.Model):
    ELECTION_TYPE_CHOICES = [
        ('Candidates', 'Candidates'),
        ('Topics', 'Topics'),
    ]

    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    startDate = models.DateTimeField()
    endDate = models.DateTimeField()
    timezone = models.CharField(max_length=50, blank=True, null=True)
    electionType = models.CharField(max_length=10, choices=ELECTION_TYPE_CHOICES, default='Candidates')
    candidates = models.JSONField(blank=True, null=True)
    topics = models.JSONField(blank=True, null=True)
    voters = models.JSONField(blank=True, null=True)
    votersDept = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        db_table = 'ongoing_elections'

    def __str__(self):
        return self.title    
    

class ElectionVoterStatus(models.Model):
    election_voter_status_id = models.AutoField(primary_key=True)
    election = models.ForeignKey(Election, on_delete=models.CASCADE, db_column='election_id')
    # if an Election is deleted, all associated ElectionVoterStatus records are also deleted
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE, db_column='userid')
    #if a UserAccount is deleted, all associated ElectionVoterStatus records are also deleted
    
    has_voted = models.BooleanField(default=False)

    class Meta:
        unique_together = ('election', 'user')
        db_table = 'election_voter_status'

    def __str__(self):
        return f"User: {self.user}, Election: {self.election}, Has Voted: {self.has_voted}"


class EncryptedTally(models.Model):
    election_id = models.IntegerField()
    uuid = models.CharField(max_length=36)  # Store UUID as a string (36 characters for a standard UUID)
    encrypted_tally = models.TextField()  # Store the encrypted tally as a text (e.g., base64-encoded string)

    class Meta:
        unique_together = ('election_id', 'uuid')
        db_table = 'encrypted_tally'



class CompletedElection(models.Model):
    completed_election_id = models.AutoField(primary_key=True)
    election = models.ForeignKey(
        'Election',  # References the Election model
        on_delete=models.CASCADE,
        db_column='election_id'
    )
    title = models.CharField(max_length=255)
    candidates = models.JSONField(blank=True, null=True)
    topics = models.JSONField(blank=True, null=True)
    uuid = models.CharField(max_length=36)  # Store UUID as a string (36 characters for a standard UUID)
    tally = models.IntegerField()

    class Meta:
        db_table = 'completed_elections'
        unique_together = ('election', 'uuid')  # Ensures that each (election_id, uuid) pair is unique

    def __str__(self):
        return f"{self.title} ({self.uuid})"


class ArchivedElection(models.Model):
    archived_election_id = models.AutoField(primary_key=True)
    election_id = models.IntegerField()  
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    startDate = models.DateTimeField()
    endDate = models.DateTimeField()
    timezone = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = 'archived_elections'

    def __str__(self):
        return f"{self.title} (Archived)"
