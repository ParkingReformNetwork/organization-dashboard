import axios from "axios";
import { Point } from "@influxdata/influxdb-client";
import { createCountPoint } from "./utils";

const mastodonApi =
  "https://mastodon.social/api/v1/accounts/lookup?acct=@parkingreform@urbanists.social";

const getCurrentPoints = async (): Promise<Point[]> => {
  const mastodonResponse = await axios.get(mastodonApi);

  const mastodonFollowersPoint = createCountPoint(
    "mastodon-followers-count",
    mastodonResponse.data.followers_count
  );

  const mastodonPostsPoint = createCountPoint(
    "mastodon-posts-count",
    mastodonResponse.data.statuses_count
  );
  return [mastodonFollowersPoint, mastodonPostsPoint];
};

export default {
  getCurrentPoints,
};
