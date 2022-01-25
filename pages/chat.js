import { Box } from '@skynexui/components';
import appConfig from '../config.json';
export default function CharArcade() {
    return (
        <>
            <Box
                styleSheet={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: appConfig.theme.colors.primary[500],
                    backgroundImage: 'url(https://wallpaperaccess.com/full/782955.jpg)',
                    backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                }}
            >
                <div style={{color:"#FFFF"}}>Página do Chat</div>
            </Box>
        </>)
}