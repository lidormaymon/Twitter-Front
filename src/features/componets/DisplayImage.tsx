import React, { ImgHTMLAttributes, useEffect, useState } from 'react'

interface ImageComponentProps extends ImgHTMLAttributes<HTMLImageElement> {
    image: string,
}

const DisplayImage: React.FC<ImageComponentProps> = ({ image }) => {
    const API_SERVER = 'http://127.0.0.1:8000';
    const [imageUrl, setImageUrl] = useState<string>('');

    const getImageUrl = (imagePath: string) => {
        return `${API_SERVER}${imagePath}`;
    }
    
    useEffect(() => {
        if (image) {
            setImageUrl(image)
        } else setImageUrl('')
    }, [image])
    return (
        <>
            {imageUrl && (
                <img src={getImageUrl(imageUrl)} className="h-30" />
            )}
        </>
    )
}

export default DisplayImage