/* eslint-disable max-lines */

import Leaflet from 'leaflet';
import tippy from 'tippy.js';

import { DISABLED, LOCAL_STORAGE_VARS } from '../constants';
import { VisitorBlockTooltips } from '../enums';
import type { VisitorData, VisitorStorageData } from '../types';
import {
  bindMarkerPopup,
  formatDate,
  formatDateDifference,
  TDef,
} from '../utils/common';

type VisitorInfo = {
  personalId: string;
  ip: string;
  location: string;
  ipAddress: number;
  geolocations: number;
  visitCounter: number;
  isIncognito: null;
  incognitoCounter: null;
};

type VisitData = {
  country: string;
  city: string;
  lat: number;
  lng: number;
  time: string;
  when: string;
  visitStatus: (typeof VisitStatus)[keyof typeof VisitStatus];
  isIncognito: null;
};

const MAX_VISITS_RECORDS_COUNT = 50;

const firstSliderButtonSelector = '.visit-map-slider-controls > .slider-button:nth-child(1)';
const secondSliderButtonSelector = '.visit-map-slider-controls > .slider-button:nth-child(2)';

const enum VisitStatus {
  Prev = 'PREVIOUS VISIT',
  Curr = 'CURRENT VISIT',
  First = 'FIRST VISIT',
}

let currentVisitIdx = 0; // index of the current visit
let visitsMap: Leaflet.Map | null = null; // map of visits
let mapMarker: Leaflet.Marker<any> | null = null; // marker for the map
let visitForMapArr: VisitData[] | null = null; // array with data about visits
let visitorInfoEl: HTMLElement | null = null; // main block with visitor information

export function initVisitorBlock(selector: string): void {
  try {
    const visitorData = getVisitorData();

    // block element with information about the visitor
    visitorInfoEl = document.querySelector(selector);
    if (!(TDef.isString(selector) && TDef.isArray(visitorData) && visitorData.length && visitorInfoEl)) {
      return;
    }

    // transforming data for display
    const currVisit = visitorData[visitorData.length - 1];
    const onlyWithCurrHashData = visitorData.filter((item) => item.visitorID === currVisit.visitorID);
    const visitorInfoObj = genereteVisitorInfoObj(onlyWithCurrHashData);
    visitForMapArr = genereteVisitDataArr(onlyWithCurrHashData);

    // setting the current visit index
    currentVisitIdx = visitForMapArr.length - 1;

    // creating a block with information about visits with a map
    createOrUpdateVisitMapSliderBlock(visitorInfoEl, visitForMapArr[currentVisitIdx]);

    // adding events for the slider, state
    const sliderControls = visitorInfoEl.querySelector('.visit-map-slider > .visit-map-slider-controls');
    const [firstSliderButton, secondSliderButton] = sliderControls?.children || [];
    if (firstSliderButton && secondSliderButton) {
      firstSliderButton.addEventListener('click', prevVisit);
      secondSliderButton.addEventListener('click', nextVisit);

      secondSliderButton.classList.add(DISABLED);
      secondSliderButton.setAttribute(DISABLED, '');

      if (visitForMapArr.length <= 1) {
        firstSliderButton.classList.add(DISABLED);
        firstSliderButton.setAttribute(DISABLED, '');
      }
    }

    // creating a block with information about the visitor, current visit
    createVisitorInfoBlock(visitorInfoEl, visitorInfoObj);

    // installation of tooltips
    createTippyForAllElements();
  } catch (err) {
    console.error(err);
  }
}

export function saveVisitorData(visitorData: VisitorData): void {
  try {
    const currentDate = new Date().toISOString();
    let visitorDataArr = getVisitorData();

    const [today] = currentDate.split('T');
    const todaysData = visitorDataArr.filter((item) => item.time?.startsWith(today));

    if (visitorDataArr.length > MAX_VISITS_RECORDS_COUNT) {
      visitorDataArr = [];
      if (todaysData.length < MAX_VISITS_RECORDS_COUNT) {
        visitorDataArr = todaysData;
      }
    }

    visitorDataArr.push({
      ...visitorData,
      time: currentDate,
    });

    localStorage.setItem(LOCAL_STORAGE_VARS.VISITOR_DATA, JSON.stringify(visitorDataArr));
  } catch (err) {
    console.error(err);
  }
}

export function getVisitorData(): VisitorStorageData[] {
  try {
    const visitorDataFromStorage = localStorage.getItem(LOCAL_STORAGE_VARS.VISITOR_DATA);

    return visitorDataFromStorage ? JSON.parse(visitorDataFromStorage) : [];
  } catch (err) {
    console.error(err);

    return [];
  }
}

function createOrUpdateVisitMapSliderBlock(visitorInfoElParam: HTMLElement, visit: VisitData): void {
  if (!(visitorInfoElParam && visit && TDef.isObject(visit))) {
    return;
  }

  const location = Leaflet.latLng(visit.lat, visit.lng);
  const visitMapSliderEl = visitorInfoElParam.querySelector('.visit-map-slider');

  if (!(visitMapSliderEl && visitsMap && mapMarker)) {
    const mapSliderElem = `
      <div class="visit-map-slider">
        <div id="visit-map"></div>
        <div class="visit-map-slider-controls">
          <button class="slider-button">&#10094;</button>
          <button class="slider-button">&#10095;</button>
        </div>
        <div class="visit-map-date-info">
          <span class="date-info">${visit.time ?? '—'}</span>
          <span class="date-info">${visit.when ?? '—'}</span>
          <span class="visit-info">${visit.visitStatus ?? '—'}</span>
        </div>
      </div>
    `;

    visitorInfoElParam.insertAdjacentHTML('beforeend', mapSliderElem);

    // setTimeout so that the map loads normally
    setTimeout(() => {
      visitsMap = Leaflet.map('visit-map', {
        center: location,
        minZoom: 4,
        maxZoom: 14,
        zoom: 8,
      });

      mapMarker = Leaflet.marker(location, {
        icon: Leaflet.icon({
          iconUrl: '/location-marker.svg',
          iconSize: [26, 36],
          iconAnchor: [16, 36],
          popupAnchor: [-2, -40],
        }),
      });

      mapMarker.addTo(visitsMap);
      bindMarkerPopup({
        marker: mapMarker,
        country: visit.country,
        city: visit.city,
      });

      visitsMap.scrollWheelZoom.disable();
      visitsMap.dragging.disable();

      Leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 15,
        minZoom: 3,
      }).addTo(visitsMap);
    }, 0);

    return;
  }

  // changes related to location and marker
  visitsMap.setView(location);
  mapMarker.setLatLng(location);
  bindMarkerPopup({
    marker: mapMarker,
    country: visit.country,
    city: visit.city,
  });

  // changing data in the slider, info with date
  const mapDateInfoElems = visitMapSliderEl.querySelector('.visit-map-date-info');
  const [dateTimeInfoEl, whenInfoEl, visitInfoEl] = mapDateInfoElems?.children || [];
  if (!(dateTimeInfoEl && whenInfoEl && visitInfoEl)) {
    return;
  }

  dateTimeInfoEl.innerHTML = visit.time;
  whenInfoEl.innerHTML = visit.when;
  visitInfoEl.innerHTML = visit.visitStatus;
}

function genereteVisitorInfoObj(visitorStorageDataArr: VisitorStorageData[]): VisitorInfo {
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

function genereteVisitDataArr(visitorStorageDataArr: VisitorStorageData[]): VisitData[] {
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

function createTippyForAllElements(): void {
  // tooltip for displaying information about the viewed block cell
  const infoButtons = [
    '#visitor > .visitor-location-info > div:nth-child(1) > div:nth-child(1) > span:nth-child(2) > button',
    '#visitor > .visitor-location-info > div:nth-child(1) > div:nth-child(2) > span:nth-child(2) > button',
    '#visitor > .visitor-location-info > div:nth-child(1) > div:nth-child(3) > span:nth-child(2) > button',
    '#visitor > .visitor-location-info > div:nth-child(2) > div:nth-child(1) > span:nth-child(2) > button',
    '#visitor > .visitor-location-info > div:nth-child(2) > div:nth-child(2) > span:nth-child(2) > button',
    '#visitor > .visitor-location-info > div:nth-child(2) > div:nth-child(3) > span:nth-child(2) > button',
  ];

  tippy(infoButtons[0], { content: VisitorBlockTooltips.PersonalID });
  tippy(infoButtons[1], { content: VisitorBlockTooltips.Location });
  tippy(infoButtons[2], { content: VisitorBlockTooltips.IP });
  tippy(infoButtons[3], { content: VisitorBlockTooltips.VisitCounter });
  tippy(infoButtons[4], { content: VisitorBlockTooltips.IPAddress });
  tippy(infoButtons[5], { content: VisitorBlockTooltips.Geolocations });

  // tooltip when clicking on copy icons
  const copyButtons = [
    '#visitor > .visitor-location-info > div:nth-child(1) > div:nth-child(1) > span:nth-child(2) > div > button',
    '#visitor > .visitor-location-info > div:nth-child(1) > div:nth-child(2) > span:nth-child(2) > div > button',
    '#visitor > .visitor-location-info > div:nth-child(1) > div:nth-child(4) > span:nth-child(2) > div > button',
  ].join(', ');

  const buttons = document.querySelectorAll(copyButtons);
  const tippyInstance = tippy(buttons, {
    content: 'Coppied to clipboard',
    trigger: 'manual',
    hideOnClick: false,
    duration: [100, 300],
    zIndex: 9999,
    arrow: false,
  });

  // activation of the tooltip when clicked, also copying the contents
  for (const [idx, button] of buttons.entries()) {
    button.addEventListener('click', () => {
      tippyInstance[idx].show();

      // copy to clipboard
      const value = button.previousElementSibling;
      if (value) {
        navigator.clipboard.writeText(value.innerHTML);
      }

      setTimeout(() => {
        tippyInstance[idx].hide();
      }, 500);
    });
  }
}

function createVisitorInfoBlock(visitorInfoElParam: HTMLElement, visitorInfo: VisitorInfo): void {
  const visitorInfoElem = `
    <div class="visitor-location-info">
      <div class="location-info-column">
        <div class="location-item">
          <span>Personal ID</span>
          <span>
            <div class="value">
              <div class="bold">${visitorInfo.personalId ?? '—'}</div>
              <button class="button-copy">
                <svg class="svg-icon">
                  <use xlink:href="#copyIcon"></use>
                </svg>
              </button>
            </div>
            <button class="button-info">
              <svg class="svg-icon">
                <use xlink:href="#infoIcon"></use>
              </svg>
            </button>
          </span>
        </div>
        <div class="location-item">
          <span>Location</span>
          <span>
            <div class="value">
              <div class="bold">${visitorInfo.location ?? '—'}</div>
              <button class="button-copy">
                <svg class="svg-icon">
                  <use xlink:href="#copyIcon"></use>
                </svg>
              </button>
            </div>
            <button class="button-info">
              <svg class="svg-icon">
                <use xlink:href="#infoIcon"></use>
              </svg>
            </button>
          </span>
        </div>
        <div class="location-item">
          <span>IP</span>
          <span>
            <div class="value">
              <div class="bold">${visitorInfo.ip ?? '—'}</div>
            </div>
            <button class="button-info">
              <svg class="svg-icon">
                <use xlink:href="#infoIcon"></use>
              </svg>
            </button>
          </span>
        </div>
      </div>

      <div class="location-info-column">
        <div class="location-item">
          <span>Your visit counter</span>
          <span>
            <div class="value">
              <div class="bold">${visitorInfo.visitCounter ?? '—'}</div> sessions
            </div>
            <button class="button-info">
              <svg class="svg-icon">
                <use xlink:href="#infoIcon"></use>
              </svg>
            </button>
          </span>
        </div>
        <div class="location-item">
          <span>IP Address</span>
          <span>
            <div class="value">
              <div class="bold">${visitorInfo.ipAddress ?? '—'}</div> IP
            </div>
            <button class="button-info">
              <svg class="svg-icon">
                <use xlink:href="#infoIcon"></use>
              </svg>
            </button>
        </div>
        <div class="location-item">
          <span>Geolocations</span>
          <span>
            <div class="value">
              <div class="bold">${visitorInfo.geolocations ?? '—'}</div> locations
            </div>
            <button class="button-info">
              <svg class="svg-icon">
                <use xlink:href="#infoIcon"></use>
              </svg>
            </button>
        </div>
      </div>
    </div>
  `;

  visitorInfoElParam.insertAdjacentHTML('beforeend', visitorInfoElem);
}

function prevVisit(): void {
  if (!(TDef.isNumber(currentVisitIdx) && visitorInfoEl && visitForMapArr?.length)) {
    return;
  }

  const firstSliderButton = visitorInfoEl.querySelector(firstSliderButtonSelector);
  const secondSliderButton = visitorInfoEl.querySelector(secondSliderButtonSelector);
  if (!(firstSliderButton && secondSliderButton)) {
    return;
  }

  currentVisitIdx -= 1;
  createOrUpdateVisitMapSliderBlock(visitorInfoEl, visitForMapArr[currentVisitIdx]);

  secondSliderButton.classList.remove(DISABLED);
  secondSliderButton.removeAttribute(DISABLED);

  if (!currentVisitIdx) {
    firstSliderButton.classList.add(DISABLED);
    firstSliderButton.setAttribute(DISABLED, '');
  }
}

function nextVisit(): void {
  if (!(visitorInfoEl && visitForMapArr?.length) || currentVisitIdx === visitForMapArr.length - 1) {
    return;
  }

  const firstSliderButton = visitorInfoEl.querySelector(firstSliderButtonSelector);
  const secondSliderButton = visitorInfoEl.querySelector(secondSliderButtonSelector);
  if (!(firstSliderButton && secondSliderButton)) {
    return;
  }

  currentVisitIdx += 1;
  createOrUpdateVisitMapSliderBlock(visitorInfoEl, visitForMapArr[currentVisitIdx]);

  firstSliderButton.classList.remove(DISABLED);
  firstSliderButton.removeAttribute(DISABLED);

  if (currentVisitIdx === visitForMapArr.length - 1) {
    secondSliderButton.classList.add(DISABLED);
    secondSliderButton.setAttribute(DISABLED, '');
  }
}
