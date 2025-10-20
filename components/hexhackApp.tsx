/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styles from '../styles/generic.module.css';
import {
  Container,
  Grid,
  LinearProgress,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import crypto from "crypto";

interface HexHackAppProps { };
const hexSymbols = ["B1", "EF", "C0", "F5", "D5", "40", "74", "55", "A2", "1B"];
const asciiSymbols = ["±", "ï", "À", "õ", "Õ", "@", "t", "U", "¢", " "];
let timeoutPointer: NodeJS.Timeout | undefined = undefined;
const validSerialHash = [
  "1e4a1b03d1b6cd8a174a826f76e009f4",
  "299531030dd61315ddb59aac59d58e7c",
]

export default function HexhackApp(props: HexHackAppProps): JSX.Element {
  const inputFieldStyle = {
    width: '106px',
    border: '1px solid #e0f0e0',
    borderRadius: '4px',
  }
  const inputFieldFontStyle = {
    fontFamily: 'monospace',
    fontSize: '32px',
    filter: 'drop-shadow(rgb(255, 255, 255) 0px 0px 4px)',
  }
  const textBodyStyle = {
    fontFamily: 'monospace',
    fontSize: '14px',
    padding: '0px 16px 0',
    filter: 'drop-shadow(rgb(255, 255, 255) 0px 0px 4px)',
  }
  const hexBodyStyle = {
    fontFamily: 'monospace',
    fontSize: '14px',
    padding: '0px 0px 0',
    filter: 'drop-shadow(rgb(255, 255, 255) 0px 0px 4px)',
  }
  const textBodyStyleOutline = {
    fontFamily: 'monospace',
    fontSize: '16px',
    padding: '0px 16px 0',
    filter: 'drop-shadow(rgb(255, 255, 255) 0px 0px 4px)',
    border: '1px solid #e0f0e0',
  }
  const errorBoxShownStyle = {
    height: '100%',
    background: 'radial-gradient(ellipse, transparent, #A00)  100% 100% / 100% 100%',
    transition: 'all 0.1s ease-in-out',
  }
  const errorBoxHiddenStyle = {
    height: '100%',
    background: 'transparent',
    transition: 'all 0.1s ease-in-out',
  }
  const addrWhite = "#ffffd0";
  const asciiWhite = "#d0ffd0";

  const [hexGrid, setHexGrid] = useState<String[]>([]);
  const [asciiGrid, setAsciiGrid] = useState<String[]>([]);
  const [targetOrder, setTargetOrder] = useState<number[]>([]);
  const [targetPosition, setTargetPosition] = useState<number>(0);
  const maxTime = 8000;
  const [timeLeft, setTimeLeft] = useState<number>(maxTime);
  const [timeLeftPercent, setTimeLeftPercent] = useState<number>(100);
  const [errorBoxStyle, setErrorBoxStyle] = useState<React.CSSProperties>(errorBoxHiddenStyle);
  const [initializeProgress, setInitializeProgress] = useState<number>(0);
  const initializeTime = 6000; // Total time to initialize the puzzle
  const [validSerialNumber, setValidSerialNumber] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("Opening ports...");
  const [puzzleWon, setPuzzleWon] = useState<boolean>(false);
  const inputRef1 = React.useRef<HTMLInputElement>(null);
  const inputRef2 = React.useRef<HTMLInputElement>(null);
  const inputRef3 = React.useRef<HTMLInputElement>(null);
  const inputRef4 = React.useRef<HTMLInputElement>(null);
  const [inputValue1, setInputValue1] = useState<string>('');
  const [inputValue2, setInputValue2] = useState<string>('');
  const [inputValue3, setInputValue3] = useState<string>('');
  const [inputValue4, setInputValue4] = useState<string>('');
  const loadingMessages = [
    "Opening ports...",
    "Establishing connection...",
    "Bypassing security protocols...",
    "Isolating core dump...",
    "Defragging memory segments...",
    "Compiling breach sequence...",
    "Finalizing setup...",
  ];

  const generatePuzzleOrder = () => {
    // Generate the order we'll use for the puzzle
    let shuffled = [...Array(20).keys()]
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    setTargetOrder(shuffled);
  };

  const generateGrid = (targetPosition: number) => {
    // Pick 4 random indices from hexSymbols to be our target symbols
    let targetIndices: number[] = [];
    while (targetIndices.length < 4) {
      let randomIndex = Math.floor(Math.random() * hexSymbols.length);
      if (!targetIndices.includes(randomIndex)) {
        targetIndices.push(randomIndex);
      }
    }

    // Pick 1 random index from targetIndices to not be used in the grid (This will prevent the target from appearing in the grid unintentionally)
    let unusedIndex = targetIndices[Math.floor(Math.random() * targetIndices.length)];

    // Create a list of 20 elements comprised of 4 hex symbols with targetPosition holding the target hexSymbols and the rest be random hexSymbols not using the unusedIndex
    let hexGridSymbols: string[] = Array(20).fill("");
    let asciiGridSymbols: string[] = Array(20).fill("");
    for (let i = 0; i < hexGridSymbols.length; i++) {
      if (i === targetOrder[targetPosition]) {
        // Fill the target position with the target symbols
        hexGridSymbols[i] = targetIndices.map(index => hexSymbols[index]).join(' ');
        asciiGridSymbols[i] = targetIndices.map(index => asciiSymbols[index]).join('');
      } else {
        // Fill other positions with random hex symbols, avoiding the unused index
        let randomHexString: number[] = [];
        while (randomHexString.length < 4) {
          let randomIndex = Math.floor(Math.random() * hexSymbols.length);
          if (!randomHexString.includes(randomIndex) && randomIndex !== unusedIndex) {
            randomHexString.push(randomIndex);
          }
        }
        hexGridSymbols[i] = randomHexString.map(index => hexSymbols[index]).join(' ');
        asciiGridSymbols[i] = randomHexString.map(index => asciiSymbols[index]).join('');
      }
    }
    // Zero out the hexGridSymbols we have already solved
    for (let i = 0; i < targetPosition; i++) {
      hexGridSymbols[targetOrder[i]] = "00 00 00 00";
      asciiGridSymbols[targetOrder[i]] = "....";
    }

    setHexGrid(hexGridSymbols);
    setAsciiGrid(asciiGridSymbols);
  };

  const onGridClick = (index: number) => {
    if (!timeoutPointer) {
      timeoutPointer = setInterval(() => {
        setTimeLeft(prevTimeLeft => prevTimeLeft - 37);
      }, 37);
    }
    // Handle the grid click event
    if (index === targetOrder[targetPosition]) {
      if (targetPosition + 1 >= 20) {
        console.log("Puzzle completed!");
        timeoutPointer && clearInterval(timeoutPointer);
        setPuzzleWon(true);
      }
      generateGrid(targetPosition + 1);
      setTargetPosition(targetPosition + 1);
      // Here you can handle the correct click, e.g., show a success message or proceed to the next step
    } else {
      // Handle incorrect click
      generateGrid(targetPosition);
      setErrorBoxStyle(errorBoxShownStyle);
      setTimeout(() => {
        setErrorBoxStyle(errorBoxHiddenStyle);
      }, 100); // Hide the error box after 100ms
    }
    setTimeLeft(maxTime); // Reset the time left to the max time on each click
  };

  const handleInput1Change = (event:React.ChangeEvent<HTMLInputElement>) => {
    var value = event.target.value.toUpperCase();
    setInputValue1(value);
    if (value.length === 4) {
      inputRef2.current?.focus();
    }
  };

  const handleInput2Change = (event:React.ChangeEvent<HTMLInputElement>) => {
    var value = event.target.value.toUpperCase();
    setInputValue2(value);
    if (value.length === 4) {
      inputRef3.current?.focus();
    }
  };

  const handleInput3Change = (event:React.ChangeEvent<HTMLInputElement>) => {
    var value = event.target.value.toUpperCase();
    setInputValue3(value);
    if (value.length === 4) {
      inputRef4.current?.focus();
    }
  };

  const handleInput4Change = (event:React.ChangeEvent<HTMLInputElement>) => {
    var value = event.target.value.toUpperCase();
    setInputValue4(value);
  }

  // Validate Serial Number
  useEffect(() => {
    if (inputValue1.length === 4 && inputValue2.length === 4 && inputValue3.length === 4 && inputValue4.length === 4) {
      // Check if the serial number is valid
      let serialNumber = inputValue1 + inputValue2 + inputValue3 + inputValue4;
      serialNumber = serialNumber.toUpperCase().replace(/[^0-9A-F]/g, ''); // Ensure it's uppercase and only contains hex characters
      const actualHash = crypto.createHash('md5').update(serialNumber).digest('hex');

      if (validSerialHash.includes(actualHash)) {
        setValidSerialNumber(true);
      } else {
        setValidSerialNumber(false);
      }
    }
  }, [inputValue1, inputValue2, inputValue3, inputValue4]);

  useEffect(() => {
    if (validSerialNumber && !timeoutPointer) {
      timeoutPointer = setInterval(() => {
        setInitializeProgress(prevProgress => prevProgress + (Math.random() * 200));
      }, 200);
    }
  }, [validSerialNumber]);

  // Render loading bar and clear interval when loading bar is done
  useEffect(() => {
    setLoadingMessage(loadingMessages[Math.floor(initializeProgress/initializeTime * loadingMessages.length)]);

    if (initializeProgress > initializeTime) {
      setInitializeProgress(initializeTime);
      timeoutPointer && clearInterval(timeoutPointer);
      timeoutPointer = undefined;
      setTimeout(() => {
        setInitialized(true);
      }, 1200);
    }
  }, [initializeProgress]);

  // Update the time left and time left percent to render the progress bar
  useEffect(() => {
    setTimeLeftPercent(100 * timeLeft / maxTime);
    // Reset the time left to the max time
    if (timeLeft < 0) {
      generateGrid(targetPosition);
      setTimeLeft(maxTime);
      setErrorBoxStyle(errorBoxShownStyle);
      setTimeout(() => {
        setErrorBoxStyle(errorBoxHiddenStyle);
      }, 100); // Hide the error box after 100ms
    }
  }, [timeLeft]);

  useEffect(() => {
    generateGrid(0);
  }, [targetOrder]);

  useEffect(() => {
    //console.log(crypto.createHash('md5').update('756B2003C3B9219B').digest('hex'));
    // Hide the header element
    let headerElem = document.getElementsByTagName('header');
    if (headerElem[0]) {
        //headerElem[0].style.display = 'none';
        headerElem[0].style.background = '#000';
    }
    let headerTitleElem = document.getElementsByTagName('h4');
    if (headerTitleElem[0]) {
        headerTitleElem[0].innerHTML = 'N A V H A C K';
    }
    generatePuzzleOrder();

    return () => {
      // Reset the header element to its original state
      if (headerElem[0]) {
        headerElem[0].style.display = '';
        headerElem[0].style.background = 'rgba(18, 4, 88, 0.9)';
      }
      if (headerTitleElem[0]) {
        headerTitleElem[0].innerHTML = 'N E O N A V';
      }
    };
  }, []);



  return (
    <Container disableGutters style={{ height: '100%' }}>
      <div style={{ height: '100%', maxHeight: '100%', background: 'radial-gradient(ellipse at top, #5D1CC233, #000)  100% 100% / 100% 100%'}}>
        <div style={errorBoxStyle}>
          <div
            className={styles.lightPane}
            style={{ width: '100%', height: 'calc(100vh - 72px)', maxHeight: 'calc(100vh - 72px)', position: 'absolute', top: '72px'}}
            data-augmented-ui="tl-clip-x br-clip bl-clip both"
          >
            {!validSerialNumber && (
              <div style={{height: '100%', display: 'flow', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{height: '30%'}}/>
                <div style={{minWidth: '100%'}}>
                  <Typography sx={textBodyStyle} component="p" style={{color: '#fff', textAlign: 'center', margin: '8px'}}>Enter Serial Number</Typography>
                </div>
                <div style={{minWidth: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                    alignItems="center"
                    >
                    <TextField ref={inputRef1} size="small" value={inputValue1} style={inputFieldStyle} onChange={handleInput1Change} inputProps={{ maxLength: 4, style: inputFieldFontStyle }} />
                    <TextField ref={inputRef2} size="small" value={inputValue2} style={inputFieldStyle} onChange={handleInput2Change} inputProps={{ maxLength: 4, style: inputFieldFontStyle }} />
                    <TextField ref={inputRef3} size="small" value={inputValue3} style={inputFieldStyle} onChange={handleInput3Change} inputProps={{ maxLength: 4, style: inputFieldFontStyle }} />
                    <TextField ref={inputRef4} size="small" value={inputValue4} style={inputFieldStyle} onChange={handleInput4Change} inputProps={{ maxLength: 4, style: inputFieldFontStyle }} />
                  </Stack>
                </div>
                <div style={{minWidth: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  {(inputValue1 + inputValue2 + inputValue3 + inputValue4).length === 16 && !validSerialNumber &&
                  <Typography sx={textBodyStyle} component="p" style={{color: '#d00', textAlign: 'center', margin: '8px'}}>Serial Number Invalid</Typography>
                  }
                </div>
              </div>
            )}
            {!initialized && validSerialNumber && (
              <div style={{height: '100%', display: 'flow', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{height: '40%'}}/>
                <div style={{minWidth: '100%'}}>
                  <Typography sx={textBodyStyle} component="p" style={{color: '#fff', textAlign: 'center'}}>Initializing NavHack...</Typography>
                </div>
                <div style={{minWidth: '100%', justifyItems: 'center'}}>
                  <LinearProgress color="primary" variant="determinate"
                                  value={100 * initializeProgress / initializeTime} style={{width: '80%'}}/>
                </div>
                <div style={{minWidth: '100%'}}>
                  <Typography sx={textBodyStyle} component="p" style={{color: '#fff', textAlign: 'center', fontSize: '12px'}}>{loadingMessage}</Typography>
                </div>
              </div>
            )}
            {initialized && (
              <div style={{height: '100%', maxHeight: '100%', padding: '32px 16px'}}>
                <Stack direction="row"
                       spacing={1}
                       justifyContent="space-between"
                       alignItems="center"
                >
                  <div className={styles.darkPane} style={{width: '50%', padding: '16px'}} data-augmented-ui="tl-clip both">
                    <Stack direction="row"
                           spacing={1}
                           justifyContent="space-between"
                           alignItems="center"
                    >
                      <Typography sx={textBodyStyle} component="p">BREACH TIME REMAINING</Typography>
                      <Typography sx={textBodyStyleOutline} component="p" style={{color: (timeLeft > 2000 ? '#fff' : '#d00')}}>{(timeLeft / 1000).toFixed(2)}</Typography>
                    </Stack>
                    <LinearProgress  color="secondary" variant="determinate" value={timeLeftPercent} style={{marginTop: '8px', transition: 'none'}}/>
                  </div>
                  <div className={styles.darkPane} style={{width: '50%', padding: '16px'}} data-augmented-ui="tr-clip both">
                    <Stack direction="row"
                           spacing={1}
                           justifyContent="space-between"
                           alignItems="center"
                    >
                      <Typography sx={textBodyStyleOutline} component="p">{hexGrid[targetOrder[targetPosition]]}</Typography>
                      <Typography sx={textBodyStyle} component="p">TARGET BUFFER</Typography>
                    </Stack>
                  </div>
                </Stack>
                <div className={styles.lightPane} style={{ width: '100%', padding: '16px 8px 12px', marginTop: '16px'}} data-augmented-ui="tl-clip tr-2-clip-x both">
                  <Grid container>
                    <Grid container item xs={12} style={{ justifyContent: 'center'}}>
                      <Grid item xs="auto" style={{ justifyItems: 'end', }}>
                        <Typography component="p" sx={hexBodyStyle} style={{color: addrWhite}}>00006DB0</Typography>
                      </Grid>
                      <Grid item xs="auto" style={{ justifyItems: 'center', }}>
                        <div style={{display: "flex", padding: "0px 16px 0"}}>
                          <Typography sx={hexBodyStyle} onClick={() => onGridClick(0)}>{hexGrid[0]}</Typography>
                          <Typography sx={hexBodyStyle} >&nbsp;&nbsp;</Typography>
                          <Typography sx={hexBodyStyle} onClick={() => onGridClick(1)}>{hexGrid[1]}</Typography>
                          <Typography sx={hexBodyStyle}>&nbsp;&nbsp;</Typography>
                          <Typography sx={hexBodyStyle} onClick={() => onGridClick(2)}>{hexGrid[2]}</Typography>
                          <Typography sx={hexBodyStyle}>&nbsp;&nbsp;</Typography>
                          <Typography sx={hexBodyStyle} onClick={() => onGridClick(3)}>{hexGrid[3]}</Typography>
                        </div>
                      </Grid>
                      <Grid item xs="auto" >
                          <Typography component="p" sx={hexBodyStyle} style={{color: asciiWhite, whiteSpace: 'pre'}}>{asciiGrid[0]}{asciiGrid[1]}{asciiGrid[2]}{asciiGrid[3]}</Typography>
                      </Grid>
                    </Grid>
                    <Grid container item xs={12} style={{ justifyContent: 'center'}}>
                      <Grid item xs="auto" style={{ justifyItems: 'end' }}>
                          <Typography component="p" sx={hexBodyStyle} style={{color: addrWhite}}>00006DC0</Typography>
                      </Grid>
                      <Grid item xs="auto" style={{ justifyItems: 'center' }}>
                        <div style={{display: "flex", padding: "0px 16px 0"}}>
                          <Typography sx={hexBodyStyle} onClick={() => onGridClick(4)}>{hexGrid[4]}</Typography>
                          <Typography sx={hexBodyStyle}>&nbsp;&nbsp;</Typography>
                          <Typography sx={hexBodyStyle} onClick={() => onGridClick(5)}>{hexGrid[5]}</Typography>
                          <Typography sx={hexBodyStyle}>&nbsp;&nbsp;</Typography>
                          <Typography sx={hexBodyStyle} onClick={() => onGridClick(6)}>{hexGrid[6]}</Typography>
                          <Typography sx={hexBodyStyle}>&nbsp;&nbsp;</Typography>
                          <Typography sx={hexBodyStyle} onClick={() => onGridClick(7)}>{hexGrid[7]}</Typography>
                        </div>
                      </Grid>
                      <Grid item xs="auto">
                          <Typography component="p" sx={hexBodyStyle} style={{color: asciiWhite, whiteSpace: 'pre'}}>{asciiGrid[4]}{asciiGrid[5]}{asciiGrid[6]}{asciiGrid[7]}</Typography>
                      </Grid>
                    </Grid>
                    <Grid container item xs={12} style={{ justifyContent: 'center'}}>
                      <Grid item xs="auto" style={{ justifyItems: 'end' }}>
                          <Typography component="p" sx={hexBodyStyle} style={{color: addrWhite}}>00006DD0</Typography>
                      </Grid>
                      <Grid item xs="auto" style={{ justifyItems: 'center' }}>
                        <div style={{display: "flex", padding: "0px 16px 0"}}>
                          <Typography sx={hexBodyStyle} onClick={() => onGridClick(8)}>{hexGrid[8]}</Typography>
                          <Typography sx={hexBodyStyle}>&nbsp;&nbsp;</Typography>
                          <Typography sx={hexBodyStyle} onClick={() => onGridClick(9)}>{hexGrid[9]}</Typography>
                          <Typography sx={hexBodyStyle}>&nbsp;&nbsp;</Typography>
                          <Typography sx={hexBodyStyle} onClick={() => onGridClick(10)}>{hexGrid[10]}</Typography>
                          <Typography sx={hexBodyStyle}>&nbsp;&nbsp;</Typography>
                          <Typography sx={hexBodyStyle} onClick={() => onGridClick(11)}>{hexGrid[11]}</Typography>
                        </div>
                      </Grid>
                      <Grid item xs="auto">
                        <Typography component="p" sx={hexBodyStyle} style={{color: asciiWhite, whiteSpace: 'pre'}}>{asciiGrid[8]}{asciiGrid[9]}{asciiGrid[10]}{asciiGrid[11]}</Typography>
                      </Grid>
                    </Grid>
                    <Grid container item xs={12} style={{ justifyContent: 'center'}}>
                      <Grid item xs="auto" style={{ justifyItems: 'end' }}>
                        <Typography component="p" sx={hexBodyStyle} style={{color: addrWhite}}>00006DE0</Typography>
                      </Grid>
                      <Grid item xs="auto" style={{ justifyItems: 'center' }}>
                        <div style={{display: "flex", padding: "0px 16px 0"}}>
                          <Typography sx={hexBodyStyle} onClick={() => onGridClick(12)}>{hexGrid[12]}</Typography>
                          <Typography sx={hexBodyStyle}>&nbsp;&nbsp;</Typography>
                          <Typography sx={hexBodyStyle} onClick={() => onGridClick(13)}>{hexGrid[13]}</Typography>
                          <Typography sx={hexBodyStyle}>&nbsp;&nbsp;</Typography>
                          <Typography sx={hexBodyStyle} onClick={() => onGridClick(14)}>{hexGrid[14]}</Typography>
                          <Typography sx={hexBodyStyle}>&nbsp;&nbsp;</Typography>
                          <Typography sx={hexBodyStyle} onClick={() => onGridClick(15)}>{hexGrid[15]}</Typography>
                        </div>
                      </Grid>
                      <Grid item xs="auto">
                        <Typography component="p" sx={hexBodyStyle} style={{color: asciiWhite, whiteSpace: 'pre'}}>{asciiGrid[12]}{asciiGrid[13]}{asciiGrid[14]}{asciiGrid[15]}</Typography>
                      </Grid>
                    </Grid>
                    <Grid container item xs={12} style={{ justifyContent: 'center'}}>
                      <Grid item xs="auto" style={{ justifyItems: 'end' }}>
                        <Typography component="p" sx={hexBodyStyle} style={{color: addrWhite}}>00006DF0</Typography>
                      </Grid>
                      <Grid item xs="auto" style={{ justifyItems: 'center' }}>
                        <div style={{display: "flex", padding: "0px 16px 0"}}>
                          <Typography sx={hexBodyStyle} onClick={() => onGridClick(16)}>{hexGrid[16]}</Typography>
                          <Typography sx={hexBodyStyle}>&nbsp;&nbsp;</Typography>
                          <Typography sx={hexBodyStyle} onClick={() => onGridClick(17)}>{hexGrid[17]}</Typography>
                          <Typography sx={hexBodyStyle}>&nbsp;&nbsp;</Typography>
                          <Typography sx={hexBodyStyle} onClick={() => onGridClick(18)}>{hexGrid[18]}</Typography>
                          <Typography sx={hexBodyStyle}>&nbsp;&nbsp;</Typography>
                          <Typography sx={hexBodyStyle} onClick={() => onGridClick(19)}>{hexGrid[19]}</Typography>
                        </div>
                      </Grid>
                      <Grid item xs="auto">
                        <Typography component="p" sx={hexBodyStyle} style={{color: asciiWhite, whiteSpace: 'pre'}}>{asciiGrid[16]}{asciiGrid[17]}{asciiGrid[18]}{asciiGrid[19]}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}
