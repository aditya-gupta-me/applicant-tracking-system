import { consumeMessage } from "./src/infrastructure/rabbitmq";
import { dispatchOutboxEvents } from "./src/outbox/outbox.dispatcher";


async function main() {
    console.log('Came inside main function.');

    console.log('consume event');
    await consumeMessage("resume_extraction");

    const dispatch = async () => {
        console.log('publish event');
        await dispatchOutboxEvents();
    };

    await dispatch();
    setInterval(dispatch, 5000);
}

main();