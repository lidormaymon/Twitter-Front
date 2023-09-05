import { ButtonHTMLAttributes} from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text:string
}

const Button: React.FC<ButtonProps> = ({ text, className, ...props}) => {
  return (
    <div>
        <button {...props} className={`bg-blue-600 h-11 w-24 rounded-full font-semibold ${className}`}>{text}</button>
    </div>
  )
}

export default Button