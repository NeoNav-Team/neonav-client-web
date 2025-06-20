
import {QRCodeSVG} from 'qrcode.react';
import {useContext, useEffect, useMemo, useRef} from 'react';
import { Context as NnContext } from '../components/context/nnContext';
import { NnProviderValues } from '../components/context/nnTypes';

interface MyQRCodeProps {
  value?: string;
  size?: number;
}

export default function MyQRCode(props:MyQRCodeProps):JSX.Element {
  const { 
    state,
  }: NnProviderValues = useContext(NnContext);
  const svgRef = useRef(null);
  const colorArray = [
    "#ffd319", "#ff901f", "#ff2975", "#c5003c", "#c700b5", 
    "#b000ff", "#004eff", "#00b8ff", "#00b87f", "#00ff00",
    "#ffffff",
  ];
  
  const accountId = state?.network?.selected?.account || 'Meat Popsicle';

  const size = props?.size || 500;
  const value = props?.value || accountId;

  // in case of emergency this whole useEffect can be removed and the QR code will still render, but without the animated gradient
  // if removing, set fgColor in QRCodeSVG to a solid color, e.g. "#ffffff"
  useEffect(() => {
    if (svgRef.current) {
      const svgElement = svgRef.current.querySelector('svg');
      if (svgElement) {
        const splitID = value.split("").map((val) => parseInt(val));
        // Ensure splitID[0] is defined and has a value
        splitID[0] = (isNaN(splitID[0])) ? 10 : splitID[0];
        // If values used for color are equal, set one to 10 to have two unique colors in the gradient animation
        splitID[2] = (splitID[1] === splitID[2]) ? 10 : splitID[2];
        splitID[5] = (splitID[4] === splitID[5]) ? 10 : splitID[5];
        splitID[8] = (splitID[7] === splitID[8]) ? 10 : splitID[8];

        /* Animations
         * 0 - LinearGradient Vertical static
         * 1 - LinearGradient Horizontal static
         * 2 - LinearGradient Diagonal TL BR static
         * 3 - LinearGradient Diagonal TR BL static
         * 4 - LinearGradient spin clockwise
         * 5 - LinearGradient spin counter-clockwise
         * 6 - LinearGradient move left right
         * 7 - LinearGradient move right left
         * 8 - LinearGradient move up down
         * 9 - LinearGradient move down up
         * 10 - RadialGradient static - Factions only
         */

        const animations = [
          '', // intentionally blank
          '<animateTransform attributeName="gradientTransform" type="rotate" from="90 0.5 0.5" to="90 0.5 0.5" dur="3s" repeatCount="indefinite"/>',
          '<animateTransform attributeName="gradientTransform" type="rotate" from="45 0.5 0.5" to="45 0.5 0.5" dur="3s" repeatCount="indefinite"/>',
          '<animateTransform attributeName="gradientTransform" type="rotate" from="-45 0.5 0.5" to="-45 0.5 0.5" dur="3s" repeatCount="indefinite"/>',
          '<animateTransform attributeName="gradientTransform" type="rotate" from="0 0.5 0.5" to="360 0.5 0.5" dur="3s" repeatCount="indefinite"/>',
          '<animateTransform attributeName="gradientTransform" type="rotate" from="0 0.5 0.5" to="-360 0.5 0.5" dur="3s" repeatCount="indefinite"/>',
          '<animate attributeName="x1" values="-150%; -37%" dur="3s" repeatCount="indefinite"/><animate attributeName="x2" values="150%; 263%" dur="3s" repeatCount="indefinite"/>',
          '<animate attributeName="x1" values="-37%; -150%" dur="3s" repeatCount="indefinite"/><animate attributeName="x2" values="263%; 150%" dur="3s" repeatCount="indefinite"/>',
          '<animateTransform attributeName="gradientTransform" type="rotate" from="90 0.5 0.5" to="90 0.5 0.5" dur="3s" repeatCount="indefinite"/><animate attributeName="x1" values="-150%; -37%" dur="3s" repeatCount="indefinite"/><animate attributeName="x2" values="150%; 263%" dur="3s" repeatCount="indefinite"/>',
          '<animateTransform attributeName="gradientTransform" type="rotate" from="90 0.5 0.5" to="90 0.5 0.5" dur="3s" repeatCount="indefinite"/><animate attributeName="x1" values="-37%; -150%" dur="3s" repeatCount="indefinite"/><animate attributeName="x2" values="263%; 150%" dur="3s" repeatCount="indefinite"/>',
          '', // intentionally blank; shouldn't be used, but won't throw index out of bounds if used by accident
        ];
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        defs.innerHTML = (splitID[0] < 10) ? `
              <LinearGradient id="myGradient" x1="-100%" x2="200%">${animations[splitID[0]]}
                <stop offset=" 00%" ><animate attributeName="stop-color" values="${colorArray[splitID[7]]}; ${colorArray[splitID[8]]}; ${colorArray[splitID[7]]}" dur="${splitID[9] + 1.6}s" repeatCount="indefinite"/></stop>
                <stop offset=" 13%" ><animate attributeName="stop-color" values="${colorArray[splitID[1]]}; ${colorArray[splitID[2]]}; ${colorArray[splitID[1]]}" dur="${splitID[3] + 1.0}s" repeatCount="indefinite"/></stop>
                <stop offset=" 25%" ><animate attributeName="stop-color" values="${colorArray[splitID[4]]}; ${colorArray[splitID[5]]}; ${colorArray[splitID[4]]}" dur="${splitID[6] + 1.3}s" repeatCount="indefinite"/></stop>
                <stop offset=" 37%" ><animate attributeName="stop-color" values="${colorArray[splitID[7]]}; ${colorArray[splitID[8]]}; ${colorArray[splitID[7]]}" dur="${splitID[9] + 1.6}s" repeatCount="indefinite"/></stop>
                <stop offset=" 50%" ><animate attributeName="stop-color" values="${colorArray[splitID[1]]}; ${colorArray[splitID[2]]}; ${colorArray[splitID[1]]}" dur="${splitID[3] + 1.0}s" repeatCount="indefinite"/></stop>
                <stop offset=" 62%" ><animate attributeName="stop-color" values="${colorArray[splitID[4]]}; ${colorArray[splitID[5]]}; ${colorArray[splitID[4]]}" dur="${splitID[6] + 1.3}s" repeatCount="indefinite"/></stop>
                <stop offset=" 75%" ><animate attributeName="stop-color" values="${colorArray[splitID[7]]}; ${colorArray[splitID[8]]}; ${colorArray[splitID[7]]}" dur="${splitID[9] + 1.6}s" repeatCount="indefinite"/></stop>
                <stop offset=" 87%" ><animate attributeName="stop-color" values="${colorArray[splitID[1]]}; ${colorArray[splitID[2]]}; ${colorArray[splitID[1]]}" dur="${splitID[3] + 1.0}s" repeatCount="indefinite"/></stop>
                <stop offset="100%" ><animate attributeName="stop-color" values="${colorArray[splitID[4]]}; ${colorArray[splitID[5]]}; ${colorArray[splitID[4]]}" dur="${splitID[6] + 1.3}s" repeatCount="indefinite"/></stop>
              </LinearGradient>
            ` : `
              <RadialGradient id="myGradient" ><animate attributeName="r" values="40%; 80%; 40%" dur="3s" repeatCount="indefinite"/>
                <stop offset="  0%" ><animate attributeName="stop-color" values="${colorArray[splitID[1]]}; ${colorArray[splitID[2]]}; ${colorArray[splitID[1]]}" dur="${splitID[3] + 1.0}s" repeatCount="indefinite"/></stop>
                <stop offset=" 50%" ><animate attributeName="stop-color" values="${colorArray[splitID[4]]}; ${colorArray[splitID[5]]}; ${colorArray[splitID[4]]}" dur="${splitID[6] + 1.3}s" repeatCount="indefinite"/></stop>
                <stop offset="100%" ><animate attributeName="stop-color" values="${colorArray[splitID[7]]}; ${colorArray[splitID[8]]}; ${colorArray[splitID[7]]}" dur="${splitID[9] + 1.6}s" repeatCount="indefinite"/></stop>
              </RadialGradient>
            `;

        svgElement.prepend(defs); // Add defs at the beginning of the SVG
      }
    }
  }, []);

  return (
    <div ref={svgRef} style={{background: 'black'}}>
      <QRCodeSVG size={size} level={"H"} value={value} bgColor={"#000000"} fgColor={"url(#myGradient)"} width={!size ? '100%' : ''} />
    </div>
  )
}
