import type { OutboxEvent } from '../../../api/src/generated/prisma/client';
import { prisma } from '../../../api/src/lib/prisma';

// for debugging process
async function getPendingEvents() {
    const events: OutboxEvent[] | null = await prisma.outboxEvent.findMany({
        where: {
            publishedAt: null
        },
        orderBy: {
            createdAt: "asc"
        }
    })

    return events;
}

async function claimPendingEvents() {
    const events: OutboxEvent[] | null = await prisma.$queryRaw<OutboxEvent[] | null>`
    WITH events AS (
        SELECT id
        FROM "outbox_event"
        WHERE "publishedAt" IS NULL
        AND (
            "nextAttemptAt" IS NULL
            OR "nextAttemptAt" <= NOW()
        )
        AND (
            "lockedUntil" IS NULL
            OR "lockedUntil" <= NOW()
        )
        ORDER BY "createdAt"
        FOR UPDATE SKIP LOCKED
        LIMIT 50
    )
    UPDATE "outbox_event" AS e
    SET
        "lockedBy" = 'dispatcher-A',
        "lockedUntil" = NOW() + INTERVAL '1 minute',
        "attempts" = e."attempts" + 1
        FROM events
        WHERE e.id = events.id
        RETURNING e.*;
    `;

    return events;
}

async function markAsPublished(eventId: string) {
    const published = await prisma.outboxEvent.update({
        where: {
            id: eventId
        },
        data: {
            publishedAt: new Date()
        }
    });

    return published;
}

async function scheduleRetry(eventId: string, error: any | unknown) {
    const nextSchedule = await prisma.outboxEvent.update({
        where: {
            id: eventId
        },
        data: {
            lastError: error,
            nextAttemptAt: new Date(Date.now() + 5 * 60 * 1000),
        }
    });

    return nextSchedule;
}

export { getPendingEvents, claimPendingEvents, markAsPublished, scheduleRetry };