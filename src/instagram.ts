import "dotenv/config";
import axios from "axios";
import { Point } from "@influxdata/influxdb-client";
import { createCountPoint } from "./utils";

const instagramApi = `https://graph.facebook.com/v18.0/${process.env.IG_USER_ID}?fields=followers_count,media_count&`;

const getCurrentPoints = async (): Promise<Point[]> => {
  const igResponse = await axios.get(
    instagramApi + "access_token=" + process.env.IG_ACCESS_TOKEN
  );

  const instagramFollowersPoint = createCountPoint(
    "instagram-followers-count",
    igResponse.data.followers_count
  );

  const instagramPostsPoint = createCountPoint(
    "instagram-posts-count",
    igResponse.data.media_count
  );

  return [instagramFollowersPoint, instagramPostsPoint];
};

/* a potential way to refresh the access token 
const instagramRefreshEndpoint =
  "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&";

const refreshIgToken = async () => {
  const igResponse = await axios.get(
    instagramRefreshEndpoint + "access_token=" + process.env.IG_ACCESS_TOKEN
  );
  console.log(igResponse.data);
};
*/

export default {
  getCurrentPoints,
};
