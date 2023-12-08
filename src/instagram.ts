import axios from "axios";
import { Point } from "@influxdata/influxdb-client";
import { createCountPoint } from "./utils";
import { EnvVars, readEnvVars } from "./envVars";

const getCurrentPoints = async (envVars: EnvVars): Promise<Point[]> => {
  const api = `https://graph.facebook.com/v18.0/${envVars.IG_USER_ID}?fields=followers_count,media_count&`;
  const response = await axios.get(
    `${api}access_token=${envVars.IG_ACCESS_TOKEN}`
  );

  const followersPoint = createCountPoint(
    "instagram-followers-count",
    response.data.followers_count
  );

  const postsPoint = createCountPoint(
    "instagram-posts-count",
    response.data.media_count
  );

  return [followersPoint, postsPoint];
};

/* a potential way to refresh the access token 
const refreshEndpoint =
  "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&";

const refreshIgToken = async (envVars: EnvVars) => {
  const igResponse = await axios.get(
    `${refreshEndpoint}access_token=${envVars.IG_ACCESS_TOKEN}`
  );
  console.log(igResponse.data);
};
*/

export default {
  getCurrentPoints,
};
