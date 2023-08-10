import { Height } from '@mui/icons-material';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderWidth: {
        '1':'1px',
      },
      width:{
        '75':'19rem',
        '95':'24rem',
        '96':'24.5',
        '97':'26rem',
        '98':'34rem',
        '100':'35rem',
        '102':'36rem',
        '105':'40rem',
        '108':'42rem',
        '110':'45rem',
        '115':'50rem',
        '120':'55rem',
        '96.5%':'96%',
        '97%':'97.2%'
      },
      screens: {
        '3xl': '1600px', // Custom breakpoint for desktop monitors
      },
      spacing: {
        '18':'4.5rem',
        '23':'5rem',
        '29':'7.2rem',
        '31':'7rem',
        '38':'9.5rem',
        '67':'17.4rem',
        '68':'18rem',
        '69':'18.3rem',
        '100':'28rem',
        '105':'32rem',
        '110':'35rem',
      },
      margin: {
        '13':'3.2rem',
      },
      height: {
        '130':'45rem'
      }
    },
  },
  plugins: [],
}