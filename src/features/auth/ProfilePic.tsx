import { ImgHTMLAttributes } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectProfilePic } from './authSlice';

interface ImageComponentProps extends ImgHTMLAttributes<HTMLImageElement>{
  image?:string
  }

const ProfilePic: React.FC<ImageComponentProps> = ({image,className, ...rest}) => {
    const API_SERVER = 'http://127.0.0.1:8000/'



    const getImageUrl = (imagePath: string) => {
        return `${API_SERVER}${imagePath}`;
      }
  return (
    <div>
        <img src={getImageUrl(image || '')} className={`rounded-full ${className}`}  width={'50px'}   {...rest} />
    </div>
  )
}

export default ProfilePic