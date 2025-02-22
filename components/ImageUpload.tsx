'use client';

import React, { useRef, useState } from 'react';
import { IKImage, ImageKitProvider, IKUpload } from 'imagekitio-next';
import config from '@/lib/config';
import ImageKit from 'imagekit';
import Image from 'next/image';
import { FilePath } from 'tailwindcss/types/config';
import { toast, useToast } from '@/hooks/use-toast';

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status} : ${errorText} `);
    }

    const data = await response.json();
    const { signature, expire, token } = data;

    return {
      token,
      expire,
      signature,
    };
  } catch (error: any) {
    throw new Error(`Authentication failed: ${error.message}`);
  }
};

const {
  env: {
    imageKit: { urlEndpoint, publicKey },
  },
} = config;

console.log(config);

const ImageUpload = ({ onFileChange }: { onFileChange: (filePath: string) => void }) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string | null }>({ filePath: null });

  const onError = (error: any) => {
    console.log('error', error);
    toast({
        title: "Image upload failed",
        description: `Your image upload failed please try again`,
        variant: 'destructive',
      })
  };

  const onSuccess = (res: any) => {
    setFile({ filePath: res.filePath });
    onFileChange(res.filePath);

    toast({
      title: 'Image uploaded successfully',
      description: `${res.filePath} uploaded successfully`,
    });
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        className="hidden"
        ref={ikUploadRef}
        onSuccess={onSuccess}
        onError={onError}
        fileName="test-upload.png"
      ></IKUpload>

      <button
        className="upload-btn form-input"
        onClick={(e) => {
          e.preventDefault();
          if (ikUploadRef.current) {
            //@ts-ignore
            ikUploadRef.current?.click();
          }
        }}
      >
        <Image
          src={'/icons/upload.svg'}
          alt="upload"
          width={20}
          height={20}
          className="object-contain"
        />
        <p className="text-xs text-light-100">Upload ID Card File</p>
        {file && <p className="upload-filename">{file.filePath}</p>}
      </button>
      {file.filePath && (
        <IKImage
          alt={file.filePath}
          path={file.filePath}
          width={500}
          height={300}
        />
      )}
    </ImageKitProvider>
  );
};

export default ImageUpload;
