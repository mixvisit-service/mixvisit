import { withIframe, wait } from '../utils/helpers';

// We test using 48px font size, we may use any size. I guess larger the better
const textSize = '48px';

// We use m or w because these two characters take up the maximum width.
// And we use a LLi so that the same matching fonts can get separated
const testString = 'mmmMMMmmmlllmmmLLL₹▁₺ꜽ�₸׆ẞॿmmmiiimmmIIImmmwwwmmmWWW';

// A font will be compared against all the three default fonts.
// And if for any default fonts it doesn't match, then that font is available
const baseFonts = ['monospace', 'sans-serif', 'serif'] as const;

const fontList = [
  'ARNO PRO',
  'Agency FB',
  'Andale Mono',
  'Apple Braille',
  'Apple Chancery',
  'Apple Color Emoji',
  'Apple SD Gothic Neo',
  'Apple Symbols',
  'AppleGothic',
  'Arabic Typesetting',
  'Arial',
  'Arial Black',
  'Arial Hebrew',
  'Arial MT',
  'Arial Narrow',
  'Arial Rounded MT Bold',
  'Arial Unicode MS',
  'AvantGarde Bk BT',
  'BankGothic Md BT',
  'Batang',
  'Bitstream Vera Sans Mono',
  'Book Antiqua',
  'Bookman Old Style',
  'Calibri',
  'Cambria',
  'Cambria Math',
  'Century',
  'Century Gothic',
  'Century Schoolbook',
  'Clarendon',
  'Comic Sans',
  'Comic Sans MS',
  'Consolas',
  'Courier',
  'Courier New',
  'EUROSTILE',
  'Franklin Gothic',
  'Futura Bk BT',
  'Futura Md BT',
  'GOTHAM',
  'Garamond',
  'Geneva',
  'Georgia',
  'Gill Sans',
  'HELV',
  'Haettenschweiler',
  'Helvetica',
  'Helvetica Neue',
  'Humanst521 BT',
  'Impact',
  'LUCIDA GRANDE',
  'Leelawadee',
  'Letter Gothic',
  'Levenim MT',
  'Lucida Bright',
  'Lucida Calligraphy',
  'Lucida Console',
  'Lucida Fax',
  'Lucida Grande',
  'Lucida Handwriting',
  'Lucida Sans',
  'Lucida Sans Typewriter',
  'Lucida Sans Unicode',
  'MS Gothic',
  'MS Mincho',
  'MS Outlook',
  'MS PGothic',
  'MS Reference Sans Serif',
  'MS Reference Specialty',
  'MS Sans Serif',
  'MS Serif',
  'MS UI Gothic',
  'MT Extra',
  'MYRIAD',
  'MYRIAD PRO',
  'Marlett',
  'Meiryo UI',
  'Menlo',
  'Microsoft Himalaya',
  'Microsoft JhengHei',
  'Microsoft Sans Serif',
  'Microsoft Tai Le',
  'Microsoft Uighur',
  'Microsoft YaHei',
  'Microsoft Yi Baiti',
  'Minion Pro',
  'Monaco',
  'Monotype Corsiva',
  'PMingLiU',
  'Palatino',
  'Palatino Linotype',
  'Pristina',
  'SCRIPTINA',
  'Segoe Print',
  'Segoe Script',
  'Segoe UI',
  'Segoe UI Light',
  'Segoe UI Semibold',
  'Segoe UI Symbol',
  'Serifa',
  'SimHei',
  'Small Fonts',
  'Staccato222 BT',
  'TRAJAN PRO',
  'Tahoma',
  'Times',
  'Times New Roman',
  'Times New Roman PS',
  'Trebuchet MS',
  'Univers CE 55 Medium',
  'Verdana',
  'Vrinda',
  'Webdings',
  'Wingdings',
  'Wingdings 2',
  'Wingdings 3',
  'ZWAdobeF',
  'sans-serif-thin',
];

export function getFonts(fonts: string[] = fontList): Promise<string[]> {
  return withIframe({
    action: loadFonts,
  }, fonts);
}

async function loadFonts(
  _: HTMLIFrameElement,
  { document }: typeof window,
  fonts: string[],
): Promise<string[]> {
  const holder = document.body;
  holder.style.fontSize = textSize;

  // div to load spans for the default fonts and the fonts to detect
  const spansContainer = document.createElement('div');
  spansContainer.style.setProperty('visibility', 'hidden', 'important');

  const defaultWidth: Partial<Record<string, number>> = {};
  const defaultHeight: Partial<Record<string, number>> = {};

  // creates a span where the fonts will be loaded
  const createSpan = (fontFamily: string) => {
    const span = document.createElement('span');
    const { style } = span;
    style.position = 'absolute';
    style.top = '0';
    style.left = '0';
    style.fontFamily = fontFamily;
    span.textContent = testString;
    spansContainer.appendChild(span);

    return span;
  };

  // creates a span and load the font to detect and a base font for fallback
  const createSpanWithFonts = (fontToDetect: string, baseFont: string) => createSpan(`'${fontToDetect}',${baseFont}`);

  // creates spans for the base fonts and adds them to baseFontsDiv
  const initializeBaseFontsSpans = () => baseFonts.map(createSpan);

  // creates spans for the fonts to detect and adds them to fontsDiv
  const initializeFontsSpans = () => {
    // Stores {fontName : [spans for that font]}
    const spans: Record<string, HTMLSpanElement[]> = {};

    for (const font of fonts) {
      spans[font] = baseFonts.map((baseFont) => createSpanWithFonts(font, baseFont));
    }

    return spans;
  };

  // checks if a font is available
  const isFontAvailable = (fontSpans: HTMLElement[]) => baseFonts.some(
    (baseFont, baseFontIndex) => fontSpans[baseFontIndex].offsetWidth !== defaultWidth[baseFont]
      || fontSpans[baseFontIndex].offsetHeight !== defaultHeight[baseFont],
  );

  // create spans for base fonts
  const baseFontsSpans = initializeBaseFontsSpans();

  // create spans for fonts to detect
  const fontsSpans = initializeFontsSpans();

  // add all the spans to the DOM
  holder.appendChild(spansContainer);

  await wait(0);

  // get the default width for the three base fonts
  for (let index = 0; index < baseFonts.length; index++) {
    defaultWidth[baseFonts[index]] = baseFontsSpans[index].offsetWidth; // width for the default font
    defaultHeight[baseFonts[index]] = baseFontsSpans[index].offsetHeight; // height for the default font
  }

  // check available fonts
  return fontList.filter((font) => isFontAvailable(fontsSpans[font]));
}
