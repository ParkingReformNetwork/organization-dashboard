import { Point } from "@influxdata/influxdb-client";
import axios from "axios";
import { JSDOM } from "jsdom";

import { createCountPoint } from "./utils";

const getCurrentPoints = async (): Promise<Point[]> => {
  // Load response into a variable
  const response = await axios.get("https://parkingreform.org/", {
    responseType: "text",
  });
  
  // Load DOM into a varialbe
  const dom = new JSDOM(response.data);
  const document = dom.window.document;

  // Select part of HTML to parse
  const footer = document.querySelector("footer");
  if (!footer) {
    throw new Error("Could not find footer!");
  }
  console.log(footer.outerHTML);

  // Name the point
  // This point is numbered using a hard-coded metric
  return [createCountPoint("instagram-followers", 2000)];
};

export default {
  getCurrentPoints
};
