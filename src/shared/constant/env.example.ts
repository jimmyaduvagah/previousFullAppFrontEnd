

export class ENV {
  public static DEV_MODE = false;
  public static DESKTOP_MODE = false;
  public static PROTOCOL = 'https';
  public static DOMAIN = 'platform.tunaweza.com';
  public static BASE_URL = '/api/';
  public static API_VERSION = '1';
  public static APP_VERSION = '0.1.5';
  public static PUSH_GROUP = 'tw_prod'; // make tw_dev for dev builds
  public static PUSH_GOOGLE_SENDER_ID = '502801541439';
  public static UPLOAD_BASE = 'https://platform.tunaweza.com/static/uploads/';
  public static ANALYTICS = {
    GOOGLE: {
      TRACKING_ID: 'UA-75702652-2'
    }
  }
}
