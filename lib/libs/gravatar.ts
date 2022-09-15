import * as gr from "gravatar";

const url = (value: string, type: "retro" | "identicon") => {
  return gr.url(value, { s: "100", r: "x", d: type, f: "y" }, false);
};

const profile = (value: string, type: "retro" | "identicon") => {
  return gr.profile_url(value, { s: "100", r: "x", d: type, f: "y" }, false);
};

export const gravatar = {
  url,
  profile
};
