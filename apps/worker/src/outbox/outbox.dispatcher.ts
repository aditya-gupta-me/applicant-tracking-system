import type { OutboxEvent } from "../../../api/src/generated/prisma/client";
import { publishMessage } from "../infrastructure/rabbitmq";
import { claimPendingEvents, getPendingEvents, markAsPublished, scheduleRetry } from "./outbox.repository";

async function dispatchOutboxEvents() {

    const pendingEvents = await getPendingEvents();

    console.log('Unpublished events:', pendingEvents.length);
    console.log(pendingEvents);


    const events: OutboxEvent[] | null = await claimPendingEvents();

    if(events === null) {
        console.log('ERROR: Outbox Events are null.');

        return;
    }

    console.log('Claimed events: ', events.length);

    for(const event of events) {

        try {
            console.log('Payload: ', {
        message: event.id,
                eventType: event.eventType,
                payload: event.payload
    });

            await publishMessage("resume_extraction", {
                messageId: event.id,
                eventType: event.eventType,
                payload: event.payload
            })

            await markAsPublished(event.id);
        } catch(error) {
            console.error("ERROR: ");
            await scheduleRetry(event.id, error);
        }
        
    }
}

export { dispatchOutboxEvents };