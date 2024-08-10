from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .utilities import vote_handling
import traceback
import json
from hello.acc.jsonFuncs import jsonReader
from .serializer import ElectionSerializer, OngoingElectionSerializer
from rest_framework import generics
from datetime import datetime
import pytz
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import uuid
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256

from .models import Election, UserAccount, ElectionVoterStatus, Department, OngoingElection
from hello.mySQLfuncs import sql_validateLogin, sql_insertAcc, get_ongoing_user_elections_with_status, update_election_voter_status


import os
import pickle
import base64
from dotenv import load_dotenv
from phe import paillier

# Load environment variables from the .env file
load_dotenv()

public_key_serialized = os.getenv('PAILLIER_PUBLIC_KEY')
private_key_serialized = os.getenv('PAILLIER_PRIVATE_KEY')

# Decode from base64
pail_public_key_bytes = base64.b64decode(public_key_serialized)
# Deserialize the public key
pail_public_key = pickle.loads(pail_public_key_bytes)

# Decode from base64
pail_private_key_bytes = base64.b64decode(private_key_serialized)
# Deserialize the public key
pail_private_key = pickle.loads(pail_private_key_bytes)


# Convert the public key to a JSON-compatible format
pail_public_key_json = {
    "n": str(pail_public_key.n),  # Paillier public key's modulus (big integer as string)
}

# Define global variables
candidate_mapping = {}
topic_mapping = {}
subject_uuids_dict = {
    'candidates': candidate_mapping,
    'topics': topic_mapping
}

encrypted_tallies = {}

def initialize_tally(election_id, candidates, topics):
    global encrypted_tallies
    
    # Create a dictionary for the election's tallies
    encrypted_tallies[election_id] = {}
    print(f"Initializing tally for election {election_id}")
    
    print("Candidates:", candidates)
    print("Topics:", topics)

    # Initialize encrypted tally for each candidate
    for candidate in candidates:
        candidate_uuid = convert_uuid_to_bigint(candidate['uuid']) #convert string uuid into bigInt data type
        # Set the initial tally for the candidate to 0, encrypted with the public key
        encrypted_tallies[election_id][candidate_uuid] = paillier.EncryptedNumber(pail_public_key, 0)
        
    # Initialize encrypted tally for each topic
    for topic in topics:
        topic_uuid =  convert_uuid_to_bigint(topic['uuid']) #convert string uuid into bigInt data type
        # Set the initial tally for the topic to 0, encrypted with the public key
        encrypted_tallies[election_id][topic_uuid] = paillier.EncryptedNumber(pail_public_key, 0)
        
    print("Updated encrypted_tallies:", encrypted_tallies)


@csrf_exempt  # Remove for production (CSRF protection for token endpoint)
def CSRFTokenDispenser(request):
  return JsonResponse({'csrfToken': request.META['CSRF_TOKEN']})


#LOGIN FUNCTIONS
def jsonReader(filepath):
  """
  This function reads a JSON file from the specified path and returns the data as a Python object.

  Args:
      filepath (str): The path to the JSON file.

  Returns:
      object: The data parsed from the JSON file.

  Raises:
      FileNotFoundError: If the specified file is not found.
      JSONDecodeError: If there's an error parsing the JSON data.
      
  TODO: MAYBE, be able to decypt an encrypted json data. Maybe only the data needs to encrypted, the JSON format stays? IDK
  """
  try:
    with open(filepath, 'r') as json_file:
      data = json.load(json_file)
    return data
  except FileNotFoundError:
    raise FileNotFoundError(f"Error: JSON file not found at {filepath}")
  except json.JSONDecodeError:
    raise JSONDecodeError(f"Error: Unable to decode JSON data in {filepath}")


def jsonReader(filePath):
    with open(filePath, 'r') as file:
        return json.load(file)


@csrf_exempt
def loginFunc(request):
    if request.method == 'POST':
        try:
            # Access JSON data from request body
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            if not username or not password:
                return JsonResponse({'error': 'Missing username or password', 'username':username, 'password':password}, status=400)
            
            check = sql_validateLogin(username, password) 
            
            if check == 'deny':
                return JsonResponse({'RESULT': 'deny'})
            else:
                return JsonResponse({'RESULT': check})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
            
            
@csrf_exempt
def insertAcc(request):
    if request.method == 'POST':
        try:
            # Access JSON data from request body
            data = json.loads(request.body)
            usern = data.get('usern')
            passw = data.get('passw')
            usert = data.get('usert')
            frstn = data.get('frstn')
            lastn = data.get('lastn')
            dpt = data.get('dpt')
            
            if not usern or not passw or not usert:
                return JsonResponse({'error': 'Missing username or password or usertype', 'username':usern, 'password':passw}, status=400)
            insert = sql_insertAcc(usern, passw, usert, frstn, lastn, dpt)
            
            
            if insert == 'failed':
                return JsonResponse({'RESULT': 'denied'})
            else:
                return JsonResponse({'RESULT': 'success'})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)    
    
@csrf_exempt
def handle_new_election(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        title = data.get('title')
        description = data.get('description')
        start_date_str = data.get('startDate')
        end_date_str = data.get('endDate')
        timezone_str = data.get('timezone')
        electionType = data.get('electionType')
        candidates = data.get('candidates', [])
        topics = data.get('topics', [])
        voters = data.get('voters', [])
        voters_dept = data.get('votersDept', [])

        try:
            # Validate and adjust the timezone string
            if timezone_str.startswith('GMT') and len(timezone_str) > 3:
                offset = int(timezone_str[3:])
                # Adjust the timezone string for pytz compatibility
                timezone_str = f'Etc/GMT{-offset}' if offset >= 0 else f'Etc/GMT+{abs(offset)}'

            # Convert string dates to datetime objects
            start_date = datetime.fromisoformat(start_date_str)
            end_date = datetime.fromisoformat(end_date_str)

            # Convert to specified timezone
            user_timezone = pytz.timezone(timezone_str)
            start_date = user_timezone.localize(start_date)
            end_date = user_timezone.localize(end_date)

            # Convert to UTC
            start_date_utc = start_date.astimezone(pytz.utc)
            end_date_utc = end_date.astimezone(pytz.utc)

            # Create and save the Election instance
            new_election = Election(
                title=title,
                description=description,
                startDate=start_date_utc,
                endDate=end_date_utc,
                timezone=timezone_str,
                electionType=electionType,
                candidates=candidates,
                topics=topics,
                voters=voters,
                votersDept=voters_dept
            )
            new_election.save()

            # Retrieve the election ID
            election_id = new_election.id

            # Initialize the tally for each candidate and for each topic in the election
            initialize_tally(election_id, candidates, topics)
            
            # Add voters to ElectionVoterStatus
            add_voters_to_status(new_election)

            return JsonResponse({'status': 'success', 'message': 'Election created successfully'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


#updates the election-voter-status table
def add_voters_to_status(election):
    # Add individual voters based on voterEmail
    if election.voters:
        for voter in election.voters:
            voter_email = voter.get("voterEmail")
            if voter_email:
                try:
                    # Check if the user is of type 'Voter'
                    user = UserAccount.objects.get(username=voter_email, usertype='Voter')
                    ElectionVoterStatus.objects.create(election=election, user=user)
                except UserAccount.DoesNotExist:
                    print(f"User with email {voter_email} does not exist or is not a 'Voter'.")
                    pass

    # Add voters by department based on departmentname
    if election.votersDept:
        for dept in election.votersDept:
            department_name = dept.get("departmentname")
            if department_name:
                try:
                    department = Department.objects.get(departmentname=department_name)
                    # Filter users by department and check if they are 'Voter' type
                    users = UserAccount.objects.filter(department=department, usertype='Voter')
                    if not users.exists():
                        print(f"No 'Voter' users found in department {department_name}.")
                    else:
                        for user in users:
                            ElectionVoterStatus.objects.create(election=election, user=user)
                except Department.DoesNotExist:
                    print(f"Department {department_name} does not exist.")
                    pass


class DisplayElections(generics.ListAPIView):
    queryset = Election.objects.all()
    serializer_class = ElectionSerializer

@csrf_exempt
def delete_election(request, id):
    if request.method == 'DELETE':
        try:
            election = Election.objects.get(id=id)
            election.delete()
            # delete_election_voter_status(election)
            
            return JsonResponse({'message': 'Election deleted successfully'}, status=200)
        except Election.DoesNotExist:
            return JsonResponse({'error': 'Election not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

# @csrf_exempt
# def delete_election_voter_status(election):
#     """Helper function to delete all ElectionVoterStatus records related to an election."""
#     ElectionVoterStatus.objects.filter(election=election).delete()


@api_view(['GET'])
def get_user_elections(request):
    if request.method == 'GET':
        userid = request.GET.get('userid')
        update_election_statuses() ###########################################################to delete once the cron jobs is up
        elections = get_ongoing_user_elections_with_status(userid)
        serializer = OngoingElectionSerializer(elections, many=True)
        return Response({'elections': serializer.data}, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid HTTP method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
  
  
def verify_signature_with_public_key(encrypted_vote_data, digital_signature, public_key_pem):
    # Convert PEM-formatted public key to an RSA key object
    public_key = RSA.import_key(public_key_pem)

    # Create a SHA-256 hash of the encrypted vote data
    h = SHA256.new(encrypted_vote_data.encode('utf-8'))

    # Decode the base64-encoded signature
    signature = base64.b64decode(digital_signature)

    try:
        # Verify the signature using the public key and the hash
        pkcs1_15.new(public_key).verify(h, signature)
        return True
    except (ValueError, TypeError):
        return False
    
@csrf_exempt
def handle_Vote(request):
    global encrypted_tallies
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            vote_str = data.get('voteData')  # Encrypted vote data as string
            rsa_public_key_data = data.get('publicKey')  # RSA Public key data
            signature = data.get('digitalSignature')
            election_id = data.get('electionid')

            #user_id = data.get('userid') #user id, dervied from session
            
            
            print("Signature:", signature)
            print("Public Key:", rsa_public_key_data)
            print("Type of RSA Public Key Data:", type(rsa_public_key_data))
            print("ELECTION ID:", election_id)
            
            
            #verify the signature
            is_signature_valid = verify_signature_with_public_key(vote_str, signature, rsa_public_key_data)

            if not is_signature_valid:
                return JsonResponse({'status': 'error', 'message': 'Invalid digital signature'}, status=400)
            else:
                print('digital signature has been verified\n')
                
            # Convert the vote string back to an EncryptedNumber
            encrypted_vote = paillier.EncryptedNumber(pail_public_key, int(vote_str))
            # Decrypt the vote
            decrypted_vote = pail_private_key.decrypt(encrypted_vote)
            print("Decrypted vote:", decrypted_vote)
            
            print(encrypted_tallies)
            if election_id not in encrypted_tallies: #might cause frequent errors if the global tally dictionary is reset
                return JsonResponse({'status': 'error', 'message': 'Election not found'}, status=404)
            print()
            
            map_uuid_to_subject_in_ongoing_election()
            vote_value = find_voted_subject_by_uuid_and_increment_vote(decrypted_vote)
            print(vote_value)
            
            #update the EVS table accordingly, set the voter's has_voted to a true value
            update_election_voter_status(election_id, 29, 1)
            
            # Return a success response
            return JsonResponse({'status': 'success', 'message': 'Vote submitted successfully'})
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)  
  
  
@csrf_exempt    
def get_paillier_public_key(request):
    return JsonResponse(pail_public_key_json)   

def convert_uuid_to_bigint(uuid_str):
    # Convert UUID string to BigInt
    return int(uuid.UUID(uuid_str).hex, 16)


#populate the uuid dictionaries from the json retrieved from the ongoing elections
def map_uuid_to_subject_in_ongoing_election():
    global candidate_mapping, topic_mapping, subject_uuids_dict
    
    # Retrieve all ongoing elections
    ongoing_elections = OngoingElection.objects.all()
    
    # Create lists to store all candidates and topics from each election
    all_candidates = []
    all_topics = []
    
    for election in ongoing_elections:
        # Extract candidates and topics from each election
        all_candidates.extend(election.candidates)
        all_topics.extend(election.topics)
    
    # Clear the previous mappings
    candidate_mapping.clear()
    topic_mapping.clear()
    
    # Populate the candidate mapping dictionary
    for candidate in all_candidates:
        uuid = candidate.get('uuid')
        name = candidate.get('name')
        email = candidate.get('email')
        if uuid and name and email:
            key = f"{name} | {email}"  # Combine name and email as the key
            uuid_bigint = convert_uuid_to_bigint(uuid) #Convert all the string uuids into big int data type
            candidate_mapping[key] = uuid_bigint
    
    # Populate the topic mapping dictionary
    for topic in all_topics:
        uuid = topic.get('uuid')
        name = topic.get('name')
        if uuid and name:
            uuid_bigint = convert_uuid_to_bigint(uuid) #Convert all the string uuids into big int data type           
            topic_mapping[name] = uuid_bigint
    
    # Update the combined dictionary
    subject_uuids_dict['candidates'] = candidate_mapping
    subject_uuids_dict['topics'] = topic_mapping
    
    print('Printing the mapped UUID dictionary:', subject_uuids_dict)


#Finds the candidate voted for by comparing the bigInt UUIDs and handles the vote incrementation
def find_voted_subject_by_uuid_and_increment_vote(electionid, uuid):
    global candidate_mapping, topic_mapping, subject_uuids_dict
    
    # Search in candidates
    for key, uuid_value in subject_uuids_dict['candidates'].items():
        if uuid_value == uuid:
            name, email = key.split(' | ')
            print("The record voted for is: {'type': 'candidate' , 'name': ", name, "'email':" , email,"}") 
            increment_vote(electionid, uuid) #once the relevant candidate has been found, increment the vote count
            return name
    
    # Search in topics
    for topic_name, uuid_value in subject_uuids_dict['topics'].items():
        if uuid_value == uuid:
            print("The record voted for is: {'type': 'topic' , 'name': ", topic_name, "}") 
            increment_vote(electionid, uuid) #once the relevant candidate has been found, increment the vote count
            return topic_name
    
    # If UUID not found
    return None

def increment_vote(electionid, uuid, increment=1):
    global encrypted_tallies
    encrypted_increment = paillier.EncryptedNumber(pail_public_key, increment) #encrypting 1 with paillier

    # Retrieve the current encrypted tally for the given UUID
    current_tally = encrypted_tallies[electionid][uuid]
    
    # Increase the tally by adding the encrypted increment
    updated_tally = current_tally + encrypted_increment
    
    # Update the tally in the encrypted_tallies dictionary
    encrypted_tallies[electionid][uuid] = updated_tally
    
    print(f"Tally updated for UUID {uuid}: {encrypted_tallies[electionid][uuid]}")



###################################delete once the cron jobs is up
from django.utils import timezone

def update_election_statuses():
    now = timezone.now()
    
    # Step 1: Update the status of all elections
    elections = Election.objects.all()
    for election in elections:
        if election.startDate > now:
            election.status = 'Scheduled'
        elif election.startDate <= now <= election.endDate:
            election.status = 'Ongoing'
        else:
            election.status = 'Completed'
        election.save()

    # Step 2: Check and add ongoing elections to OngoingElection table
    for election in elections:
        if election.status == 'Ongoing':
            # Check if the election already exists in OngoingElection table
            ongoing_election_exists = OngoingElection.objects.filter(id=election.id).exists()
            
            if not ongoing_election_exists:
                # Add the ongoing election to the OngoingElection table
                OngoingElection.objects.create(
                    id=election.id,
                    title=election.title,
                    description=election.description,
                    startDate=election.startDate,
                    endDate=election.endDate,
                    timezone=election.timezone,
                    electionType=election.electionType,
                    candidates=election.candidates,
                    topics=election.topics,
                    voters=election.voters,
                    votersDept=election.votersDept
                )
    print('Electoins have been updated')