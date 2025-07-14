import { ListingAPI } from "./datasources/listing-api";

export type DataSourceContext = {
    dataSources: {
        listingAPI: ListingAPI;
    };
};