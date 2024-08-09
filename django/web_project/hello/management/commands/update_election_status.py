from django.core.management.base import BaseCommand
from django.utils import timezone
from hello.models import Election, OngoingElection

class Command(BaseCommand):
    help = 'Update election statuses and add ongoing elections to OngoingElection table'

    def handle(self, *args, **kwargs):
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

        self.stdout.write(self.style.SUCCESS('Successfully updated election statuses and added ongoing elections'))
