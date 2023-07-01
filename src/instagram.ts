import { Point } from "@influxdata/influxdb-client";
import axios from "axios";
import { JSDOM } from "jsdom";

import { createCountPoint } from "./utils";

const getCurrentPoints = async (): Promise<Point[]> => {
  const response = await axios.get("https://parkingreform.org/", {
    responseType: "text",
  });
  const dom = new JSDOM(response.data);
  const document = dom.window.document;
  const footer = document.querySelector("footer");
  if (!footer) {
    throw new Error("Could not find footer!");
  }
  console.log(footer.outerHTML);
  return [createCountPoint("instagram-followers", 2000)];
};

export default {
  getCurrentPoints,
};
