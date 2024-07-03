/* eslint-disable no-param-reassign */

type Geolocation = {
  statuses: {
    api: boolean;
    permission?: 'granted' | 'denied' | 'prompt';
  };
  geolocationPosition?: {
    accuracy: number;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    latitude: number;
    longitude: number;
    speed: number | null;
    timestamp: number;
  };
  error?: {
    code: number;
    message: string;
  };
};

type GeolocationError = {
  success: false;
  error: {
    code: number;
    message: string;
  };
};

type GeolocationPositionRes = GeolocationPosition | GeolocationError;

const geoOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 10 * 1000,
};

export async function getGeolocation(): Promise<Geolocation | null> {
  try {
    const res: Geolocation = {
      statuses: {
        api: true,
      },
    };

    if (!navigator.geolocation) {
      res.statuses.api = false;

      return res;
    }

    const permission = await navigator.permissions.query({ name: 'geolocation' });
    res.statuses.permission = permission.state;

    if (permission.state === 'denied') {
      return res;
    }

    const geolocationRes = await getGeolocationPosition();
    handleGeolocationData(res, geolocationRes);

    return res;
  } catch (err) {
    console.error(err);

    return null;
  }
}

async function getGeolocationPosition(): Promise<GeolocationPositionRes> {
  return new Promise<GeolocationPositionRes>((resolve) => {
    const rejector = (err) => {
      resolve({
        success: false,
        error: {
          code: err.code,
          message: err.message,
        },
      });
    };

    navigator.geolocation.getCurrentPosition(resolve, rejector, geoOptions);
  });
}

function handleGeolocationData(result: Geolocation, geolocationPosition: GeolocationPositionRes): void {
  if (isGeolocationPosition(geolocationPosition)) {
    result.geolocationPosition = {
      timestamp: geolocationPosition.timestamp,
      latitude: geolocationPosition.coords.latitude,
      longitude: geolocationPosition.coords.longitude,
      accuracy: geolocationPosition.coords.accuracy,
      altitude: geolocationPosition.coords.altitude,
      altitudeAccuracy: geolocationPosition.coords.altitudeAccuracy,
      heading: geolocationPosition.coords.heading,
      speed: geolocationPosition.coords.speed,
    };
  } else if (isGeolocationError(geolocationPosition)) {
    // error.code can be:
    //   0: unknown error
    //   1: permission denied
    //   2: position unavailable (error response from location provider)
    //   3: timed out
    result.error = geolocationPosition.error;
  } else {
    console.error('Unknown result type from getGeolocationData() :>>', geolocationPosition);
  }
}

function isGeolocationPosition(obj: any): obj is GeolocationPosition {
  return !!(obj as GeolocationPosition).coords;
}

function isGeolocationError(obj: any): obj is GeolocationError {
  return !!(obj as GeolocationError).error;
}
