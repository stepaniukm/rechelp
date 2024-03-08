import { EventStoreDBClient } from "@eventstore/db-client";
import { getEventStoreDBEventStore } from "@event-driven-io/emmett-esdb";

export const esdbClient = EventStoreDBClient.connectionString`esdb://127.0.0.1:2113?tls=false`;

export const eventStore = getEventStoreDBEventStore(esdbClient);
