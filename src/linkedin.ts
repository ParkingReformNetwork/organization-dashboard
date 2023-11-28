import axios from "axios";
import { Point } from "@influxdata/influxdb-client";
import { createCountPoint } from "./utils";

const linkedinUrl =
  "https://www.linkedin.com/pages-extensions/FollowCompany?id=65483556&counter=bottom";

const getCurrentPoints = async (): Promise<Point> => {
  const linkedinResponse = await axios.get(linkedinUrl);
  const divClassRegex = /<div[^>]*class="follower-count"[^>]*>(.*?)<\/div>/;
  const followersCount = linkedinResponse.data.match(divClassRegex);
  const linkedinFollowersPoint = createCountPoint(
    "linkedin-followers-count",
    Number(followersCount[1])
  );

  return linkedinFollowersPoint;
};

export default {
  getCurrentPoints,
};
