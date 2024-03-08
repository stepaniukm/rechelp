import { submitCounter, handle } from "~/app/counter";
import { eventStore } from "~/app/event-store";
import { serialize } from "superjson";

export default eventHandler(async (event) => {
  try {
    const streamId = getRouterParam(event, "streamId");

    if (!streamId) {
      setResponseStatus(event, 400);
      return sendError(event, new Error("Stream ID is required"));
    }

    const data = await handle(eventStore, streamId, (state) =>
      submitCounter(
        {
          type: "SubmitCounter",
          data: {},
        },
        state,
      ),
    );

    return serialize(data);
  } catch (e) {
    setResponseStatus(event, 500);
    return sendError(event, new Error("Something went wrong!"));
  }
});
