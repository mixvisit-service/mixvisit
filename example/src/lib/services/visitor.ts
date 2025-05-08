import { LOCAL_STORAGE_VARS } from '$lib/constants';

import { formatDate, formatDateDifference } from '$lib/utils/common';
import { VisitStatus } from '$lib/enums';
import type { VisitData, VisitorData, VisitorInfo, VisitorStorageData } from '$lib/types';

/**
 * Generate VisitData array based on VisitorStorageData array.
 *
 * @param visitorStorageDataArr - An array of VisitorStorageData objects.
 * @returns An array of VisitData objects.
 */
export function genereteVisitDataArr(visitorStorageDataArr: VisitorStorageData[]): VisitData[] {
  return visitorStorageDataArr.reduce((res, item, idx) => {
    let visitStatus = VisitStatus.Prev;

    const arrLength = visitorStorageDataArr.length;
    if (arrLength === 1 || arrLength === idx + 1) {
      visitStatus = VisitStatus.Curr;
    }

    if (!idx) {
      visitStatus = VisitStatus.First;
    }

    res.push({
      country: item.location.countryName,
      city: item.location.city,
      lat: Number(item.location.latitude),
      lng: Number(item.location.longitude),
      time: formatDate(item.time),
      when: formatDateDifference(item.time),
      visitStatus,
      isIncognito: null,
    });

    return res;
  }, [] as VisitData[]);
}

/**
 * Generate VisitorInfo object based on VisitorStorageData array.
 *
 * @param visitorStorageDataArr - An array of VisitorStorageData objects.
 * @returns An object of VisitorInfo.
 */
export function genereteVisitorInfoObj(visitorStorageDataArr: VisitorStorageData[]): VisitorInfo {
  const currVisit = visitorStorageDataArr[visitorStorageDataArr.length - 1];

  let location = '';
  if (!currVisit.location.city) {
    location = currVisit.location.countryName;
  }

  if (currVisit.location.city && currVisit.location.countryName) {
    location = [currVisit.location.city, currVisit.location.countryName].join(', ');
  }

  const ipAddress = visitorStorageDataArr.reduce((res, item) => {
    if (!res.includes(item.location.ip)) {
      res.push(item.location.ip);
    }

    return res;
  }, [] as string[]);

  return {
    personalId: currVisit.visitorID,
    ip: currVisit.location.ip,
    location,
    ipAddress: ipAddress.length,
    geolocations: ipAddress.length,
    visitCounter: visitorStorageDataArr.length,
    isIncognito: null,
    incognitoCounter: null,
  };
}

/**
 * Saves VisitorData to local storage.
 *
 * If there are more than `maxVisitsRecordsCount` records in local storage, it will be cleared.
 * If there are less than `maxVisitsRecordsCount` records on the current day, they will be kept.
 * Otherwise, the new record will be added to the array.
 *
 * @param visitorData - VisitorData object.
 * @returns An array of VisitorStorageData objects.
 */
export function saveVisitorData(visitorData: VisitorData): VisitorStorageData[] {
  try {
    const maxVisitsRecordsCount = 50;
    const currentDate = new Date().toISOString();
    let visitorDataArr = getVisitorData();

    const [today] = currentDate.split('T');
    const todaysData = visitorDataArr.filter((item) => item.time?.startsWith(today));

    if (visitorDataArr.length > maxVisitsRecordsCount) {
      visitorDataArr = [];
      if (todaysData.length < maxVisitsRecordsCount) {
        visitorDataArr = todaysData;
      }
    }

    visitorDataArr.push({
      ...visitorData,
      time: currentDate,
    });

    localStorage.setItem(LOCAL_STORAGE_VARS.VISITOR_DATA, JSON.stringify(visitorDataArr));

    return visitorDataArr;
  } catch (err) {
    console.error(err);

    return [];
  }
}

/**
 * Retrieves VisitorStorageData array from local storage.
 *
 * @returns {VisitorStorageData[]} VisitorStorageData array.
 */
export function getVisitorData(): VisitorStorageData[] {
  try {
    const visitorDataFromStorage = localStorage.getItem(LOCAL_STORAGE_VARS.VISITOR_DATA);
    return visitorDataFromStorage ? JSON.parse(visitorDataFromStorage) : [];
  } catch (err) {
    console.error(err);

    return [];
  }
}
