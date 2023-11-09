import axios from "axios";
import { Point } from "@influxdata/influxdb-client";
import { createCountPoint } from "./utils";

const mastodon_api =
  "https://mastodon.social/api/v1/accounts/lookup?acct=@parkingreform@urbanists.social";

const getCurrentPoints = async (): Promise<Point[]> => {
  const mastodon_Response = await axios.get(mastodon_api);

  const mastodon_followers_point = createCountPoint(
    "mastodon-followers-count",
    mastodon_Response.data.followers_count
  );

  const mastodon_posts_point = createCountPoint(
    "mastodon-posts-count",
    mastodon_Response.data.statuses_count
  );
  return [mastodon_followers_point, mastodon_posts_point];
};

export default {
  getCurrentPoints,
};
