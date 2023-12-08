import axios from "axios";
import { Point } from "@influxdata/influxdb-client";
import { createCountPoint } from "./utils";

const linkedinUrl =
  "https://www.linkedin.com/pages-extensions/FollowCompany?id=65483556&counter=bottom";

const parseHtml = (html: string): Point => {
  const divClassRegex = /<div[^>]*class="follower-count"[^>]*>(.*?)<\/div>/;
  const followersCount = html.match(divClassRegex);
  if (followersCount === null) {
    throw new Error(
      "Error retrieving HTML. Please make sure the url is correct."
    );
  } else {
    return createCountPoint(
      "linkedin-followers-count",
      Number(followersCount[1])
    );
  }
};

const getCurrentPoints = async (): Promise<Point> => {
  const linkedinResponse = await axios.get(linkedinUrl);
  return parseHtml(linkedinResponse.data);
};

export default {
  parseHtml,
  getCurrentPoints,
};
