import * as React from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

const Channels = (props: SvgIconProps) => (
    <SvgIcon {...props} style={{filter: 'drop-shadow(#43b3e6 0px 0px 4px)'}}>
        <path d="M17,12V3A1,1 0 0,0 16,2H3A1,1 0 0,0 2,3V17L6,13H16A1,1 0 0,0 17,12M21,6H19V15H6V17A1,1 0 0,0 7,18H18L22,22V7A1,1 0 0,0 21,6Z" />
    </SvgIcon>
);

export default Channels;