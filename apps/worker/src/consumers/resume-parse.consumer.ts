// Receive the message.
// Validate its structure.
// Check whether the event has already been processed.
// Call the resume parsing service.
// Acknowledge the message after successful processing and database persistence.
// Handle failures through your retry and dead-letter strategy.

import { prisma } from "../../../api/src/lib/prisma";
import { createConfirmChannel } from "../infrastructure/rabbitmq";
import { messageEventSchema } from "@repo/schema";
import { z } from 'zod';


// return true
// if the message is already processed
// else return false
async function checkAlreadyProcessedMessage(extractionId: string) {
    try{
        const result = await prisma.resumeExtraction.findFirst({
            where: {
                id: extractionId
            }
        })

        if(result) {
            return true;
        }

        return false;
    } catch(error) {
        console.error("ERROR:", error);
        return;
    }
}

async function consumeResumeMessage(queue: string) {
    const channel = await createConfirmChannel();

    if(!channel) {
        throw new Error('Could not create a RabbitMQ confirm channel.')
    }

    try {
        await channel.assertQueue(queue, {
            durable: true,
            arguments: { 'x-queue-type': 'quorum' }
        })

        channel.prefetch(1);

        await channel.consume(queue, async function(msg) {
            const message = z.safeParse(messageEventSchema, msg);

            // early return
            // if validation failed
            if(!message.success) {
                return message.error.message;
            }

            const messageAlreadyProcessed = await checkAlreadyProcessedMessage(message.data.payload.extractionId);

            // TODO: add more rigid return statement
            if(messageAlreadyProcessed) {
                return;
            }

            
        })
    } catch(error) {
        console.error(error);
        return;
    }
}