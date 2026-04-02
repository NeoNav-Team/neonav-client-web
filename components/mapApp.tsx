'use client';

import 'styles/leaflet.css';
import styles from "@/styles/generic.module.css";
import React, {useEffect, useRef, useState, useMemo, useCallback, use} from "react";
import ReactDOMServer from 'react-dom/server';
import L, { map } from 'leaflet';
import 'leaflet-rotate';
import {
  Box,
  Container,
  Divider,
  IconButton,
  Link,
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import CastleIcon from "@mui/icons-material/Castle"; // Faction Icon
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import FooterNav from "@/components/footerNav";
import AddLocationIcon from '@mui/icons-material/AddLocation';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import EventIcon from '@mui/icons-material/Event';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import PersonIcon from '@mui/icons-material/Person';
import NavigationIcon from '@mui/icons-material/Navigation';


// Map Icons
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import WcIcon from '@mui/icons-material/Wc';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import AdjustIcon from '@mui/icons-material/Adjust';
import GamepadIcon from '@mui/icons-material/Gamepad';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import NightlifeIcon from '@mui/icons-material/Nightlife';
import HiveIcon from '@mui/icons-material/Hive';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import SimCardIcon from '@mui/icons-material/SimCard';
import SpeakerIcon from '@mui/icons-material/Speaker';
// Allegiance Icons
// https://www.iconarchive.com/show/material-icons-by-pictogrammers/dna-icon.html // Helix
import ControlCameraIcon from '@mui/icons-material/ControlCamera'; // Endline
import ViewInArIcon from '@mui/icons-material/ViewInAr'; // Reboot?
import TokenOutlinedIcon from '@mui/icons-material/TokenOutlined';
import {isJsonStringValid} from "@/utilities/json";
import ItemStatus from "@/components/itemStatus";
import SimpleScrollContainer from "@/components/simpleScrollContainer";
import { Context as NnContext } from "@/components/context/nnContext";
import { NnProviderValues } from "@/components/context/nnTypes";
import MapLayersModal from "@/components/mapLayersModal";
import { initStaticLayerGroups, wireZoomLayerVisibility } from "@/utilities/mapLeafletLayerUtils";
import { renderLocationsToLeafletLayers } from "@/utilities/mapLeafletLocationsRenderer";
import next from 'next';
import { LocalMall } from '@mui/icons-material';


interface PageContainerProps {
  params?: {
    id: string;
  }
}

interface RotateControl extends L.Control {
  _arrow: HTMLElement;
  _map: L.Map;
  _update(): void;
  _reset(e: L.LeafletEvent): void;
  getContainer(): HTMLElement;
}

const LARGE_MAP_FILE = "/2026_map_large_north.png"
const ZOOMED_MAP_FILE = "/2026_map_zoomed_north.png"
const NEONAV_MAINT = "C461879533";

class CustomTileLayer extends L.TileLayer {
  constructor(options?: L.TileLayerOptions) {
    super('', options); // Pass an empty URL, as getTileUrl will generate it
  }

  getTileUrl(coords: L.Coords) {
    const key = coords.z + "-" + coords.x + "-" + coords.y;
    const tiles = new Map<string, string>;
    tiles.set(
      '18-45276-103763', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAEBAQIDAwUCAgIFBQUDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIBAQEBAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAv/AABEIAQABAAMBIgACEQEDEQH/xAAdAAADAQEAAwEBAAAAAAAAAAAEBQYHAAEDCAkC/8QAWxAAAgEDAQQFBQkLBgsFCQAAAgMABBITBQYUIiMBMjND8AcVJEJTESE0RFFSVGNkFjFBYnN0g4Sj0fElYXWhpOFxcoGTlLG0tcHV5DXE1OX0FyZFVWWCkZKz/8QAGwEAAgMBAQEAAAAAAAAAAAAAAAQBBQYDAgf/xAA1EQABAgMDCQgCAQUAAAAAAAAAAfADBAUUFVERFiExQWGBkaEGEyMzcbHB8dHhJAISQ1Ny/9oADAMBAAIRAxEAPwD9LNsNBpHHkQ+0sO5Yfsv02d9zd1Kpj322OwOmkavpqBHPVMtsmb67qS12cu4Tdzmz4+feBhSY+cjPk6UOpXYovrMFpPR68oKPTTdl5FpYZH7K1mQRpOsIJ7Vv0qLjBDp2EriuNdUXId2OafSGLDSib7i5PObJ/TeLpyerKBrjsxvMrYuWBm/lB3oafoQh9ud2DNIfTas8QoBglycDnf7dNA2v2P34ujGu0g7F2aR+m6PjMs/D0hvUYAj9qqxbFOpFsxk+jqtzcr4vVQfZbUlkg1vymWGlzKq07tqfw3cNy/o6MNY0feiE1vEhD2MIdRrFAHScwwduXN+i+gf+BgAv3zTSAQXaR/Ak4oRRpodLC9GNQg6qf+b1X0KR+j6aylaTOG2l5zk/apc6ls3QkAhXZGZ3RcC30fWX2gg664gT6Z9oqvps2DZW9xcEyfTdNpGHwI4g7HnTSNkHYzKz1+xi1nR/RCm37YO4B+afsZ6E9IWD6w+2hG0lIbgUHzOfB9m3W8x6Lhl0nk8FKKWmfGMf2w02rFpbqdxeykunR6oiLOwR9slUsNqqykcR3mS73ePH907R9HpBEjQZcftZXWne+ZfGD7SeSbUnBUAjUhEXupcKc3weloJD0fkZe7LpSNVCxHOrMNZWb0jf5vG1+mr3gX5CLk4OTM/2w6KFI3rfadU6lc5rf9AgMFR5PtBXp91CdcszPnu3R284KXx/CD7X7YPEzpEBaIOpedE/kmdpqxbV0iCG92FOb6LCNqtNuGqrl8R4c9HFrOj+gIfzvqS6gaR+Mc3OS5tZRwDzisiFD7hLtnJnz7t35PduNeqMelValHRJpa2jyp+Nb7p9BuUodiqPVWNE6uhtPDVOT6Z+oQs6P6OlmNo03oQ5+dZkPSjsfor45TjWrjoVEZu5zcP+gTxR+jgoH0vH27sUl/uqyPUa2ZAfyXJbJOZQeUFNocxjLKp1Kj0TfPR6qD6lVsZWFQ6bSiXS7dd89D+D0sT+V/BfQ0i6po1Hnj0NKu/370Dff7dNo0GjWurN/CV6edyYDBoGgpXbgBf6FPcSwdZbjXxSf02wTv8AWjh1YAlkWFsXGBjhtHjkttSniE0LG4O6lwmj4bzmf6v0PJomsOEO2gBAa7tUwa8qF4ckE+mNb3EnqPk1Rcthg/sUulA5IOPJVr4/9ojjtKfOhnFhmgMeONOrKsjyY+p3KZL1nk+XS3Vy32iDt9wzQNHpH1BgbAt6A7bE6aBV6atwca4uBj+jUZiOCwiH0Xm+3hG17jSAvC4udNgTR3Bj4bfRcMw/bCrYVRjXcQgmLjAv03XmMMV4/wAt9ni+sTSXnnMpYbK0ixHjtuPton2ko1sImX2/oYwBLt0HTV/BF4/bKV6NI/anWFrHgpSIQ9lHGsZxUK2XML2yZP68nIoEPWwSd7L4vAsCf2PaxjRA7bzdVclqe39Cm8bnaInj4e2mL7N6bprOnoq+eNjuTzpsGj5HU4msOHDg7aLzKvmB87+U3anVadAspUcRu5OHuPTZtHkUay4UPYRD6Kl2XuKqL/KOldLTgaw6n9o9ChHkarHucD8BCJppc1JBJne+ZCn3BqTuq9fVkvoNZkHJ1fqpUbR6O8aMWWfopL7K0R4DN/DLr/Dw+DIS0x/LMn1ijyXIwDaDqrC5sYVl61cgLmgnsvtUqE6Csawn33dJ71ynSgdo6CDB6syy61NgYPWaPrIqJ6FrHpzcnM6jkPrGm6qzkalpSmXpg3lfS8taoKRDLVP5LppWm0aF0aWIeREdHgzN/wBtj4wZNtTVv01CjodK5r3YU/UQjZvorqr4VSksTTVIc6eaPaRjqgkVy7iDn5vo82fR9RQNKNIsOPNVSLTvfMD5P16jqhpz3TUmrqH7rouVXcem7/vv9I//AFSd5IPJM+j06kZrLCY4OdmbPoBOhHlK9AiM0B1GZKxsAfdCIAfK+o0dW6oHcau1Rpqq2sq3fF9x/pCZPoNZSVGrkCFsET3XCnD8V33/ALa/o7Vp9n/yNWIq0VwXAFHVaXrCW/RfsMgNd03RnNCuC4i8z4U+b09hS0PwH/mkYAz/AF3R93qleg3dPnKqenUavc95p/zGdoOvalUUfHqpWhyPOOHds/8A5dNA17YmkzjqXWaFZVO01Lnei0/2KQ+g7LVzlDgXwIdmSn28iY1PeMGsabtrQ0dOL3vuwft43o/KFSMHlr9/61MuU6DSWiDKRdoJ9jJfa/SEO+cJPTgS5XxeqnAYO8/aks97ZVDiBOZysM6irGZSwGRXu9Mb9I/MYOnTViFjF3fEnRhoVGhZCtb+vAXE+sbHmRkeQuP+zyX0fR307SpDMmcnkz6AwsX04DjBNGv5nFLgy4v0HQQEBNhl9cqWCU+/14v63adaDpdjKADCsTjDHf70+P8AWHVy9VbSrMsQO7KfZGEGe4cx/anZBbKg6pj7RP8A9BFxgj0uq/cM3mIhh5KYwTRsG1Zvu7n9VkfWaathEtdxEc5NZVLET9h20LS2pYFhV6bS4uN9pfUuifTqykJRMz3EfdfR44rEWib8FxAnNI91HQsUBhSWibuTidACodsrprB7Ng/ko40fTaVNwAvGPsYv03UlivGZ9hO8/Iqj4OLBABhqWghWKEGLu6A50oNltiatNeL0MtHvkxhpvCN/VlRp2pLLgM+J7sEmVltPH9idSmO6gn0BtU5+5XsX7wds5Uw9OpZlExC+H2U3jXqw10BAwxsDdeSmZunAI8sLeTNHUZbweHwYmizHjcfoj6PrX+tGHq/z+P8Ah49yS++VaxxoWJFm72UHnJnvXr9+YxT6UfG/l8Qulq1Vz32qCj5KvtU+idldHWVGm8BLk/5ie/bvQa6qpSZQ42NR2Kqt323+jZQVlWFPTggzEbEztaEf2Bm6tg6GlqDZ1gN2fD9q8b9KDTaNdpPBHEDoTtttVdpx1Wm2kYdjmmPavt2+jMF4MjX9yp0kDUHORfxnaXsp2G4CfkmT7Sa8+op2v0rhPsKPLG9G59PRCt52kbsH0n47ABRWaOAgTw5l7qrlRPs5srzaerqjIiQmqdR/Z6X4BuVd/wDMP5O3GXCU7uOBncb1h+0QfQtHekDq77iDkpgA4dpiMXPYPxr9Xlhh3e2kWgbQ+pkfR1lIQ5LLbKzBWZumazqVHcYMx3XxcYE2m3j2i7udE+pUa18ywisdvqZQpvvgztRyGTA6ociAwY/qOsYVFVdXoCjzbp8ZjjR8jrDYFpYcyeTHDk0FRc8F3kacOV0IrMlo4OEsOBMBcITWPcIVXzO2VKjTXXCPrWdtB9BolrDGvrd9J/R6yrpXu5BWZpYGfNATRwl334NplY9hD6IQzm5L+v70XAYYrRi9umoIbH3FZzkwh1ZwlOTqRkMAI/7g1kORiLW98mJ6zQV3ixlpCfbfXzSHaksQ4w6/IhNHjYoGHdxwLAx2j2bYJN9KFg5uclv0WAfcUjAemmy7nehuzdhNA1jZVhVBPzjiOjwuTMn8oOzb2WLpKEivdVc1UYAn6PY+uWIG8CYWHA5scbN6DVrUa3rARzZ8uGaB5Ptm9RXRK35fGfbJa70mXDtNAWmxa+vACXdjt4zK6aBselBUpswCXTvnJa36LJersEc5/ejnQaN5BZScQmnBhjVN0xXihQVuZ8Ev26k8lH6wm6lQmS6elhDjz2l7WWPmFi7rLREN1dG+zaQZcbPbTWXc9JikqJi+2Gzb1j01aD51Kn0yk/PpyXXd4P8A1UqNu9BQSqjdFjfVft5m+j7K4wHe1iw82flfBd6mSqUr3UY39Nme9ghGpbVLWo39UUOw4fbzP9X1dFQPMqu+w/kIw272PZWAO6PtLN2UzDY/QX1QO+ct3Y/n0rcm4vSn3ulGl6aFj+HNzlUnpMj9Y0GhYIZ6ptyf/iOH+xTQHeT3JZeYkT+2dHFZs4sfRKo++zOxSQBtm6O0TCkX1P7RPRrGm1brDA8ZB22Lv5UaDjF5oNH5aUGm0SGXLs/YwAh3axSLEM67r+xV7CEavkp6drKVFxmmqw0n2qL9o9CuqhOlR33eygrE2kOS272UXGCf0HQbkelrtvdmcmUGj7YaaVUWm72N4cnFmg9ZqVolguu9rIDR97vIEIWXOqnfl4Abf5yWsgWu3j7aKKzTrRKxlv1UXaxva6hT8425uyhG22sLp6Vtd1sCc0AE/WE+zt+JqT8QpaH6dCHJMi6GAz9FMP0HfiLzrnJhB6FR0ivi82hLsbRZk4sNVA8Wnd7mgUeMSFnVv7aUDqO4Zn+0msLoTUx6GMKqrNyTiTvO7y4c7HwRgogfMdxIvhDUrISP8Ml0JeRdpwxgl3EMO/3PmAwSq2MKNKxi9N5QhPCUAF+sUfUO8uCsnaPqWQb8do5oU77w/wCSTusJOnS16FkXSFHmTAbl31LDrcs+t7aZvWVlWNQ1Cz4Q56W/n3w+XDqy0MnrSe02jezpNGfuapDvpME77YcLS2gTR6utxis12nhhGpVi1iDGHcMXuS9Lcb19Sj5LpL67tqhIGdcZCCOQlWHeal8Z/tj4KK2tHkKjUsDOA323yg8k2u0LBKqQ+4ArKqiS1XwXepi+m0esakos9DgF/wDuv/mM3jY/R6SnVutJSWqRvWFSe/l3RKdj1KOtTMHY2prFY5BDzD68l9NrOE1hw2OjjWE3BnYvr9tI/R3LHpFnq5u+msmdrxMVA18TtvHUNGpT6qrHg3XN+vVsTprEEOcz4M1V/tsl/K/oPnIQpVvWLf8AtRKmu+g1v+7on2P03d1YD4udVdt+ezE1NfEe4+o0OX8EsHVnvkfWEJP7K6bSJvZS3Fnd30YpSZdIvZw2dymH9Om0JWsWvGXbJVKUvLTs/IRR0bBtg9Zo6yIj4eNPJjhzep82Du++Pze5bA7dwmKE/wDc3SE8TpKrm5qrMr6R6FKfq9Irstv+p9JmcaPRo86dNUa7SOsquUn8ynUe41Wrt9EAm0SeS3D6TvUDmXGpUdxixfVkPtHptw5EdYOfNIcnvOqQTP6zmVTmL6wab2MXOtpM/wBYo3ii++dptGhlWL7xvCjwp+k1EoNpKO2iKl/Ccl/MXNpXoWQkhPbQC0vSXG17kCQcHH7KZf5SNYoaqg6aF4EN7vYz6grOIcjPv+1mYeUfTQcAZ15OdO0DVw+EOZj3kaS+o0unq65eIjo6rfMKfjUsNByM6QWzrG6qQn7RSz5X27o9sdS1QtnNH0pgqCs0vNzt287Us/RDYrYO1QvZaLcNKiscr4NUVUmXlu9EqjUYMIYO/wAQbg3XDF7k3cyME5C5lk52cuzCaXNuM8hipntYJ6PTWYv8TsYwTpoCU5Lj6mOL3OeJcxc83I9IpnKOMNvL8ePei92MuXfF7WvL1IThf8yWKdm0f2V2ccXee9NGu3rxxR4xHpWziv5MTpS8vU4ZyUM+YV0bSiwQmK3Gi/Yw6aQCtD5js0YbmgW5/W775IOnTasuzDii92g1V2Q7RjEvTYPe8BZKzHw9ygw3DnNd3cc2Z+nZbRhb0MWgiJftXejSow1XqLG2L06bXF03sXbG7JBwR8Be8orT9FA29nHj4Q5OFUoNHo+ux/6HD48fJB9NzpUSwXxQhzgIbzQQl7KQktufIVmplqMHOuA18XHE7qNazFEI54hxr4fbSfrM5HwLIemMLAbQXl30Jfyj+TJ9UStc0auFFfRJ3Kjq3J3mmqNLr63T/Qq6hjDUcdwgHW7786mg0dW+2w1zxqSUF03sC2Z2ZpvVv0NHTa3Ghehl6r2W57bgd3U7po3iBsZ1zdhT9nmgUWj0nd2lCE6CHrr76LXN6cy7TtH68jF/MNcQDn5nO5KY50fTa4Q9L4h7mae7SKS0clol3MX9CaEbVm+VszK7G36WctWhOnTVi/Pj4j58j/uPqh1o9ZziSfNuDD8Zp6rffhs2BOg0PXOunJo0FzN6XbIu5Hk/Axfa4GfucGc6Rd1yO2a3v4P5hWJ3rR758nNNI/k0j5dX3Pbe3g9HR6UvpP04ivd/o84XfBxF77XAz52jmXTjfPKdH4MfzHZ0zWNzocXLeI399B/5NEPhciWp0EL7XAyd2ciEJ5dpuS75s0//AN37eOu4j7GL6xOjDy11YwssJqMy1ZXBSHSniFYLG7sf1Whm0UbcarAAeCS+mp00fSlvErIwbjs4LSmjostB9DNVuYjRXkM3c7q44R0OqrsYL944v42D1PyLk/GJyax6/nRin1sWmaI2+pQUaWFy2AMuPM67BexYkUx9GrmJZDp4w2b2vMuksi7bHcmF5tqVtyvSXDt0X02HOTgLsFiUl6xyyPt4wo3IEO3G6LpUfUs7leVCg3M/c7Af894/wwdumvI4v+7akv6Udb66UNJrwO5iLRs7bnSyvOFgnJSsSivST1Zrp0/Ix8UXu214ceC4Yg2q1JbisWclvNps5fFbMlM1uL3ymslqJqat4moJ2v4SPBB+ja/JbjWNsh/Nr/d68H8zrE74tfkYs824OPX9FxqO2D+GwLYO7aN7LV/P7aScV5jHp4OtGpatxlXSVk12b9j6Qo2sdT9DPWwyH1Ksfvo0qwK3Dn3v7VLDR0mNKDA9dMUalnY/AHVDvZrEmNGV+5i4Cacm/J7C9WpPLgg3nJhF0rev35P6btIxnTevqyf88HvBmwy7GUkzUm30NZLUU0hNYtZdhbOrNpDWI8ZWyHTtG8RG9dxTzqWrvdzARwytvp6Rq4zqvXnsMWIOeOeRWTuMQ5gCJZoSnqj8nfSumKiWMtTduDyCar1h6bQwCRH9dO+6MC6B5DB7hyYw1KjyF0LX98InRp2pJEzsuvdItUbF8y9T+lMBxo+sIYN+DiQmDu2jpFkC1rEie7A77BB9BozE+i8LR76T+paDQ07xzvEek3ZsXxl8WtCP7JyJgEax5U6Snr/MzAK7Dnc2OE7Ur7RiLudyYPqWgodeZrG404c2GT7tCMgHmW2OzcqMy8yGRMBh90iB+Kdhz44dtJSEOTAIjJ92goIe3+pzSPS5FhIXcYxa0I/s6yyJgmr5NQ03aTTXXIW8SIO6moJ00xFWC2x3bfmu5T4XrNqULfUGiktFDqVOXD282jyP7ePY/dK6qxi74GmrT8al3TZlv9mTrdOb5Fg3R11Aid7BAO5+DSgdwiOSEOcYjx/5mL+i9hDM0ixoReTKQRPmuPs+GMPW/Tf8YwzLIuWHDOwhxePHj3Z0yqd5eWgk+5OTpKc6jjhV/EtnFOenhx+tDKpNmbUG02jWIT+ncs7D/YwakcdmSEYVldkCQebJBOTpoFz/AJ8YO021WRcI01wLGxkHTrq2DgWjH7aKWp6Ruy+nUYabgYYr4rjd3MJdpADeZ9VEXaa1abrF3F7XNHG+cJLx8J/XRs9kvqVIhLcfEQ4c0HdpC7wvPhNOZ32eOHWE/OxFwh2Ks0X1jrjvwEV/bc6MS2x4FVNaleBtHSnHRoWu7jT2ubeZ6KzZzIgjYwrvYq7+R1HrFwKQtdoA6VGo7SMpQFjPX9j9K8f5Zv08jgfMIPn8flTD06djuBYENiedldGFHo7y4+HsZQO2kYx5sNF3Jwu50Ho9Y+r4QTgwzJTOvj+T6dKy2jcD6boLy5mQRE054x8z9ZZ9Xc8ycMPTq93Lx2hhwQh2pIHqcXoe5StHifo9CZxH9T2UIo0gPT84Z5TqT1jjY8i6cODlOnUabVX3wOtlekXUaX23sC3kxfpqXiRAZl7edSJqhLPVv7nsYv13yg0qTJjzHECe2gcio8494fVPsZm23ex51xiaKoVkCeS3DvMQabtetmVCOYaHUuakd6Nu9LKBO2ulEQrCqEiN1UjtoAVGHGoQnzvqPRXV1Q0H1RWA7uvRp9IecUEBZGCIh3zZPuo6S0zBgiGHPmwwGDN9j9YqqhvYWi5OFKc0YUdHhuYZ3Wdsn2EcJo0UfZgTPyLuwg9Y26qHuw776+Rk3AR+paPVifS9nV9FzUiU/Gp2mpeurp96fcaHUtalzZQbR6Oy5T0VTBsdgc329L9Ck/r2j129Z6s7lA6l1SjxJ+D/AGKEtMvA5r4x9AOSwoQlNw452b3vHjx8kIS6SVYPhtunb5aOOc798Hd++Llgc5No3zk8vovM52b565zm3RcYCUuuHHE3RWHxflowdj8ePHvTlJAuYxcCci4BCay6cl2O5h8U5KVjF+Y/XttgQMesUGclhFk9WEJd7SeXX3fizzZnpFwbfLe0k/tJvZIE6GkWw81KjFVu3b0XfYw1JPWv9fsZyXB1L+EHSxlU8VBGamdBcaPZcC/ro4274kZ/mRPpqbS6GRhrGPdym+s3gnzC0/zDJ6Ost6Bv++coOX26PXk+nouIeX1JQJQsS5HCOaYua28fk+jyszqbfDsJj03znOWP43OhPMv/ABYuck7xwBaPfSuLYYJxkXL685OpW2Z/v9imDp060ceQrvaz3ucu4QPigMGMbd7LLrkVG66kxZb5mdzvjU+V9pPJ7XOrR1KhrlkTvrvSX+hf9DPvDUdidKrENRjtGqdmdirInq/JlQrpwQHCQfA3K+Evni07vc75TB9lfOrqNVlKSwB1VRakptH/ACnUbhRf0l9ujjUtm3pMGI04R9Mpf7d8dmgZtRTUdKFoaQdzyYw15NcVQKAXwhR0r8vt/sUaT+pDgYxttr1cLWoRaPc5m/Bt1g2peVNFK1TKu4UnutE5qk+jedK6WG22jmx+M+HuOT8J3r6FXUM7QvJ6ghEKsCYIVnnRKWxkCg0GsrrjOqtGXDtNMRvqzG0IndRgsCN59TenTH9S8rNIVLUalfx0TqV26Kd/oG4wAoPukeVUfMyAijqnJ84y4+69C+nlsuI04Upw/bZh+yrn1h7o9a8VantUu+NfYZrGhaRqQ1gnjHD6KhOZMWQMmQ2B3DCEttjB2jwjzOZXTR3K9J89lq21yk/+Hx8k84GfLH/Ro6+Fl8I82su6/jx/VF7lekE7R+vIQ9P3yi3FaPTKjzEyd0aPwizJwg6FyvSNJXSfcnhv/wD4wjTem4YfudvZxh5tX7SFyvSRnXFafsQVirisXB9y8e5/dLBOjrvs4uxg+6dbHC5XpJzjjNFJDAz5Ye773+X90cJ024uXOrNH6v7aF2vR+CJjtHGJbCbOP5kY7n72THLDR9NYwrwtthFYrisP2Mu5Wm9G/UrZmtd6S/nE7ehdlsoKzHbg+pkvqVguwetKBvEN8uthmspHu03Hcc8Oq1//AKSp/E8ePwffg/mbrcseOZSaoprabWt2r4J9NZB3akAjkYy0ZcJ0FAjzDg6dnKRl2Tis7lsrLjLO/CHTq7CIgDisdzp76xy7poP3NrSJczr9tO6NBR71kLsRqM5xEPprnr6CXfB984uk/WmgeYkLIQOEfcgi2/J14XGL5xQt74mPu6dSEhOkeNodtljjzi8VfjZs32Wah9yCOLmFdmhH3IIu6Vh1cPZS0SjQsU5jWdUJoY/RprmAAVaxHOmq3z7PJ+j0c0gb2GQkfY/UUs3h2x6Pd5936KDp2PQI9Kwqi4097FLtej8CudcPBTENS1J6aNtc9BMFDtycpvxj02S2j6CsWgg0WgdHvqUu7ifVGpbFIKnKk4SI+xywij2ER7mR/ERpwZp3uaNjo9SM4oWC5T5H0LQqQhLAvE03dqpM2DR9nKvLn5jLOxyzYKPZakSXZjwRg3V1r5YMGe5enwYWsWzijRdSaORm/LLvxhCXLESWx43SP3O4Yvcnj7TqRW+npGc3PTkpoHnFdo8/qTqPUUe34vYzL/M7y93j68X1mzdWshZnKzD2PxreorfozL9nIL+jaE6wi3IZwf7o0Wlxlxpmb6Oli1CvrWJ72EZVkIX2jF84VwUazag4J1Ll2r0hRcnaRA9hJ91GhnaH/mZydBRfwXWhISpRsOp5uODj7lgnaqkYImu640xf5+D3fHjx8sj00ZpaFIs7u+idOxNckMh6qRfylmdyfivp/oU4X7GG7lhbjSPPyxIsd1s52vW9f15LuTjLmHwwdOm2iWTine8o2HUUmKZBbeU0BOsLH17RjCs1dZdRgkWGZO6jYI3ndd7KMMCx7Q43LVONl/ZWzPZz/SOHJuPIcqPUkPm4h8fwli7qTWS814OUxay3jdAZ1WwS4+GD+fgusv8A4yf1K8hxrZB0p9p1ZnJqpGrptNT8lR59YI8BznbUvEeX68n8Nt3HGGFZXHFryegs7tg49Ah2sGQwfz8+0QDrePH9cX+sIQmjSsuOKXjGwGbtgHvTtVVD1z4oQ7a+uG195RO5K7u0nViboXlGw6hZIAQnbyuEiWb+Lt8s6j2vqrzBb+onnQDc+AsYcWHvYuSli7gs/LfaIXlGw6ne6oOHQsaPbWqIp4dt5VifXk+nhE14+L20X1lIwqgD4eOF5RsOoXXBaFh/7QdSqDEA6vfO9hF+m7U1XFVb0ViO5+kRf0YxAVoArT3pLsUXuozIAQh4r+pVBKpFajSUyBh0HDtqTK5mcrYPzGDzGcUl9e0dC6cmV1UVv1X57CNHrKQjJ4XFfF5iZ70iyQDQE8VsX4V3kd8Yerj/AITk9XBOA9lOS5BEWN/vr7aEOSu3jOS+zeyq6Po6VrPr9jllRm8e7FxO0toD+bg7uDt05doxgmsg9Yq62RkTAZtO73CE0a7euMHSkx6YPzB68IS6SciQ2jTtAVRZQmIpNOF32eU+pJubnM7QDsVe3jjffHuxPV4GQGBA7TmOMXrYwfbJj/8AR/1Rhl4uXF+bx7sAF7kmRQh2MR5kH3MxImZy43Qis4gJHz52lhZQhONlOOPrSoam1WT6mS+juwqBHWs5MsKxxkr9DNbLTHgnz1ZfxiHzLKENs6kXpTd7pnGHW8fw+SZuY1Pea2nPkDuo7Z1H1vxYQ1PWX6s6jVcU4FlZm1PCU3FfPNHf2dkXp2woUvOkvIjRuuZP6lF+peUHTViJr6vfVc75UCzNqP6yjt6SYZwnNw8td0j9H2102qVeB3EG9ZvH8ZUOrDIOp13Tge8iYHb5aWOyEeeKEgF+QbT72D1dHwEEl00aBQK8ZLDsE4owSVLqMC93IdsTVlHwFgAfd7mOKx3AXqkCZm1Zq700oYK5ZEDsDqvDFxgsU6axgAtiyu7blRwmjWP+HufHj+aD1mroSAsNn5WR6dtcwka0Cwgd2KnbtO9nR/QuVFZR3CWO0vbKbMX2bTqudNU95MUe9VtY5vwbdZuFZRrcFgXKv506swcCLOAEyRgYOdB+r4/j8s5P7p7JXgex3FOze948ePknJ4oO5J+7AXCM3j3Z3W8fw+SL+iwu8hDnQGDz6vzp4S7i/mg7nAXTjvg6eGAuMM3j3Z2H+b+qclyyhDnLEYwMHOdF+bx7s5LsnUhDkr9pFwOzXTsPv+PHj5YQnGIwf8e+MC4PR3kOP9lNIrEhg5HsZmyWmJZPwzWUpuQPrTV03yeXupiKz5yeqeymP8fu+PH90cfg8fLO1LrkE78Hj5ZnJna8TVSupHiD5uLGzqwhNg9nO4Pc8eP74vzcfj+MXLUyfyp7H1Y1BbQaMu4z+GJzek1H6jO8m/kyB1OfnVZMvd8EVNwzGQ3rCDprDWV4L4vqouBn+xWgoSoV7iKhdvXJw9h9ilgnR3/ovbSobzByet6U79aid2pcXTZ7bB+tRgXOSm3qHcMX6lgIxQd36KEUdYYmIP6x9zE+r1lvRnW+2yMAD69WLcJZ6RggfeyWTRoEMawKwOfzox2k1I2DYwyuw5s0j9BaxxDSVdxC7voxZtz5DARqWp0jiNlWtlmHNm/Pv6PjBWzdDUAVjyuf9dJ/TfJi9JFSb8WI+ThT8Jg+vbCMoQyUKGts9k74RAXNA02jrhu3uryX8jNmlAlPGPVu+tnaRRmNKOQBEj5+HNvMPo77h5YxcYCfw+PknsnrSi0SPJCE/uleLnhLrRnod+UnO61kHze948ePkjAHJxjy/wBtB3O4oR+j/qhHR0rLmRcYF+5rHnxg5y51J0d2c5KVjADvV6nj+M7D7/jx4+WEO4hnerj/AIQFwfdFj2cITj8ePHvwdLVkOQDuGeyAHsze92fj3YPh97x48fJCEp8f6pzuGMAT+bjH9tNo03UfRy4/qZi+G0/002jR+JF+P3sOaaGjbePuYatea95l7U8ZccIS5cHc3mkudh/m/qlNM7XiaSV8nic6jMiHGf5aMMPv+PHj5YOl0IS5nU/DFy0TUgPmtLHF7qu27J6k9/RwlfCMNw/48CRRp2sMcDaXqmEH2b0fCW9sMiv7n/vsqE0dpZ1r7nnRfV1jLhxhwwAYZrm8HD9bF7tHpBIs6+L2McaO5frzH9e0GuKryWAXOw5s3xWMAXGvaadQZrA7Rw7ll+ywei01dCoPWEOxTGCdHYTSed1nosh9tdew1HSjGY9Ad7hjAwZPrHlkrqd4oOkIgzbk5qqPefSvpu/S503yqPK5mC4Ao8zsKayeNByVSivMCE+xTufxqEaPpqCEaE9DKzsXOSmi82QA1jZvV11lLvSwt7jmpnozWkK/Wg2zepWqatdJi53JzQjTbxtzxcAhyVjOzePdifNcQ8zhjjCv3PHjx8srxc7D/N/VB0/unb7492cjHd/rgAR63L8e/B0/uhCenu/H+CdhtgMHsnqwL+WE8ueU/fgLnh2Tx48e9O/x/Hj3pzncP6aGRgBYnTQWGBaxEA7FSp7/AFsnj7//AOJzuHs57IELqPXx9fx4/j/PB3fjwyfxyygIrrUXO/fNp03BupXnaOHsZj7k+peM1/TaO5A4/YzU0bbx9zF1fzU/6QxesdxcE7tPxfH/ABnO4SKGSnm9a8fk1so+QGnrXzs1xRh+Dx8sH3Lx7n90ri2Ocm2EJdd6k53T3cHTfbABg7Usf+CL6zUgHjO23DVOzKg+o0dUwMaF8QO7F0n07B1ZKdQrYsRfR1SaNvsKqAwUGj6uioLGsLSnbVaktahexZF9UmQ+m+TLWF1ABVaiOIKzfXOT8K/MpqFZprCLIh5CO+Z+27CljAuEJcxiBf8APT2MT6k7DS+lWtsTzvtEIbVoG1AVQ3m7k/URxRtRdumcbjT2MAMH1fakKFAV1Jo5MI6yl0vFV+jbv9tlA7yj23oesR6QTVZm4ZYNculfj+f3zXSfS7TaoyNlIPumn2Por4wMGf6lqW+UqNSXXEoTd2M0DTU3H2917ux+LQisrNHcIgwxIAdnTGGmpQu1CA4YuLidPDcv8JygUi4Ivo0r/wDujjMsepFwB3Y/Hjx705XrePnQd374ww9aABNGniyTw7ig+bx7sMi4Hrcm0b53L7vx4/nnnrDZPDsY9nGAOcnx/rhDv3wdzrvUnZre0nmX2vaBzv3zk/uk+namkcXQCz4pQJ/dPRC6lPOBnyzw7hL1Z656/wAPj5ICK61F/L4Q9abhsq70MfyNVMXo6IHNGw+p3s2DR0rELAuLoBNVNpTpbwTFVjzU9UMg6xQ9KfH+qL0t7yME5PHjx78zk3rXj8mkltjwPZA83DfOzcVh8MY5rR4+EZXFgLsrLepxTqNTCOMN8XdB21lvZwLA5NWYnZ+2lBmt7SJ6PUbuWaCH8tO9bGyeLM9J1tO73J/UtYzBgQdubkpb9qnbCUdcuiV5yuI8POnoTptcl5UtDQiKg52WU7nGIdS7nRs5E/WbiuqHkXFmmfu10KfaQ89ywOj76aS7OLRYGlZed2zYNtS6qqLgZQiz62ABGpaPptcORnFZ2OF0ydNG9bwRSAwcG9JS5KfRpqGzbqqnAlvQNodjhlxiQwMdlt+9I5TowBj+m1mlLtfgtvTyU/FpcKcu7Ovqznabxcik6jsHK+LzqNNp2ePki4H/2Q=='
    );

    return tiles.get(key)?.valueOf() ?? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEABIABABYgdoOhwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kGFwAcDSfXW4wAAAMtSURBVHja7d2xbcMwEIZRK2DrQkAGyQych8N6EHYZgKkCBNcpEPwXfK9Uk1AHfKDc3NHPsR7Alj68AhAAQACAnbT64PU93/oPfD0/3/43//7txJnT5/89d2rm5p87f529GwD4BAAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEALjF0c+xvAbYk+WgD8tBLQe1HBTwGwAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIAXGQ9OLgBADtq9UFiV7398DNy7tTMzT93/jp7NwDwCQAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgBcdfRzLK8B9tTqg8SuevvhZ+TcqZmbf+78dfY+AcBvAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAALewHBTcAAABAAQA2EOrDxK76u2Hn5Fzp2Zu/rnz19m7AYBPAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAOCqo59jeQ2wp1YfJHbV2w8/I+dOzdz8c+evs/cJAH4DAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAIB/sh4c3ACAHbX6ILGr3n74GTl3aubmnzt/nb0bAPgEAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAK46+jmW1wB7avVBYle9/fAzcu7UzM0/d/46e58A4DcAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAA4E52A4IbACAAgAAAe/gBFkfRtvZXmQcAAAAASUVORK5CYII='.valueOf();
  }
}


const custom = function (options?: L.TileLayerOptions): CustomTileLayer {
  return new CustomTileLayer(options);
};

// Global variable to be able to reference map after it is initialized
const myMapObjects = new Map<string, any>();
const layerData = new Map<string, L.LayerGroup>();

export default function MapApp(props: PageContainerProps): JSX.Element {
  const modalStyle_0 = {
    position: 'absolute' as 'absolute',
    top: '100dvh',
    height: '0vh',
    left: '0%',
    width: '100%',
    boxShadow: 24,
    transition: 'all 0.1s ease-in-out',
  };
  const modalStyle_10 = {
    position: 'absolute' as 'absolute',
    top: '90dvh',
    height: '10vh',
    left: '0%',
    width: '100%',
    boxShadow: 24,
    transition: 'all 0.3s ease-in-out',
  };
  const modalStyle_30 = {
    position: 'absolute' as 'absolute',
    top: '70dvh',
    height: '30vh',
    left: '0%',
    width: '100%',
    boxShadow: 24,
    transition: 'all 0.3s ease-in-out',
  };
  const modalStyle_90 = {
    position: 'absolute' as 'absolute',
    top: '10dvh',
    height: '90vh',
    left: '0%',
    width: '100%',
    boxShadow: 24,
    transition: 'all 0.3s ease-in-out',
  };
  const modalTitleStyle = {
    fontFamily: 'Jura',
    fontSize: '18px',
    letterSpacing: '0.05rem',
    padding: '10px 16px 0',
    filter: 'drop-shadow(rgb(255, 255, 255) 0px 0px 4px)',
  }
  const modalBodyStyle = {
    fontFamily: 'Jura',
    fontSize: '14px',
    padding: '0px 16px 0',
    filter: 'drop-shadow(rgb(255, 255, 255) 0px 0px 4px)',
  }
  const flexFooter = {
    position: 'absolute',
    top: 'calc(100dvh - 174px)',
    width: '100%',
    transition: 'all 0.3s ease-in-out',
  };
  const flexFooterFront = {
    position: 'absolute',
    top: 'calc(100dvh - 174px)',
    width: '100%',
    transition: 'all 0.3s ease-in-out',
    zIndex: '2000',
  };
  const flexFooterHidden = {
    position: 'absolute',
    top: 'calc(100dvh - 64px)',
    width: '100%',
    transition: 'all 0.1s ease-in-out',
  };
  const mapFull = {
    height: "100%",
    transition: 'all 0.3s ease-in-out',
  };
  const mapEdit = {
    height: "50%",
    transition: 'all 0.3s ease-in-out',
  };
  const mapRef = useRef(null);
  const [userLocationKnown, setUserLocationKnown] = useState(false);
  const [lastKnownLocation, setLastKnownLocation] = useState<L.LatLng>(L.latLng(0, 0));
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [selectedLocation, setSelectedLocation] = useState({id: "", name: "", venuetype: "", openState: "", nextTimeMsg: "", prettyhours: [], rating: "", ownerisfaction: false, owner: "", ownername: "", ownerlink: "", reviews: [], neocities: ""});
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalSizeStyle, setInfoModalSizeStyle] = useState(modalStyle_0);
  const [infoModalSize, setInfoModalSize] = useState(0);
  const [showLayerModal, setShowLayerModal] = useState(false);
  const [layerModalSizeStyle, setLayerModalSizeStyle] = useState(modalStyle_0);
  const [layerStates, setLayerStates] = useState<Record<string, boolean>>({
    eventLayer: false,
    devLayer: false,
    myLocationsLayer: false,
    unverifiedLayer: false,
  });
  const [footerStyle, setFooterStyle] = useState(flexFooter);
  const [mapStyle, setMapStyle] = useState(mapFull);

  const { state,
    fetchAllLocations = () => {},
    fetchUnverifiedLocations = () => {},
    fetchLocationById = (id: string) => {},
  }: NnProviderValues = React.useContext(NnContext);

  const options: L.MapOptions = {
    center: L.latLng(35.0798889, -117.8222298), // Intersection of Main & Alpha
    zoom: 18,
    minZoom: 18,
    maxZoom: 22,
    zoomSnap: 0.5,
    rotate: true,
    bearing: 0,
    maxBounds: L.latLng(35.0798889, -117.8222298).toBounds(1400),
  };

  // This does a little hacking to render a materialUi icon as a leaflet marker
  const getIconSettings = (materialIcon: any, color: string) => {
    return {
      mapIconUrl: '<svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 240"><defs><filter id="f1" x="0" y="0" xmlns="http://www.w3.org/2000/svg"><feGaussianBlur in="SourceGraphic" stdDeviation="7" /></filter></defs><path fill="#ffffff90" filter="url(#f1)" transform="translate(7.5 120) scale(0.9 0.5)" d="M74 0L149 40L144 120L74 240L4 120L4 40z"/><path fill="{mapIconColor}" stroke-width="4px" stroke="#000000" d="M74 0L149 40L144 120L74 240L4 120L4 40z"/><svg version="1" xmlns="http://www.w3.org/2000/svg" width="90%" x="8px" y="-30px">' + (materialIcon ? ReactDOMServer.renderToStaticMarkup(materialIcon) : '') + '</svg></svg>',
      mapIconColor: color
    };
  };

  // maybe this should move to locations render util
  const getDivIcon = (materialIcon: any, color: string) => {
    const settings = getIconSettings(materialIcon, color);
    return L.divIcon({
      className: "leaflet-data-marker",
      html: L.Util.template(settings.mapIconUrl, settings),
      iconAnchor: [15, 48],
      iconSize: [30, 48],
      tooltipAnchor: [2, -30]
    });
  };

  const openInfoModal = () => {
    setInfoModalSize(10);
    setInfoModalSizeStyle(modalStyle_0);
    setFooterStyle(flexFooterHidden);
    setShowInfoModal(true);
    // Timeout is required for animation to start
    setTimeout(() => {
      setInfoModalSizeStyle(modalStyle_10);
    }, 0);
  }

  const closeInfoModal = () => {
    setInfoModalSize(0);
    setInfoModalSizeStyle(modalStyle_0);
    setFooterStyle(flexFooter);
    setTimeout(() => {
      setShowInfoModal(false);
    }, 100);
  }

  const openLayerModal = () => {
    setLayerModalSizeStyle(modalStyle_0);
    setFooterStyle(flexFooterHidden);
    setShowLayerModal(true);
    // Timeout is required for animation to start
    setTimeout(() => {
      setLayerModalSizeStyle(modalStyle_30);
    }, 0);
  }

  const closeLayerModal = () => {
    setLayerModalSizeStyle(modalStyle_0);
    setFooterStyle(flexFooter);
    setTimeout(() => {
      setShowLayerModal(false);
    }, 100);
  }

  const expandModalFrom10 = () => {
    setInfoModalSizeStyle(modalStyle_90);
    setInfoModalSize(90);
    setFooterStyle(flexFooterFront);
  }

  const colapseModalFrom90 = () => {
    setInfoModalSizeStyle(modalStyle_10);
    setTimeout(() => setInfoModalSize(10), 200);
    setFooterStyle(flexFooterHidden);
  }

  const handleMouseUpDownIgnore = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleLayerSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const myMap = myMapObjects.get("map") as L.Map | undefined;
    const targetLayer = layerData.get(event.target.id) as L.LayerGroup | undefined;
    if (!myMap || !targetLayer) return;

    if (event.target.checked && !myMap.hasLayer(targetLayer)) {
      fetchUnverifiedLocations();
      myMap.addLayer(targetLayer);
    } else if (!event.target.checked && myMap.hasLayer(targetLayer)) {
      myMap.removeLayer(targetLayer);
    }

    // Keep the modal switch UI in sync with Leaflet.
    setLayerStates((prev) => ({ ...prev, [event.target.id]: event.target.checked }));
  };

  // Cyberpunk 2077 Blue #5191ff
  
  // Colorblind friendly colors (used for map markers)
  const cyberGreen = "#009E73"; // Food
  const cyberOrange = "#D55E00"; // Event
  const cyberBlueDark = "#0072B2"; // Spaceport
  const cyberBlueLight = "#56B4E9"; // Midtown
  const cyberYellow = "#F0E442"; // Downtown

  // TODO: More robust venue type detection and icon/color assignment
  // TODO: Move to location renderer or other util file
  const getVenueIconAndColor = (venuetype: string): { icon: React.ReactElement; color: string } => {
    const vt = (venuetype || '').toLowerCase();
    if (vt.includes('arcade')) return { icon: <GamepadIcon style={{ color: cyberOrange }} />, color: cyberBlueLight };
    if (vt.includes('food') || vt.includes('stall') || vt.includes('restaurant') || vt.includes('dining')) return { icon: <RamenDiningIcon style={{ color: cyberYellow }} />, color: cyberGreen };
    if (vt.includes('entertainment') || vt.includes('music')) return { icon: <SpeakerIcon style={{ color: cyberGreen }} />, color: cyberYellow };
    if (vt.includes('megablock') || vt.includes('block')) return { icon: <HiveIcon style={{ color: cyberBlueDark }} />, color: cyberYellow };
    if (vt.includes('megamall') || vt.includes('block')) return { icon: <LocalMall style={{ color: cyberBlueDark }} />, color: cyberYellow };
    if (vt.includes('dev')) return { icon: <AdjustIcon style={{ color: "#FFFFFF" }} />, color: "#FF0000" };
    if (vt.includes('porto')) return { icon: <WcIcon style={{ color: "#FFFFFF" }} />, color: cyberOrange };
    if (vt.includes('medical')) return { icon: <HealthAndSafetyIcon style={{ color: "#FFFFFF" }} />, color: cyberOrange };6
    if (vt.includes('security')) return { icon: <LocalPoliceIcon style={{ color: "#FFFFFF" }} />, color: cyberOrange };
    return { icon: <AdjustIcon style={{ color: cyberYellow }} />, color: cyberBlueDark };
  };


  const handleRotate = (() => {
    const headingA = 0;
    const headingB = -90;

    const rotateControl = (myMapObjects.get("map") as any).rotateControl as RotateControl;

    if (rotateControl && rotateControl._arrow) {
      const oldArrow = rotateControl._arrow;

      // Clone the arrow to strip ALL hidden plugin listeners
      const newArrow = oldArrow.cloneNode(true) as HTMLElement;
      if (oldArrow.parentNode) {
        oldArrow.parentNode.replaceChild(newArrow, oldArrow);
      }
      // Update the reference in the control object
      rotateControl._arrow = newArrow;

      // Attach your custom toggle listener
      L.DomEvent.on(newArrow, 'click', (e) => {
        L.DomEvent.stop(e);

        const current = (myMapObjects.get("map") as any).getBearing();
        const next = Math.abs(current - headingA) < 0.1 ? headingB : headingA;
        
        (myMapObjects.get("map") as any).setBearing(next);
      });


      // Override _update to prevent the button from being hidden at 0 degrees
      rotateControl._update = function (this: RotateControl) {
        const bearing = this._map.getBearing();
        const container = this.getContainer();

        if (container) {
          container.style.display = 'block'; // Force visibility every update
        }

        // The original plugin logic often sets display: none here if bearing is 0.
        // We override it to only update the visual rotation of the arrow.
        if (this._arrow) {
          this._arrow.style.transform = `rotate(${bearing}deg)`;
        }
      };
      
      // Initial sync
      rotateControl._update();
    }
  });

  useEffect(() => {
    if (mapRef.current && !myMapObjects.has("map")) {
      const mymap = L.map(mapRef?.current, options);
      myMapObjects.set("map", mymap);

      custom({maxZoom: 22,}).addTo(mymap);

      handleRotate();

      // Map overlay - Have to hand adjust bounds to fit static map image onto tiles. Once done set opacity to 1
      L.imageOverlay(LARGE_MAP_FILE, L.latLngBounds([[35.083254, -117.824501], [35.078358, -117.820043]]), {
        opacity: 0.9,
      }).addTo(mymap);
      
      L.imageOverlay(ZOOMED_MAP_FILE, L.latLngBounds([[35.080537, -117.823547], [35.077797, -117.821157]]), {
        opacity: 0.7,
      }).addTo(mymap);

      L.control.scale({
        position: 'topright',
        imperial: false
      }).addTo(mymap);

      // Default lat-long 35.085124, -117.825341 (main entrance of event space) - use this for testing

      // Set up structural layers (location markers + zoom-toggled megablock/megamall).
      initStaticLayerGroups(mymap, layerData);

      // TODO Move this to dedicated layer not on the mapobject
      // Set up listeners/hooks
      mymap.on('locationfound', (e) => {
        console.log("Location found:", e);
        setUserLocationKnown(true);
        setLastKnownLocation(e.latlng);
        var radius = e.accuracy;
        L.marker(e.latlng, {icon: getDivIcon('', '#5191ff')}).addTo(mymap);
        L.circle(e.latlng, {radius}).addTo(mymap);
      });

      mymap.on('locationerror', (e) => {
        setUserLocationKnown(false);
        alert("Location access denied.");
      });

      // Listen to zoom level changes to toggle megablock and megamall layers.
      wireZoomLayerVisibility(mymap, layerData);

      mymap.on('moveend', (e) => {
        //console.log(mymap.getCenter());
      });

      if (typeof window !== 'undefined' && window?.isSecureContext) {
        mymap.locate({watch: true, maximumAge: 15000});
      }
    }

    // Cleanup function
    return () => {
      if (myMapObjects.has("map")) {
        const map = myMapObjects.get("map") as L.Map;
        map.remove();
        myMapObjects.delete("map");
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef]);

  const locationsFetchedRef = useRef(false);
  useEffect(() => {
    if (locationsFetchedRef.current) return;
    locationsFetchedRef.current = true;
    fetchAllLocations();
  }, [fetchAllLocations]);

  useEffect(() => {
    const locations = state?.network?.collections?.locations;
    if (!locations?.length) return;

    const mymap = myMapObjects.get("map") as L.Map | undefined;
    const locationMarkersLayer = layerData.get("locationMarkersLayer") as L.LayerGroup | undefined;
    if (!mymap || !locationMarkersLayer) return;

    renderLocationsToLeafletLayers({
      layerData,
      locations,
      userId: state?.user?.profile?.auth?.userid,
      factions: state?.user?.factions,
      getVenueIconAndColor,
      getDivIcon,
      onMarkerClick: (leafletMarker) => {
        setSelectedLocationId((leafletMarker as any).id);
        fetchLocationById((leafletMarker as any).id);
        mymap.flyTo(leafletMarker.getLatLng());
        openInfoModal();
      },
    });

    // We are setting all the markers into this myMapObjects then using it immediately below, but we will need to do this search elsewhere
    myMapObjects.set("allMarkers", []);

    mymap.eachLayer(function (layer) {
      if (layer instanceof L.Marker) {
        myMapObjects.get("allMarkers").push(layer);
      }
    });

    // If we passed in a location ID, open it up
    if (!selectedLocationId && props?.params?.id) {
      setSelectedLocationId(props?.params?.id);
      fetchLocationById(props?.params?.id);
      let allMarkers: L.Marker[] = myMapObjects.get("allMarkers") || [];
      let leafletMarker = allMarkers.find((marker: any) => marker.id === props?.params?.id);
      if (leafletMarker) {
        mymap.flyTo(leafletMarker.getLatLng());
        openInfoModal();
      }
    }
  }, [state?.network?.collections?.locations]);

  useEffect(() => {
    //console.log("selectedLocationId: " + selectedLocationId);
    let locations = state?.network?.collections?.locations || [];
    let loc = locations.length > 0 && selectedLocationId ? locations.find(loc => loc.id === selectedLocationId) : {};
    //console.log(loc);
    setSelectedLocation(loc);
  }, [selectedLocationId, state?.network?.collections?.locations]);

  // Search bar over map -- optional
  // <div><TextField style={{position: 'absolute', top: '12px', left: '54px', zIndex: '1100', backgroundColor: '#120458', width:'calc(100% - 108px'}}/></div>

  return (
    <Container disableGutters style={{
      height: 'calc(100% - 64px)',
      minWidth: '100vw',
      background: 'rgba(0,0,0,0.55)',
      position: 'absolute',
      top: '64px',
      overflow: 'hidden'
    }}>
      <div ref={mapRef} id="map" style={mapStyle}/>
      <Modal
        open={showInfoModal}
        onClose={closeInfoModal}
        sx={{
          '& .MuiModal-backdrop': {
            backgroundColor: 'rgba(93, 28, 194, 0.2)', // Change the color and opacity
          },
        }}
      >
        <Box sx={infoModalSizeStyle}
          className={styles.submenuPane}
          data-augmented-ui="tl-clip tr-clip-y br-2-clip-x both">
          {(infoModalSize === 10) &&
            (
              <Box>
                <Stack direction="row"
                  spacing={1}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography sx={modalTitleStyle} onClick={expandModalFrom10}>
                    {selectedLocation.name}
                  </Typography>
                  <IconButton
                    onClick={expandModalFrom10}
                    onMouseDown={handleMouseUpDownIgnore}
                    onMouseUp={handleMouseUpDownIgnore}
                  >
                    <ExpandLessIcon/>
                  </IconButton>
                </Stack>
                <Typography sx={modalBodyStyle} component="p">
                  {selectedLocation.venuetype}
                </Typography>
                <Typography sx={modalBodyStyle} component="p">{selectedLocation.openState} ⋅ {selectedLocation.nextTimeMsg}</Typography>
              </Box>
            )}
          {(infoModalSize === 90) &&
            (
              <Box>
                <Stack direction="row"
                  spacing={1}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography sx={modalTitleStyle} onClick={colapseModalFrom90}>
                    {selectedLocation.name}
                  </Typography>
                  <IconButton
                    onClick={colapseModalFrom90}
                    onMouseDown={handleMouseUpDownIgnore}
                    onMouseUp={handleMouseUpDownIgnore}
                  >
                    <ExpandMoreIcon/>
                  </IconButton>
                </Stack>
                <Stack direction="column"
                  spacing={0.5}
                  justifyContent="flex-start"
                  alignItems="flex-start"
                >
                  <Typography sx={modalBodyStyle} component="p">
                    [{selectedLocation.id}]
                  </Typography>
                  <Typography sx={modalBodyStyle} component="p">
                    {selectedLocation.rating}
                  </Typography>
                  <Typography sx={modalBodyStyle} component="p">
                    {selectedLocation.venuetype}
                  </Typography>
                  <Typography sx={modalBodyStyle} component="p">{selectedLocation.openState} ⋅ {selectedLocation.nextTimeMsg}</Typography>
                  <Divider color="secondary" flexItem/>
                  <Typography sx={modalBodyStyle} component="p">
                    {(selectedLocation.ownerisfaction ?
                      <CastleIcon fontSize="inherit"/> : <PersonIcon />)}
                    &nbsp;⋅&nbsp;
                    <Link
                      href={`${selectedLocation.ownerlink}`}>
                      {selectedLocation.ownername}
                    </Link>
                  </Typography>
                  <Divider color="secondary" flexItem/>
                  <Typography sx={modalBodyStyle} component="p"><QueryBuilderIcon fontSize="inherit"/>&nbsp;{selectedLocation.openState}</Typography>
                  <TableContainer component={Paper} style={{padding: '1vh'}}>
                    <Table aria-label="simple table">
                      <TableBody>
                        {selectedLocation.prettyhours.map((row: any) => (
                          <TableRow
                            key={row.day}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                          >
                            <TableCell component="th" scope="row" sx={modalBodyStyle}>
                              {row.day}
                            </TableCell>
                            <TableCell align="right" sx={modalBodyStyle}>
                              {row.hours.map((hourBlock: string, index: number) => (
                                <span key={index}>
                                  {hourBlock}
                                  {index < row.hours.length - 1 && <br/>}
                                </span>
                              ))}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Divider color="secondary" flexItem/>
                  <Typography sx={modalBodyStyle} component="p">
                    <LocationCityIcon fontSize="inherit"/>
                    &nbsp;⋅&nbsp;
                    <Link href={`/sites/${selectedLocation.neocities}`}>
                      {!!selectedLocation.neocities && selectedLocation.ownername}
                    </Link>
                  </Typography>
                  <Divider color="secondary" flexItem/>
                  <Typography sx={modalBodyStyle} component="p">
                    {selectedLocation.rating}
                  </Typography>
                </Stack>
                <SimpleScrollContainer>
                  <Box sx={{minWidth: "100%", height: "30vh"}}>
                    <Stack
                      spacing={0}
                      style={{
                        display: "flex",
                        flexDirection: "column-reverse",
                      }}
                    >
                      <div key="spacer"><Box sx={{height: "110px"}}/></div>
                      {!selectedLocation.reviews || selectedLocation.reviews?.length === 0 && (
                        <Typography sx={modalBodyStyle} component="p">Be the first to leave a review!</Typography>
                      )}
                      {selectedLocation.reviews?.length >= 1 &&
                        selectedLocation.reviews.map((reviewItem: any) => {
                          const {reviewer, ts, reviewerName, rating, review} = reviewItem;
                          return (
                            <div key={`${ts}-container`}>
                              <ItemStatus
                                id="0000000000"
                                username={reviewerName}
                                userid={reviewer}
                                date={ts}
                                text={review}
                                action="coment"
                                value={rating}
                                tag=""
                                collection=""
                                hidden={false}
                              />
                            </div>
                          );
                        })}
                    </Stack>
                  </Box>
                </SimpleScrollContainer>
              </Box>
            )}
        </Box>
      </Modal>
      <MapLayersModal
        open={showLayerModal}
        onClose={closeLayerModal}
        layerModalSizeStyle={layerModalSizeStyle}
        layerStates={layerStates}
        onToggle={handleLayerSwitch}
        showDev={state?.user?.factions?.some(f => f.id === NEONAV_MAINT) ?? false} // ew
      />
      <Box sx={footerStyle} hidden={!showInfoModal}>
        <FooterNav
          firstHexProps={{
            icon: <ShareLocationIcon/>,
            // TODO: Create sharable link that is either knownLocation or custom dragable pin on map
          }}
          secondHexProps={{
            icon: <RateReviewIcon/>
            // TODO: Dialog to add review
          }}
          bigHexProps={{
            icon: <EditLocationAltIcon/>,
            // TODO: Switch to edit modal and begin editing
          }}
          thirdHexProps={{
            icon: <EventIcon/>,
            // TODO: View events associated with location
          }}
          fourthHexProps={{
            icon: userLocationKnown ? <MyLocationIcon/> : <LocationSearchingIcon/>,
            disabled: typeof window === 'undefined' || !window?.isSecureContext,
          }}
        />
      </Box>
      <Box sx={footerStyle} hidden={showInfoModal}>
        <FooterNav
          firstHexProps={{
            icon: <PersonPinCircleIcon/>,
            // TODO: Create sharable link that is either knownLocation or custom dragable pin on map
          }}
          secondHexProps={{
            icon: <AddLocationIcon/>,
            // TODO: Link to admin page to generate new location
          }}
          bigHexProps={{
            icon: <FilterListIcon/>,
            handleAction: openLayerModal,
          }}
          thirdHexProps={{}}
          fourthHexProps={{
            icon: userLocationKnown ? <MyLocationIcon/> : <LocationSearchingIcon/>,
            // TODO: Move this to a function
            handleAction: () => {
              if (mapRef.current) {
                let myMap = myMapObjects.get("map") as L.Map;
                if (userLocationKnown) {
                  myMap.flyTo(lastKnownLocation);
                } else {
                  myMap.locate({watch: true, maximumAge: 15000});
                }
              }
            },
            disabled: typeof window === 'undefined' || !window?.isSecureContext,
          }}
        />
      </Box>
    </Container>
  )
}