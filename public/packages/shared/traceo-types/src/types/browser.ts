export type BrowserInfoType = {
  browser: {
    name?: string;
    version?: string;
  };
  os: {
    name?: string;
    version?: string;
    versionName?: string;
  };
  platform: {
    type?: string;
  };
  engine: {
    name?: string;
    version?: string;
  };
  url: string;
};

export type MeasureType = {
  name: string | undefined;
  unit: string | undefined;
  value: string | number | boolean | null | undefined;
};

export type BrowserPerfsPayloadEvent = {
  event: string;
  timestamp: number;

  // pathname for the view where data has been scrapped
  // needed for analytics features
  view: string;
  browser: {
    // eq. Chrome, Mozilla, Edge
    name: string;
    version: string;
  };
  platform: {
    // mobile/desktop
    type: string;
  };
  performance: MeasureType[];
};
