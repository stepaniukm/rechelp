import { serialize } from "superjson";
import { incrementCounter, handle } from "~/app/counter";
import { eventStore } from "~/app/event-store";

export default eventHandler(async (event) => {
  try {
    const streamId = getRouterParam(event, "streamId");
    const query = getQuery(event);

    const by = query.by;

    if (Array.isArray(by)) {
      setResponseStatus(event, 400);
      return sendError(event, new Error("By must be a single value"));
    }

    const byValue = Number(by) || 1;

    if (!streamId) {
      setResponseStatus(event, 400);
      return sendError(event, new Error("Stream ID is required"));
    }

    const data = await handle(eventStore, streamId, (state) =>
      incrementCounter(
        {
          type: "IncrementCounter",
          data: { counterId: streamId, by: byValue },
        },
        state,
      ),
    );

    return serialize(data);
  } catch (e) {
    console.error(e);
    setResponseStatus(event, 500);
    return sendError(event, new Error("Something went wrong!"));
  }
});
