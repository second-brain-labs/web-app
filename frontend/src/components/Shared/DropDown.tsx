import React, {useState} from 'react';
import { Stack, Typography } from '@mui/material';



const DropDown = () => {

    const [open, setOpen] = useState(false);
    return (<>
        {!open &&
        <Stack onClick={()=>setOpen(true)}>
            <Typography>My Spaces</Typography>
        </Stack>
        }
        {open &&
            <>
            <Stack onClick={()=>setOpen(false)}>
                <Typography>My Spaces</Typography>
            </Stack>
            <li>
                <ul>Space 1</ul>
                <ul>Space 2</ul>
            </li>

            </>
        }
        </>
        
    );
}

export default DropDown;