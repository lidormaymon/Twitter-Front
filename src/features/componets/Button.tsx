import { ButtonHTMLAttributes} from 'react';
import Loader from './Loader';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text:string,
    isLoading?:boolean
}

const Button: React.FC<ButtonProps> = ({ text, className,isLoading, ...props}) => {
  return (
    <div>
        <button {...props} className={`bg-blue-600 h-11 w-24 rounded-full font-semibold ${className}`}>
          {isLoading ? (<div className='relative left-13'><Loader isTextLoading={false}  /></div>) : text}
        </button>
    </div>
  )
}

export default Button