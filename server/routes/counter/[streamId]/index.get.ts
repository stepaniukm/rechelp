import { serialize } from "superjson";
import { evolve, getInitialState } from "~/app/counter";
import { eventStore } from "~/app/event-store";

export default eventHandler(async (event) => {
  try {
    const streamId = getRouterParam(event, "streamId");

    if (!streamId) {
      setResponseStatus(event, 400);
      return sendError(event, new Error("Stream ID is required"));
    }

    const data = await eventStore.aggregateStream(streamId, {
      evolve,
      getInitialState,
    });

    return serialize(data);
  } catch (e) {
    setResponseStatus(event, 500);
    return sendError(event, new Error("Something went wrong!"));
  }
});
