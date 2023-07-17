enum ANSI_COLOR {
  YELLOW,
  RED,
  GREEN,
  BLUE,
  ORANGE,
  PURPLE
}

const COLORS: Record<ANSI_COLOR, string> = {
  [ANSI_COLOR.YELLOW]: "\x1b[33m",
  [ANSI_COLOR.RED]: "\x1b[31m}",
  [ANSI_COLOR.GREEN]: "\x1b[32m",
  [ANSI_COLOR.BLUE]: "\x1b[34m",
  [ANSI_COLOR.ORANGE]: "\x1b[38;5;208m",
  [ANSI_COLOR.PURPLE]: "\x1b[35m"
};

const color = (c: ANSI_COLOR, text: string) => `${COLORS[c]}${text}\x1b[0m`;
const bold = (text: string | number) => `\x1b[1m${text}\x1b[0m`;

export const welcomeBanner = () => {
  const ENV = process.env.NODE_ENV;
  const PORT = process.env.PORT || 3000;

  const banner = `
        *********************************************************************************************
                                                                                                  
            Welcome to ${color(
              ANSI_COLOR.YELLOW,
              bold("Traceo")
            )}!                                  
            Application started in ${bold(ENV)} mode at port ${bold(PORT)}                
                                                                                                  
            Please report any bug here:                                
            https://github.com/traceo-dev/traceo/issues/new                    
                                                                                                 
        *********************************************************************************************
    `;

  console.log(banner);
};
